// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { supabase } from '../../lib/supabaseClient'; // Pastikan path ini benar

// const LikeButton = ({ projectId }) => {
//   const [likes, setLikes] = useState(0);
//   const [views, setViews] = useState(0);
//   const [hasLiked, setHasLiked] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Key unik untuk localStorage (agar browser ingat user sudah like)
//   const STORAGE_KEY = `liked_project_${projectId}`;

//   useEffect(() => {
//     let isMounted = true;

//     const fetchData = async () => {
//       try {
//         // 1. Ambil Views (dari tabel analytics)
//         // Menggunakan count: 'exact', head: true untuk performa
//         const { count: viewCount } = await supabase
//           .from('analytics')
//           .select('*', { count: 'exact', head: true })
//           .eq('project_id', projectId);

//         // 2. Ambil Likes (dari tabel project_likes)
//         const { count: likeCount } = await supabase
//           .from('project_likes')
//           .select('*', { count: 'exact', head: true })
//           .eq('project_id', projectId);

//         if (isMounted) {
//           setViews(viewCount || 0);
//           setLikes(likeCount || 0);

//           // Cek di browser apakah user ini sudah pernah klik like sebelumnya
//           if (localStorage.getItem(STORAGE_KEY) === 'true') {
//             setHasLiked(true);
//           }
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error('Gagal memuat stats:', error);
//         if (isMounted) setLoading(false);
//       }
//     };

//     if (projectId) fetchData();

//     return () => {
//       isMounted = false;
//     };
//   }, [projectId]);

//   const handleLike = async () => {
//     if (hasLiked) return; // Cegah klik ganda

//     // --- OPTIMISTIC UPDATE (Ubah tampilan dulu biar cepat) ---
//     setLikes((prev) => prev + 1);
//     setHasLiked(true);
//     localStorage.setItem(STORAGE_KEY, 'true');

//     try {
//       // --- LOGIKA IP ADDRESS ---
//       let userIp = 'anon-' + Date.now(); // Nilai default jika API gagal

//       try {
//         // Gunakan ipify yang lebih ringan & stabil daripada ipapi
//         const ipRes = await fetch('https://api.ipify.org?format=json');
//         if (ipRes.ok) {
//           const ipData = await ipRes.json();
//           userIp = ipData.ip;
//         }
//       } catch (ipError) {
//         console.warn('Gagal fetch IP, menggunakan ID anonim.', ipError);
//       }

//       // --- KIRIM KE DATABASE ---
//       const { error } = await supabase.from('project_likes').insert([
//         {
//           project_id: projectId,
//           ip_address: userIp,
//         },
//       ]);

//       if (error) {
//         // Kode 23505 = Unique Violation (IP ini sudah ada di DB untuk project ini)
//         // Kita abaikan error ini karena artinya like sudah tercatat
//         if (error.code !== '23505') {
//           throw error; // Lempar error lain selain duplikat
//         }
//       }
//     } catch (err) {
//       console.error('Gagal mengirim like:', err);
//       // Rollback tampilan jika error fatal (misal internet putus)
//       setLikes((prev) => prev - 1);
//       setHasLiked(false);
//       localStorage.removeItem(STORAGE_KEY);
//     }
//   };

//   if (loading)
//     return <div style={{ fontSize: '0.8rem', color: '#888' }}>...</div>;

//   return (
//     <div
//       style={{
//         display: 'flex',
//         alignItems: 'center',
//         gap: '15px',
//         marginTop: '2.3rem',
//         paddingTop: '1rem',
//       }}>
//       {/* --- VIEW COUNTER (Mata) --- */}
//       <div
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '6px',
//           color: '#666',
//           fontSize: '0.9rem',
//           fontFamily: 'Inter, sans-serif',
//         }}>
//         <svg
//           width='18'
//           height='18'
//           viewBox='0 0 24 24'
//           fill='none'
//           stroke='currentColor'
//           strokeWidth='2'
//           strokeLinecap='round'
//           strokeLinejoin='round'>
//           <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
//           <circle
//             cx='12'
//             cy='12'
//             r='3'></circle>
//         </svg>
//         <span>{views.toLocaleString()}</span>
//       </div>

