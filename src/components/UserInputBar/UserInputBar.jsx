import { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import {
  FiUpload,
  FiSend,
  FiChevronUp,
  FiChevronDown,
  FiMoreHorizontal,
} from 'react-icons/fi';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import './UserInputBar.scss';
import { ButtonReveal } from '../buttonReveal/ButtonReveal';

// Hook (useOnClickOutside) tetap sama
const useOnClickOutside = (ref, callback) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      callback(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, callback]);
};

// ==========================================================
// --- SUMBER DATA (SAMA) ---
// ==========================================================
const ALL_TASKS = [
  { id: 'chat_general', name: 'General' },
  { id: 'assistent_coding', name: 'Coding' },
  { id: 'info_portofolio', name: 'Who Am I' },
  { id: 'analisis_dokumen', name: 'Analisis Doc' },
  { id: 'studio_visual', name: 'Studio Visual' },
  { id: 'analisis_ml', name: 'Analisis ML' },
];

// Varian animasi (tetap sama)
const otherMenuVariants = {
  open: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
      staggerDirection: -1,
    },
  },
  closed: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: 1,
      when: 'afterChildren',
    },
  },
};

const otherItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: { y: { stiffness: 1000, velocity: -100 } },
  },
  closed: {
    y: 20,
    opacity: 0,
    transition: { y: { stiffness: 1000 } },
  },
};

