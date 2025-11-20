import { useState, useRef, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useChat } from '../../context/ChatContext';

import {
  FiX,
  FiEdit2,
  FiCopy,
  FiCheck,
  FiMeh,
  FiFrown,
  FiSmile,
  FiMoreHorizontal,
  FiUser,
  FiGitlab,
} from 'react-icons/fi';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './SpeechBubble.scss';
import { ButtonReveal } from '../buttonReveal/ButtonReveal';

// Impor TextareaAutosize
import TextareaAutosize from 'react-textarea-autosize';

//
// Komponen Sub: MessageItem  ======
// ==========================================================
const MessageItem = ({ message, onSubmitEditedPrompt }) => {
  // <-- Terima prop 'onEdit' kalau mau bisa save edit chat
  const [hasCopied, setHasCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleResubmit = () => {
    if (editedText.trim()) {
      onSubmitEditedPrompt(message.task, editedText); // Kirim ID dan teks baru
      setIsEditing(false);
    }
  };

  const isUser = message.sender === 'user';

  // Format timestamp (jam:menit)
  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className={`message-item ${isUser ? 'user-message' : 'ai-message'}`}>
      <div className='message-header'>
        <div className='profile'>
          <div className='message-avatar-circle'>
            {isUser ? (
              <FiUser style={{ marginLeft: '3.5px', marginTop: '2px' }} />
            ) : (
              <FiGitlab
                style={{
                  marginLeft: '3.5px',
                  marginTop: '4px',
                }}
              />
            )}
          </div>
          <span>
            {isUser
              ? 'Here your message and imagination unfold'
              : 'Let it flow'}
          </span>
        </div>
        <div className='message-controls'>
          {/* --- 1. TIMESTAMP DITAMBAHKAN DI SINI --- */}
          <span className='message-timestamp'>{formattedTime}</span>

          {/* --- 2. TOMBOL EDIT DIAKTIFKAN --- */}
          {isUser && (
            <button
              whileTap={{ scale: '0.85' }}
              title='Edit dan kirim ulang'
              onClick={() => setIsEditing(true)}
              disabled={isEditing} // Nonaktifkan jika sedang mengedit
            >
              <FiEdit2 />
            </button>
          )}

          <button
            title='Salin'
            whileTap={{ scale: '0.85' }}
            onClick={() => handleCopy(message.text)}>
            {hasCopied ? (
              <FiCheck style={{ color: '#76fbdaff' }} />
            ) : (
              <FiCopy />
            )}
          </button>
        </div>
      </div>

      {/* --- 3. AREA EDIT DITAMBAHKAN --- */}
      <div className='message-body'>
        {isEditing ? (
          <div className='edit-area'>
            <TextareaAutosize
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              minRows={3}
              autoFocus
            />
            <div className='edit-controls'>
              <ButtonReveal
                className='edit-cancel'
                whileTap={{ scale: '0.85' }}
                onClick={() => setIsEditing(false)}>
                Cancel
              </ButtonReveal>
              <button
                className='edit-resubmit'
                whileTap={{ scale: '0.85' }}
                disabled={!editedText.trim()}
                onClick={handleResubmit}>
                Resubmit
              </button>
            </div>
          </div>
        ) : (
          // Ini adalah kode <ReactMarkdown>
          <ReactMarkdown
            components={{
              code(props) {
                // ... (kode renderer)
                const { children, className, ...rest } = props;
                const match = /language-(\w+)/.exec(className || '');
                const lang = match ? match[1] : 'text';
                const codeText = String(children).replace(/\n$/, '');

                return (
                  <div className='code-block-wrapper'>
                    <SyntaxHighlighter
                      {...rest}
                      style={vscDarkPlus}
                      language={lang}
                      PreTag='div'>
                      {codeText}
                    </SyntaxHighlighter>
                    <button
                      className='code-copy-button'
                      whileTap={{ scale: '0.85' }}
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
        )}
      </div>
    </div>
  );
};

//  Komponen Utama: SpeechBubble (DIMODIFIKASI) =====
// ==========================================================
export default function SpeechBubble() {
  // Ambil 'handleEditMessage' dari context
  const {
    messages,
    lastSource,
    setIsChatActive,
    isLoading,
    handleEditMessage,
    handleSubmitPrompt,
  } = useChat();

  const messagesEndRef = useRef(null);
  const dragControls = useDragControls();
  //  1.  fungsi "Unlock" yang bisa dipakai ulang
  const unlockScroll = () => {
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  };

  // 2. Modifikasi startDrag dan stopDrag
  const startDrag = (event) => {
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    dragControls.start(event);
  };

  // 'stopDrag' sekarang hanya memanggil 'unlockScroll'
  const stopDrag = () => {
    unlockScroll();
  };

  //  3. KUNCI PERBAIKAN
  useEffect(() => {
    // Fungsi ini akan dijalankan saat komponen 'mount' (muncul)

    // 'return' di dalam useEffect adalah FUNGSI CLEANUP
    // Ini akan otomatis dijalankan saat komponen 'unmount' (ditutup)
    return () => {
      // Pastikan untuk membuka kunci scroll saat komponen ditutup,
      // untuk jaga-jaga jika 'onDragEnd' tidak terpicu.
      unlockScroll();
    };
  }, []); // [] = jalankan hanya saat mount dan unmount

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // (Fungsi renderStatusIcon )
  const renderStatusIcon = () => {
    // 1. Saat loading
    if (isLoading) {
      return (
        <DotLottieReact
          src='/starGlobe.json'
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
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragEnd={stopDrag}>
      <div
        className='window-header'
        onPointerDown={startDrag}>
        <div className='header-left-group'>
          {/* MODIFIKASI: Panggil fungsi helper di sini */}
          <div className='loading-status-icon'>{renderStatusIcon()}</div>

          {/* Toggle Model */}
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

        {/*  HANDLE DI SINI === */}
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
          whileTap={{ scale: '0.85' }}
          onClick={() => setIsChatActive(false)}>
          <FiX style={{ marginTop: '5px' }} />
        </ButtonReveal>
      </div>
      {/* Riwayat Chat (Scrollable) */}
      <div className='chat-history-area'>
        {messages.map((msg, index) => (
          <MessageItem
            // PENTING: Gunakan 'msg.id' sebagai key, BUKAN 'index'
            key={msg.id || index}
            message={msg}
            onSubmitEditedPrompt={handleSubmitPrompt}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </motion.div>
  );
}