//       {/* --- LIKE BUTTON (Hati) --- */}
//       <motion.button
//         whileTap={{ scale: 0.9 }}
//         whileHover={{ scale: 1.05 }}
//         onClick={handleLike}
//         disabled={hasLiked}
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '8px',
//           // Merah jika sudah like, Abu-abu jika belum
//           background: hasLiked ? '#ff4757' : '#f1f2f6',
//           color: hasLiked ? 'white' : '#2f3542',
//           border: 'none',
//           padding: '10px 40px',
//           borderRadius: '50px',
//           fontWeight: '600',
//           fontSize: '0.9rem',
//           cursor: hasLiked ? 'default' : 'pointer',
//           outline: 'none',
//           boxShadow: hasLiked ? '0 4px 12px rgba(255, 71, 87, 0.3)' : 'none',
//           transition: 'all 0.3s ease',
//         }}>
//         <svg
//           width='20'
//           height='20'
//           viewBox='0 0 24 24'
//           // Isi warna putih jika liked, kosong jika belum
//           fill={hasLiked ? 'white' : 'none'}
//           stroke='currentColor'
//           strokeWidth='2'
//           strokeLinecap='round'
//           strokeLinejoin='round'>
//           <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'></path>
//         </svg>
//         <span>{likes.toLocaleString()}</span>
//       </motion.button>
//     </div>
//   );
// };

// export default LikeButton;
//
// //
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { supabase } from '../../lib/supabaseClient';

// const LikeButton = ({ projectId, projectData }) => {
//   // --- STATE ---
//   const [likes, setLikes] = useState(0);
//   const [views, setViews] = useState(0);
//   const [hasLiked, setHasLiked] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Key LocalStorage
//   const STORAGE_KEY = `liked_project_${projectId}`;

//   // --- FETCH ANALYTICS ---
//   useEffect(() => {
//     let isMounted = true;
//     const fetchData = async () => {
//       try {
//         const { count: viewCount } = await supabase
//           .from('analytics')
//           .select('*', { count: 'exact', head: true })
//           .eq('project_id', projectId);

//         const { count: likeCount } = await supabase
//           .from('project_likes')
//           .select('*', { count: 'exact', head: true })
//           .eq('project_id', projectId);

//         if (isMounted) {
//           setViews(viewCount || 0);
//           setLikes(likeCount || 0);
//           if (localStorage.getItem(STORAGE_KEY) === 'true') setHasLiked(true);
//           setLoading(false);
//         }
//       } catch (error) {
//         if (isMounted) setLoading(false);
//       }
//     };
//     if (projectId) fetchData();
//     return () => {
//       isMounted = false;
//     };
//   }, [projectId, STORAGE_KEY]);

//   // --- HANDLE LIKE ---
//   const handleLike = async () => {
//     if (hasLiked) return;
//     setLikes((prev) => prev + 1);
//     setHasLiked(true);
//     localStorage.setItem(STORAGE_KEY, 'true');
//     try {
//       let userIp = 'anon-' + Date.now();
//       try {
//         const ipRes = await fetch('https://api.ipify.org?format=json');
//         if (ipRes.ok) userIp = (await ipRes.json()).ip;
//       } catch (e) {}
//       await supabase
//         .from('project_likes')
//         .insert([{ project_id: projectId, ip_address: userIp }]);
//     } catch (err) {
//       setLikes((prev) => prev - 1);
//       setHasLiked(false);
//       localStorage.removeItem(STORAGE_KEY);
//     }
//   };

//   // --- HANDLE OPTION SELECT (MEKANISME CHART SELECTOR) ---
//   const handleOptionChange = (e) => {
//     const value = e.target.value;