export default function UserInputBar() {
  const { isLoading, handleSubmitPrompt } = useChat();

  const dragControls = useDragControls();
  // State Lokal
  const [prompt, setPrompt] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ==========================================================
  // --- STATE LOGIKA BARU (TASK 1, TASK 2, ACTIVE) ---
  // ==========================================================
  const [task1, setTask1] = useState(ALL_TASKS[0]); // Kiri: General
  const [task2, setTask2] = useState(ALL_TASKS[1]); // Kanan: Coding

  // 'General' aktif saat pertama kali load
  const [activeTaskID, setActiveTaskID] = useState(ALL_TASKS[0].id);

  //  1. Buat fungsi "Unlock" yang bisa dipakai ulang
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

  // 3. INI ADALAH KUNCI PERBAIKANNYA
  useEffect(() => {
    // Fungsi 'return' ini akan dijalankan saat komponen 'unmount'
    return () => {
      // Pastikan untuk membuka kunci scroll saat komponen ditutup
      unlockScroll();
    };
  }, []); // [] = jalankan hanya saat mount dan unmount
  //  AKHIR PERBAIKAN

  const dropdownRef = useRef(null);
  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    // Mengirim prompt berdasarkan task yang aktif
    handleSubmitPrompt(activeTaskID, prompt);
    setPrompt('');
    setIsExpanded(false);
  };

  // --- Logika Handler Baru ---
  const handleTaskSelect = (selectedTask) => {
    // 1. Ambil task yang saat ini ada di Toggle 2
    const oldTask2 = task2;

    // 2. Set task baru ke Toggle 2
    setTask2(selectedTask);

    // 3. Set task lama dari Toggle 2 ke Toggle 1
    setTask1(oldTask2);

    // 4. Otomatis aktifkan task baru yang dipilih
    setActiveTaskID(selectedTask.id);

    // 5. Tutup dropdown
    setIsDropdownOpen(false);
  };

  // --- Logika Filter Dropdown Baru ---
  // Sembunyikan task yang sudah ada di Toggle 1 atau Toggle 2
  const dropdownTasks = ALL_TASKS.filter(
    (task) => task.id !== task1.id && task.id !== task2.id
  );

  const isSendActive = !isLoading && prompt.trim().length > 0;

  return (
    <motion.form
      className={`user-input-bubble ${isExpanded ? 'expanded' : ''}`}
      onSubmit={handleSubmit}
      initial={{ y: 200 }}
      animate={{ y: 0 }}
      exit={{ y: 200 }}
      transition={{ ease: 'easeInOut', duration: 0.3 }}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragEnd={stopDrag}>
      {/* === 4. TAMBAHKAN HANDLE DI SINI (di bagian paling atas) === */}
      <div
        className='drag-handle-bar'
        onPointerDown={startDrag}>
        <FiMoreHorizontal />
      </div>
      {/* === AKHIR HANDLE === */}

      {/* Tombol Expand (Tetap) */}
      <button
        type='button'
        whileTap={{ scale: '0.85' }}
        className='expand-textarea-button'
        title={isExpanded ? 'Perkecil' : 'Perluas'}
        onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <FiChevronDown /> : <FiChevronUp />}
      </button>

      {/* Input Area Atas (Tetap) */}
      <div className='input-area'>
        <TextareaAutosize
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Tanyakan sesuatu ke Genius Bubble...'
          maxRows={7}
          minRows={isExpanded ? 5 : 1}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </div>

      {/* Area Task & Tombol Kirim Bawah (DIRIMBAK) */}
      <div className='task-toggles'>
        <div className='upload-div'>
          <ButtonReveal
            type='button'
            whileTap={{ scale: '0.85' }}
            className='upload-button'
            title='Upload file'>
            <FiUpload />
          </ButtonReveal>
        </div>
        <div
          className='task-dropdown-container'
          ref={dropdownRef}>
          {/* ========================================================== */}
          {/* --- AREA TOGGLE BARU (DUA TOMBOL AKTIF) --- */}
          {/* ========================================================== */}

          {/* --- TOGGLE 1: KIRI --- */}
          {/* Ini adalah tombol biasa yang bisa di-klik */}
          <ButtonReveal
            type='button'
            whileTap={{ scale: '0.85' }}
            className={`task-toggle ${
              activeTaskID === task1.id ? 'active' : '' // Style 'active'
            }`}
            title={`Set Task: ${task1.name}`}
            onClick={() => setActiveTaskID(task1.id)} // Mengaktifkan task 1
          >
            {/* <FiGrid size={12} /> */}
            <span>{task1.name}</span>
          </ButtonReveal>

          {/* --- TOGGLE 2: KANAN (DENGAN DROPDOWN) --- */}
          <div
            className='task-dropdown-container'
            ref={dropdownRef}>
            <ButtonReveal
              type='button'
              whileTap={{ scale: '0.85' }}
              className={`task-toggle ${
                activeTaskID === task2.id ? 'active' : '' // Style 'active'
              }`}
              // PENTING: Klik tombol mengaktifkan task, bukan membuka dropdown
              onClick={() => setActiveTaskID(task2.id)}>
              {/* <FiGrid size={12} /> */}

              <span>{task2.name}</span>

              {/* --- Bagian Pemicu Dropdown --- */}
              <div
                className='dropdown-trigger'
                onClick={(e) => {
                  e.stopPropagation(); // Hentikan event agar tidak meng-override onClick tombol
                  setIsDropdownOpen(!isDropdownOpen);
                }}>
                <FiChevronUp
                  size={14}
                  className={`chevron ${isDropdownOpen ? 'open' : ''}`}
                />
              </div>
            </ButtonReveal>

            {/* --- MENU DROPDOWN --- */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  className='task-dropdown-menu'
                  variants={otherMenuVariants}
                  initial='closed'
                  animate='open'
                  exit='closed'>
                  {dropdownTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      variants={otherItemVariants}>
                      {/* Tombol di dalam dropdown sekarang punya style 'task-toggle' */}
                      <ButtonReveal
                        type='button'
                        whileTap={{ scale: '0.85' }}
                        className='task-toggle' // <-- Style disamakan
                        onClick={() => handleTaskSelect(task)}>
                        {task.name}
                        {task.name !== 'Coding' && task.name !== 'General' && (
                          <sup className='soon-superscript'>soon !</sup>
                        )}
                      </ButtonReveal>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ========================================================== */}

        <div className='submit-div'>
          <ButtonReveal
            as='button'
            type='submit'
            whileTap={{ scale: '0.85' }}
            className={`send-button ${isSendActive ? 'active' : ''}`}
            title='Kirim'
            disabled={!isSendActive}>
            <FiSend
              size={28}
              style={{ marginTop: '8px', marginRight: '2px' }}
            />
          </ButtonReveal>
        </div>
      </div>
    </motion.form>
  );
}
