// // File: src/context/ChatContext.jsx
// // Versi 3.0: Sekarang menjadi "Pusat Kontrol" penuh

// import { createContext, useContext, useState } from 'react';

// // 1. Buat Context
// const ChatContext = createContext();

// // 2. Buat Hook (cara mudah untuk mengakses)
// export const useChat = () => useContext(ChatContext);

// // 3. Buat "Provider" (Penyedia) - Ini akan membungkus App.js
// export const ChatProvider = ({ children }) => {
//   // === STATE PUSAT ===

//   // BARU: State untuk mengontrol "Sesi Chat Aktif"
//   // (Dikontrol oleh Toggle Sidebar & Tombol Close)
//   const [isChatActive, setIsChatActive] = useState(false);

//   // BARU: State untuk menyimpan SEMUA riwayat percakapan
//   const [messages, setMessages] = useState([]);

//   // (State lama yang masih kita butuhkan)
//   const [lastSource, setLastSource] = useState('Siap');
//   const [isLoading, setIsLoading] = useState(false);

//   // (State ini akan diisi oleh DateBubble)
//   const [bubblePosition, setBubblePosition] = useState({ x: 0, y: 0 });

//   // === KONFIGURASI ===
//   const VERCEL_API_ENDPOINT =
//     'https://genius-web-backend.vercel.app/api/router';

//   // === FUNGSI UTAMA (LOGIKA API) ===
//   const handleSubmitPrompt = async (task, prompt) => {
//     if (isLoading) return;
//     setIsLoading(true);

//     // 1. Tambahkan pesan PENGGUNA ke riwayat
//     const userMessage = {
//       sender: 'user',
//       text: prompt,
//       task: task,
//     };
//     // Kita tambahkan pesan pengguna ke 'messages'
//     setMessages((prevMessages) => [...prevMessages, userMessage]);

//     try {
//       // 2. Kirim ke backend (backend kita tidak berubah)
//       const response = await fetch(VERCEL_API_ENDPOINT, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           task: task,
//           prompt: prompt,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.details || 'Terjadi error di server');
//       }

//       const data = await response.json();

//       // 3. Buat pesan AI yang baru
//       // PENTING: Kita ganti nama 'reply_text' menjadi 'text' agar konsisten
//       const aiMessage = {
//         sender: 'ai',
//         text: data.reply_text, // 'text' sekarang
//         source: data.source,
//       };

//       // 4. Tambahkan pesan AI ke riwayat
//       setMessages((prevMessages) => [...prevMessages, aiMessage]);
//       setLastSource(data.source || 'Unknown'); // Perbarui source
//     } catch (error) {
//       // 5. Tambahkan pesan ERROR ke riwayat
//       const errorMsg = {
//         sender: 'ai',
//         text: `Maaf, terjadi error: ${error.message}`, // 'text' sekarang
//         source: 'system-error',
//       };
//       setMessages((prevMessages) => [...prevMessages, errorMsg]);
//       setLastSource('Error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 6. "Bagikan" semua state dan fungsi ini ke komponen "anak"
//   const value = {
//     isChatActive, // Apakah sesi chat aktif?
//     setIsChatActive, // Fungsi untuk mengaktifkan/menonaktifkan chat

//     messages, // SELURUH riwayat chat
//     setMessages, // (Untuk mengedit, dll)

//     lastSource, // Source terakhir (untuk UserInputBar)
//     isLoading, // Apakah AI sedang berpikir?
//     handleSubmitPrompt, // Fungsi untuk mengirim prompt

//     bubblePosition,
//     setBubblePosition, // DateBubble akan melaporkan posisinya
//   };

//   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
// };
//
//
//
//
//
// File: src/context/ChatContext.jsx
// Versi 3.1: Ditambahkan ID, Timestamp, dan Fungsi Edit

import { createContext, useContext, useState } from 'react';

// 1. Buat Context
const ChatContext = createContext();

// 2. Buat Hook (cara mudah untuk mengakses)
export const useChat = () => useContext(ChatContext);

// 3. Buat "Provider" (Penyedia) - Ini akan membungkus App.js
export const ChatProvider = ({ children }) => {
  // === STATE PUSAT ===

  const [isChatActive, setIsChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [lastSource, setLastSource] = useState('Siap');
  const [isLoading, setIsLoading] = useState(false);
  const [bubblePosition, setBubblePosition] = useState({ x: 0, y: 0 });

  // === KONFIGURASI ===
  const VERCEL_API_ENDPOINT =
    'https://genius-web-backend.vercel.app/api/router';

  // === FUNGSI UTAMA (LOGIKA API) ===
  const handleSubmitPrompt = async (task, prompt) => {
    if (isLoading) return;
    setIsLoading(true);

    // 1. Tambahkan pesan PENGGUNA ke riwayat
    const userMessage = {
      // ▼▼▼ TAMBAHAN 1: ID dan Timestamp untuk User ▼▼▼
      id: Date.now(),
      timestamp: new Date(),
      // ▲▲▲
      sender: 'user',
      text: prompt,
      task: task,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // 2. Kirim ke backend
      const response = await fetch(VERCEL_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: task,
          prompt: prompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Terjadi error di server');
      }

      const data = await response.json();

      // 3. Buat pesan AI yang baru
      const aiMessage = {
        // ▼▼▼ TAMBAHAN 1: ID dan Timestamp untuk AI ▼▼▼
        id: Date.now() + 1, // +1 agar ID tidak bentrok dengan userMessage
        timestamp: new Date(),
        // ▲▲▲
        sender: 'ai',
        text: data.reply_text,
        source: data.source,
      };

      // 4. Tambahkan pesan AI ke riwayat
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setLastSource(data.source || 'Unknown');
    } catch (error) {
      // 5. Tambahkan pesan ERROR ke riwayat
      const errorMsg = {
        // ▼▼▼ TAMBAHAN 1: ID dan Timestamp untuk Error ▼▼▼
        id: Date.now() + 1,
        timestamp: new Date(),
        // ▲▲▲
        sender: 'ai',
        text: `Maaf, terjadi error: ${error.message}`, ///Maaf, terjadi error:
        source: 'system-error',
      };
      setMessages((prevMessages) => [...prevMessages, errorMsg]);
      setLastSource('Error');
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================================
  // ▼▼▼ TAMBAHAN 2: FUNGSI UNTUK MENG-EDIT PESAN ▼▼▼
  // ==========================================================
  // const handleEditMessage = (messageId, newText) => {
  //   setMessages(
  //     (
  //       currentMessages // Ambil daftar pesan saat ini
  //     ) =>
  //       currentMessages.map(
  //         (
  //           msg // Loop melalui setiap pesan
  //         ) => (msg.id === messageId ? { ...msg, text: newText } : msg)
  //         // Jika ID cocok, ganti 'text'-nya. Jika tidak, biarkan.
  //       )
  //   );
  // };
  // ==========================================================

  // 6. "Bagikan" semua state dan fungsi ini ke komponen "anak"
  const value = {
    isChatActive,
    setIsChatActive,

    messages,
    setMessages, // Anda sudah punya ini, bagus untuk fungsi hapus/edit

    lastSource,
    isLoading,
    handleSubmitPrompt,

    bubblePosition,
    setBubblePosition,

    // ==========================================================
    // ▼▼▼ TAMBAHAN 3: BAGIKAN FUNGSI EDIT BARU ▼▼▼
    // ==========================================================
    // handleEditMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
