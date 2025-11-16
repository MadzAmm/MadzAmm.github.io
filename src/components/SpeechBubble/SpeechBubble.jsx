import { useState, useRef, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useChat } from '../../context/ChatContext';

// MODIFIKASI: Tambahkan FiMeh, FiFrown, FiSmile
import {
  FiX,
  FiEdit2,
  FiCopy,
  FiCheck,
  FiMeh,
  FiFrown,
  FiSmile,
  FiMoreHorizontal,
} from 'react-icons/fi';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './SpeechBubble.scss';
import { ButtonReveal } from '../buttonReveal/ButtonReveal';
import { TbBackground } from 'react-icons/tb';

// --- Komponen Sub: MessageItem ---
// (Tidak ada perubahan di sini, MessageItem tetap sama)
const MessageItem = ({ message }) => {
  const [hasCopied, setHasCopied] = useState(false);

  // Fungsi untuk menyalin teks
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000); // Reset ikon 'check'
  };

  const isUser = message.sender === 'user';

  return (
    <div className={`message-item ${isUser ? 'user-message' : 'ai-message'}`}>
      <div className='message-header'>
        {/* Tampilkan 'User' atau 'Genius Bubble' */}
        <span>{isUser ? 'User' : 'Genius Bubble'}</span>
        <div className='message-controls'>
          {/* Tombol Edit hanya untuk 'User' */}
          {isUser && <button title='Edit'>{/* <FiEdit2 /> */}</button>}
          {/* Tombol Copy untuk semua */}
          <button
            title='Salin'
            onClick={() => handleCopy(message.text)}>
            {hasCopied ? <FiCheck style={{ color: 'green' }} /> : <FiCopy />}
          </button>
        </div>
      </div>

      {/* Bagian Teks/Markdown (Sesuai permintaan 'Word/Doc') */}
      <div className='message-body'>
        <ReactMarkdown
          components={{
            // Ini adalah bagian PENTING untuk me-render kode
            // Sesuai permintaan Anda ("tampilan code editor")
            code(props) {
              const { children, className, ...rest } = props;
              const match = /language-(\w+)/.exec(className || '');
              const lang = match ? match[1] : 'text';

              const codeText = String(children).replace(/\n$/, '');

              return (
                <div className='code-block-wrapper'>
                  <SyntaxHighlighter
                    {...rest}
                    style={vscDarkPlus} // Tema warna
                    language={lang}
                    PreTag='div'>
                    {codeText}
                  </SyntaxHighlighter>

                  {/* Tombol Copy Khusus Kode (permintaan Anda) */}
                  <button
                    className='code-copy-button'
                    title='Salin kode'
                    onClick={() => navigator.clipboard.writeText(codeText)}>
                    <FiCopy />
                  </button>
                </div>
              );
            },
          }}>
          {message.text}
        </ReactMarkdown>
      </div>
    </div>
  );
};

// --- Komponen Utama: SpeechBubble (Jendela Chat) ---
export default function SpeechBubble() {
  // MODIFIKASI: Kita sudah mengambil semua yang dibutuhkan (messages, lastSource, isLoading)
  const { messages, lastSource, setIsChatActive, isLoading } = useChat();
  const messagesEndRef = useRef(null);

  const dragControls = useDragControls();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // BARU: Fungsi helper untuk merender ikon status
  const renderStatusIcon = () => {
    // 1. Saat loading
    if (isLoading) {
      return (
        <DotLottieReact
          src='/starGlobe.json' // GANTI DENGAN NAMA FILE LOTTIE LOADING ANDA
          loop
          autoplay
        />
      );
    }

    // 2. Saat awal pertama kali (belum ada chat)
    if (messages.length === 0) {
      return <FiMeh />; // Ikon netral/initial
    }

    // 3. Saat terjadi error
    if (lastSource === 'Error' || lastSource === 'system-error') {
      return <FiFrown className='icon-frown' />; // Ikon error
    }

    // 4. Saat tidak loading dan tidak error (sukses/idle)
    return <FiSmile className='icon-smile' />; // Ikon sukses
  };

  return (
    <motion.div
      className='speech-bubble-window'
      initial={{ opacity: 0, scale: 0.95, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 50 }}
      transition={{ ease: 'easeInOut', duration: 0.3 }}
      // === 3. MODIFIKASI DRAG PROPS ===
      drag // Tetap bisa di-drag
      dragControls={dragControls} // Tautkan ke handle
      dragListener={false} // PENTING: nonaktifkan drag di bodinya
      dragMomentum={false}
      // Kita TIDAK perlu 'style' atau 'whileTap' di sini lagi
      // === AKHIR MODIFIKASI ===
    >
      <div
        className='window-header'
        onPointerDown={(event) => dragControls.start(event)}>
        <div className='header-left-group'>
          {/* MODIFIKASI: Panggil fungsi helper di sini */}
          <div className='loading-status-icon'>{renderStatusIcon()}</div>

          {/* Toggle Model (Sesuai desain Anda) */}
          <div
            className='model-toggle'
            title={isLoading ? 'Sedang berpikir...' : 'Model yang digunakan'}>
            {isLoading ? (
              <span className='thinking-text'>Thinking......</span>
            ) : (
              <>
                <span>&gt;&gt;</span>
                <span>{lastSource}</span>
              </>
            )}
          </div>
        </div>

        {/* === 4. TAMBAHKAN HANDLE DI SINI === */}
        <div
          className='drag-handle'
          // 'onPointerDown' bekerja untuk mouse (desktop) & touch (ponsel)
        >
          <FiMoreHorizontal />
        </div>
        {/* === AKHIR HANDLE === */}

        {/* Tombol Tutup (Sesuai desain Anda) */}
        <ButtonReveal
          className='close-chat-button'
          title='Tutup Sesi Chat'
          onClick={() => setIsChatActive(false)}>
          <FiX style={{ marginTop: '5px' }} />
        </ButtonReveal>
      </div>

      {/* Riwayat Chat (Scrollable) */}
      <div className='chat-history-area'>
        {/* ... (kode riwayat chat Anda tetap sama) ... */}
        {messages.map((msg, index) => (
          <MessageItem
            key={index}
            message={msg}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </motion.div>
  );
}
//
//
//
//
//
//
//
//