//     // Jika value adalah URL (dimulai dengan http), buka link baru
//     if (value && (value.startsWith('http') || value.startsWith('https'))) {
//       window.open(value, '_blank');

//       // Reset select kembali ke default agar bisa dipilih ulang
//       e.target.value = '';
//     }
//     // Jika bukan link (misal Detail Info), tidak melakukan apa-apa (Info Only)
//   };

//   // Helper: Format Label
//   const formatLabel = (key) => {
//     return key
//       .replace(/([A-Z])/g, ' $1')
//       .replace(/^./, (str) => str.toUpperCase())
//       .replace('_', ' ');
//   };

//   // Helper: Format Value ke String (karena <option> hanya terima string)
//   const formatValue = (val) => {
//     if (Array.isArray(val)) return val.join(', ');
//     return val;
//   };

//   if (loading)
//     return <div style={{ fontSize: '0.8rem', color: '#888' }}>...</div>;

//   return (
//     <div
//       style={{
//         display: 'flex',
//         alignItems: 'center',
//         gap: '15px',
//         marginTop: '2.3rem',
//         paddingTop: '1rem',
//         position: 'relative',
//       }}>
//       {/* 1. View Counter */}
//       <div
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '6px',
//           color: '#666',
//           fontSize: '0.9rem',
//         }}>
//         <svg
//           width='18'
//           height='18'
//           viewBox='0 0 24 24'
//           fill='none'
//           stroke='currentColor'
//           strokeWidth='2'
//           strokeLinecap='round'
//           strokeLinejoin='round'>
//           <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
//           <circle
//             cx='12'
//             cy='12'
//             r='3'></circle>
//         </svg>
//         <span>{views.toLocaleString()}</span>
//       </div>

//       {/* 2. Like Button */}
//       <motion.button
//         whileTap={{ scale: 0.9 }}
//         whileHover={{ scale: 1.05 }}
//         onClick={handleLike}
//         disabled={hasLiked}
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '8px',
//           background: hasLiked ? '#ff4757' : '#f1f2f6',
//           color: hasLiked ? 'white' : '#2f3542',
//           border: 'none',
//           padding: '10px 40px',
//           borderRadius: '50px',
//           fontWeight: '600',
//           fontSize: '0.9rem',
//           cursor: hasLiked ? 'default' : 'pointer',
//           outline: 'none',
//           boxShadow: hasLiked ? '0 4px 12px rgba(255, 71, 87, 0.3)' : 'none',
//           transition: 'all 0.3s ease',
//         }}>
//         <svg
//           width='20'
//           height='20'
//           viewBox='0 0 24 24'
//           fill={hasLiked ? 'white' : 'none'}
//           stroke='currentColor'
//           strokeWidth='2'
//           strokeLinecap='round'
//           strokeLinejoin='round'>
//           <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'></path>
//         </svg>
//         <span>{likes.toLocaleString()}</span>
//       </motion.button>

//       {/* 3. MENU DOTS (MOBILE ONLY) */}
//       <div className='mobile-dots-wrapper'>
//         {/* Ikon Visual Titik Tiga */}
//         <div className='dots-icon'>
//           <svg
//             width='24'
//             height='24'
//             viewBox='0 0 24 24'
//             fill='none'
//             stroke='currentColor'
//             strokeWidth='2'
//             strokeLinecap='round'
//             strokeLinejoin='round'>
//             <circle
//               cx='12'
//               cy='12'
//               r='1'></circle>
//             <circle
//               cx='12'
//               cy='5'
//               r='1'></circle>
//             <circle
//               cx='12'
//               cy='19'
//               r='1'></circle>
//           </svg>
//         </div>

//         {/* MEKANISME CHART SELECTOR (NATIVE SELECT)
//           Tag <select> ditaruh di atas ikon dengan opacity 0.
//           Ini membuat user merasa menekan tombol titik tiga,
//           padahal menekan <select>.
//         */}
//         <select
//           className='native-select-overlay'
//           onChange={handleOptionChange}
//           defaultValue=''>
//           {/* Placeholder Hidden */}
//           <option
//             value=''
//             disabled
//             hidden>
//             Options
//           </option>

