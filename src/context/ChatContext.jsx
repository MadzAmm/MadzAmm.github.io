// import { createContext, useContext, useState } from 'react';

// // 1. Buat Context
// const ChatContext = createContext();

// // 2. Buat Hook (cara mudah untuk mengakses)
// export const useChat = () => useContext(ChatContext);

// // 3. Buat "Provider"
// export const ChatProvider = ({ children }) => {
//   // === STATE PUSAT ===
//   const [isChatActive, setIsChatActive] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [lastSource, setLastSource] = useState('Siap');
//   const [isLoading, setIsLoading] = useState(false);
//   const [bubblePosition, setBubblePosition] = useState({ x: 0, y: 0 });

//   // === KONFIGURASI ===
//   const VERCEL_API_ENDPOINT =
//     'https://genius-web-backend.vercel.app/api/router';

//   // === FUNGSI UTAMA (LOGIKA API) ===
//   const handleSubmitPrompt = async (task, prompt) => {
//     if (isLoading) return;
//     setIsLoading(true);

//     // 1. Tambahkan pesan PENGGUNA ke UI (Tampilan)
//     const userMessage = {
//       id: Date.now(),
//       timestamp: new Date(),
//       sender: 'user',
//       text: prompt,
//       task: task,
//     };

//     // Update State UI segera
//     setMessages((prevMessages) => [...prevMessages, userMessage]);

//     try {
//       // ============================================================
//       // ▼▼▼ PERUBAHAN UTAMA: PERSIAPAN HISTORY CHAT ▼▼▼
//       // ============================================================

//       // Kita harus mengubah format data frontend menjadi format data backend.
//       // Frontend: { sender: 'user'/'ai', text: '...' }
//       // Backend butuh: { role: 'user'/'assistant', content: '...' }

//       const historyPayload = messages
//         // A. Filter: Jangan kirim pesan error sistem ke AI
//         .filter((msg) => msg.source !== 'system-error')
//         // B. Formatting
//         .map((msg) => ({
//           role: msg.sender === 'user' ? 'user' : 'assistant', // Mapping Role
//           content: msg.text,
//         }));

//       // C. Masukkan pesan TERBARU (userMessage) ke dalam payload
//       // (Kita push manual karena state 'messages' di atas mungkin belum selesai update secara asinkron)
//       historyPayload.push({ role: 'user', content: prompt });

//       // ============================================================
//       // ▲▲▲ AKHIR PERSIAPAN HISTORY ▲▲▲
//       // ============================================================

//       // 2. Kirim ke backend (Sekarang kirim 'messages', bukan 'prompt')
//       const response = await fetch(VERCEL_API_ENDPOINT, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           task: task,
//           messages: historyPayload, // <--- INI KUNCINYA
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.details || 'Terjadi error di server');
//       }

//       const data = await response.json();
//       //DEBUG OTAK=====================================4 (LANJUTAN DARI BACKEND CODE)
//       // ▼▼▼ CEK BUKTI DISINI ▼▼▼
//       console.group('🔍 DIAGNOSA AI BACKEND');
//       console.log('Sumber Jawaban:', data.source);

//       if (data.used_summary) {
//         console.log(
//           '%c✅ SUMMARIZER AKTIF!',
//           'color: green; font-weight: bold;'
//         );
//         console.log('Isi Ringkasan:', data.used_summary);
//       } else {
//         console.log(
//           '%c⚪ Mode Chat Biasa (Belum ada ringkasan)',
//           'color: gray;'
//         );
//       }
//       console.groupEnd(); //================================
//       // 3. Buat pesan AI yang baru
//       const aiMessage = {
//         id: Date.now() + 1,
//         timestamp: new Date(),
//         sender: 'ai',
//         text: data.reply_text,
//         source: data.source,
//       };

//       // 4. Tambahkan pesan AI ke riwayat UI
//       setMessages((prevMessages) => [...prevMessages, aiMessage]);
//       setLastSource(data.source || 'Unknown');
//     } catch (error) {
//       // 5. Tambahkan pesan ERROR ke riwayat
//       const errorMsg = {
//         id: Date.now() + 1,
//         timestamp: new Date(),
//         sender: 'ai',
//         text: `Maaf, terjadi error: ${error.message}`,
//         source: 'system-error', // Label khusus agar tidak ikut terkirim ke AI nanti
//       };
//       setMessages((prevMessages) => [...prevMessages, errorMsg]);
//       setLastSource('Error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 6. Bagikan Value
//   const value = {
//     isChatActive,
//     setIsChatActive,
//     messages,
//     setMessages,
//     lastSource,
//     isLoading,
//     handleSubmitPrompt,
//     bubblePosition,
//     setBubblePosition,
//   };

//   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
// };
//
//
//
//
//
//
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

      // ==========================================================
      // ▼▼▼ LOGIKA STREAM READER (STREAMING) ▼▼▼
      // ==========================================================
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullText = '';
      let currentSource = 'AI';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });

        // Backend mengirim data dalam format SSE: "data: {...}\n\n"
        // Kita perlu memecah chunk barangkali ada banyak data sekaligus
        const lines = chunkValue.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.replace('data: ', '').trim();
              if (jsonStr === '[DONE]') continue; // Sinyal selesai

              const data = JSON.parse(jsonStr);

              if (data.type === 'meta') {
                // A. Metadata (Info Source / Summary)
                currentSource = data.source;
                setLastSource(data.source);

                // Debug Log Summary
                console.groupCollapsed('🔍 STREAM DIAGNOSIS');
                console.log('Source:', data.source);
                if (data.summary) console.log('✅ Summary Used:', data.summary);
                else console.log('⚪ No Summary');
                console.groupEnd();
              } else if (data.type === 'chunk') {
                // B. Chunk Teks (Isi Chat)
                if (data.content) {
                  fullText += data.content;

                  // Update UI secara real-time
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
            } catch (e) {
              // Abaikan jika JSON parse error (biasanya potongan chunk tidak utuh)
            }
          }
        }
      }
      // ==========================================================
      // ▲▲▲ SELESAI STREAMING ▲▲▲
      // ==========================================================
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
