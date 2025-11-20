import { createContext, useContext, useState, useRef } from 'react';

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);
export const ChatProvider = ({ children }) => {
  // === STATE ===
  const [isChatActive, setIsChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [lastSource, setLastSource] = useState('Siap');
  const [isLoading, setIsLoading] = useState(false);
  const [bubblePosition, setBubblePosition] = useState({ x: 0, y: 0 });

  // Ref untuk menyimpan pesan yang sedang distreaming agar tidak re-render berlebihan
  const streamingMessageRef = useRef('');

  const VERCEL_API_ENDPOINT =
    'https://genius-web-backend.vercel.app/api/router';

  // === FUNGSI UTAMA ===
  const handleSubmitPrompt = async (task, prompt) => {
    if (isLoading) return;
    setIsLoading(true);
    streamingMessageRef.current = ''; // Reset buffer

    // 1. Setup Pesan User
    const userMessage = {
      id: Date.now(),
      timestamp: new Date(),
      sender: 'user',
      text: prompt,
      task: task,
    };
    setMessages((prev) => [...prev, userMessage]);

    // 2. Setup Pesan AI (Placeholder Kosong)
    const aiMessageId = Date.now() + 1;
    const initialAiMessage = {
      id: aiMessageId,
      timestamp: new Date(),
      sender: 'ai',
      text: '', // Awalnya kosong
      source: 'Thinking...',
      isStreaming: true, // Flag bahwa ini sedang mengetik
    };
    setMessages((prev) => [...prev, initialAiMessage]);

    try {
      // 3. Persiapan Payload (History Chat)
      const historyPayload = messages
        .filter((msg) => msg.source !== 'system-error')
        .map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        }));
      historyPayload.push({ role: 'user', content: prompt });

      // 4. Fetch ke Backend
      const response = await fetch(VERCEL_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, messages: historyPayload }),
      });

      if (!response.ok) throw new Error('Gagal menghubungi server AI');

      // LOGIKA STREAM READER
      // ==================================================
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullText = '';
      let currentSource = 'AI';
      let buffer = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        // Decode & Tambah ke Buffer
        const chunkValue = decoder.decode(value, { stream: !done });
        buffer += chunkValue;

        // Split berdasarkan baris baru (menangani \n atau \r\n)
        const lines = buffer.split(/\r?\n/);

        // Simpan sisa potongan terakhir ke buffer
        buffer = lines.pop();

        for (const line of lines) {
          // 1. Bersihkan spasi kiri/kanan
          const trimmedLine = line.trim();

          // 2. Skip baris kosong atau comment
          if (
            !trimmedLine ||
            trimmedLine === ':' ||
            trimmedLine.startsWith(':')
          )
            continue;

          // 3. Cek apakah ini baris data SSE
          if (trimmedLine.startsWith('data:')) {
            // 4. PEMBERSIHAN SUPER: Hapus 'data:' (case insensitive) dan spasi apapun setelahnya
            // Regex /^data:\s*/i artinya: Cari "data:", mau huruf besar/kecil, mau ada spasi atau tidak.
            let jsonStr = trimmedLine.replace(/^data:\s*/i, '').trim();

            if (jsonStr === '[DONE]') continue; // Selesai

            // 5. VALIDASI JSON SEBELUM PARSE PENTING!
            // Jika tidak diawali kurung kurawal { atau siku [, itu BUKAN JSON valid. Skip saja.
            if (!jsonStr.startsWith('{') && !jsonStr.startsWith('[')) {
              console.warn('⚠️ Skipping invalid JSON line:', jsonStr);
              continue;
            }

            try {
              const data = JSON.parse(jsonStr);

              // --- LOGIKA UPDATE STATE
              if (data.type === 'meta') {
                currentSource = data.source;
                setLastSource(data.source);
              } else if (data.type === 'chunk') {
                if (data.content) {
                  fullText += data.content;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === aiMessageId
                        ? { ...msg, text: fullText, source: currentSource }
                        : msg
                    )
                  );
                }
              } else if (data.type === 'error') {
                throw new Error(data.message);
              }
              // -----------------------------------------------------
            } catch (e) {
              // Log error tapi JANGAN bikin aplikasi crash (hanya skip baris rusak ini)
              console.error('❌ JSON Parse Fail pada:', jsonStr, e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream Error:', error);
      // Update pesan AI jadi error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                text: `Error: ${error.message}`,
                source: 'Error',
                isStreaming: false,
              }
            : msg
        )
      );
      setLastSource('Error');
    } finally {
      setIsLoading(false);
      // Tandai streaming selesai (hilangkan kursor kedip jika ada UI-nya)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
        )
      );
    }
  };

  const value = {
    isChatActive,
    setIsChatActive,
    messages,
    setMessages,
    lastSource,
    isLoading,
    handleSubmitPrompt,
    bubblePosition,
    setBubblePosition,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