//           {/* GROUP 1: DETAILS (Info Only) */}
//           {projectData && (
//             <optgroup label='Project Details'>
//               {projectData.details &&
//                 Object.entries(projectData.details).map(([key, value]) => (
//                   // Option Murni Tanpa Style
//                   <option
//                     key={key}
//                     value=''
//                     disabled>
//                     {formatLabel(key)}: {formatValue(value)}
//                   </option>
//                 ))}
//             </optgroup>
//           )}

//           {/* GROUP 2: LINKS (Actionable) */}
//           {projectData && (
//             <optgroup label='Links'>
//               {projectData.repoLink && (
//                 <option value={projectData.repoLink}>Open Repository</option>
//               )}
//               {projectData.notionLink && (
//                 <option value={projectData.notionLink}>
//                   Open Documentation
//                 </option>
//               )}
//               {projectData.externalLink && (
//                 <option value={projectData.externalLink}>Open Live Demo</option>
//               )}
//             </optgroup>
//           )}
//         </select>
//       </div>

//       {/* CSS STYLE */}
//       <style>{`
//         /* Wrapper Tombol Titik Tiga */
//         .mobile-dots-wrapper {
//           position: relative;
//           width: 40px;
//           height: 40px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         /* Ikon Visual */
//         .dots-icon {
//           color: #64748b;
//           display: flex;
//         }

//         /* Select Native Overlay
//            - Meniru 'chart-selector' secara mekanisme (tag select).
//            - Opacity 0 agar tidak terlihat tapi bisa diklik.
//            - Mengcover seluruh area wrapper.
//         */
//         .native-select-overlay {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           opacity: 0; /* Invisible */
//           cursor: pointer;
//           appearance: none; /* Hilangkan default styling native */
//           z-index: 10;
//         }

//         /* Desktop: Hilangkan */
//         @media (min-width: 768px) {
//           .mobile-dots-wrapper {
//             display: none !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default LikeButton;
//
//
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';

const LikeButton = ({ projectId, projectData }) => {
  // --- STATE ---
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Key LocalStorage
  const STORAGE_KEY = `liked_project_${projectId}`;

  // --- FETCH ANALYTICS ---
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const { count: viewCount } = await supabase
          .from('analytics')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', projectId);

        const { count: likeCount } = await supabase
          .from('project_likes')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', projectId);

        if (isMounted) {
          setViews(viewCount || 0);
          setLikes(likeCount || 0);
          if (localStorage.getItem(STORAGE_KEY) === 'true') setHasLiked(true);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) setLoading(false);
      }
    };
    if (projectId) fetchData();
    return () => {
      isMounted = false;
    };
  }, [projectId, STORAGE_KEY]);

  // --- HANDLE LIKE ---
  const handleLike = async () => {
    if (hasLiked) return;
    setLikes((prev) => prev + 1);
    setHasLiked(true);
    localStorage.setItem(STORAGE_KEY, 'true');
    try {
      let userIp = 'anon-' + Date.now();
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        if (ipRes.ok) userIp = (await ipRes.json()).ip;
      } catch (e) {}
      await supabase
        .from('project_likes')
        .insert([{ project_id: projectId, ip_address: userIp }]);
    } catch (err) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // --- HANDLE OPTION SELECT (MEKANISME CHART SELECTOR) ---
  const handleOptionChange = (e) => {
    const value = e.target.value;

    // Jika value adalah URL (dimulai dengan http), buka link baru
    if (value && (value.startsWith('http') || value.startsWith('https'))) {
      window.open(value, '_blank');

      // Reset select kembali ke default agar bisa dipilih ulang
      e.target.value = '';
    }
    // Jika bukan link (misal Detail Info), tidak melakukan apa-apa (Info Only)
  };

  // Helper: Format Label
  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace('_', ' ');
  };

  // Helper: Format Value ke String (karena <option> hanya terima string)
  const formatValue = (val) => {
    if (Array.isArray(val)) return val.join(', ');
    return val;
  };

  if (loading)
    return <div style={{ fontSize: '0.8rem', color: '#888' }}>...</div>;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginTop: '2.3rem',
        paddingTop: '1rem',
        position: 'relative',
      }}>
      {/* 1. View Counter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#666',
          fontSize: '0.9rem',
        }}>
        <svg
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
          <circle
            cx='12'
            cy='12'
            r='3'></circle>
        </svg>
        <span>{views.toLocaleString()}</span>
      </div>

      {/* 2. Like Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleLike}
        disabled={hasLiked}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: hasLiked ? '#ff4757' : '#f1f2f6',
          color: hasLiked ? 'white' : '#2f3542',
          border: 'none',
          padding: '10px 40px',
          borderRadius: '50px',
          fontWeight: '600',
          fontSize: '0.9rem',
          cursor: hasLiked ? 'default' : 'pointer',
          outline: 'none',
          boxShadow: hasLiked ? '0 4px 12px rgba(255, 71, 87, 0.3)' : 'none',
          transition: 'all 0.3s ease',
        }}>
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill={hasLiked ? 'white' : 'none'}
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'></path>
        </svg>
        <span>{likes.toLocaleString()}</span>
      </motion.button>

      {/* 3. MENU DOTS (MOBILE ONLY) */}
      <div className='mobile-dots-wrapper'>
        {/* Ikon Visual Titik Tiga */}
        <div className='dots-icon'>
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'>
            <circle
              cx='12'
              cy='12'
              r='1'></circle>
            <circle
              cx='12'
              cy='5'
              r='1'></circle>
            <circle
              cx='12'
              cy='19'
              r='1'></circle>
          </svg>
        </div>

        {/* MEKANISME CHART SELECTOR (NATIVE SELECT) */}
        <select
          className='native-select-overlay'
          onChange={handleOptionChange}
          defaultValue=''>
          {/* Placeholder Hidden */}
          <option
            value=''
            disabled
            hidden>
            Options
          </option>

          {/* GROUP 1: DETAILS (Info Only) */}
          {projectData && (
            <optgroup label='Project Details'>
              {projectData.details &&
                Object.entries(projectData.details).map(([key, value]) => (
                  // Option Murni Tanpa Style
                  <option
                    key={key}
                    value=''
                    disabled>
                    {formatLabel(key)}: {formatValue(value)}
                  </option>
                ))}
            </optgroup>
          )}

          {/* GROUP 2: LINKS (Actionable) */}
          {projectData && (
            <optgroup label='Links'>
              {projectData.repoLink && (
                <option value={projectData.repoLink}>Open Repository</option>
              )}
              {projectData.notionLink && (
                <option value={projectData.notionLink}>
                  Open Documentation
                </option>
              )}
              {projectData.externalLink && (
                <option value={projectData.externalLink}>Open Live Demo</option>
              )}
              {/* --- LINK EMERGENCY DITAMBAHKAN DI SINI --- */}
              {projectData.emergencyLink && (
                <option value={projectData.emergencyLink}>
                  Emergency Backup
                </option>
              )}
            </optgroup>
          )}
        </select>
      </div>

      {/* CSS STYLE */}
      <style>{`
        /* Wrapper Tombol Titik Tiga */
        .mobile-dots-wrapper {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Ikon Visual */
        .dots-icon {
          color: #64748b;
          display: flex;
        }

        /* Select Native Overlay
           - Opacity 0 agar tidak terlihat tapi bisa diklik.
           - Mengcover seluruh area wrapper.
        */
        .native-select-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0; /* Invisible */
          cursor: pointer;
          appearance: none; /* Hilangkan default styling native */
          z-index: 10;
        }

        /* Desktop: Hilangkan */
        @media (min-width: 768px) {
          .mobile-dots-wrapper {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LikeButton;
