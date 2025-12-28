import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient'; // Pastikan path ini benar

const LikeButton = ({ projectId }) => {
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Key unik untuk localStorage (agar browser ingat user sudah like)
  const STORAGE_KEY = `liked_project_${projectId}`;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // 1. Ambil Views (dari tabel analytics)
        // Menggunakan count: 'exact', head: true untuk performa
        const { count: viewCount } = await supabase
          .from('analytics')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', projectId);

        // 2. Ambil Likes (dari tabel project_likes)
        const { count: likeCount } = await supabase
          .from('project_likes')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', projectId);

        if (isMounted) {
          setViews(viewCount || 0);
          setLikes(likeCount || 0);

          // Cek di browser apakah user ini sudah pernah klik like sebelumnya
          if (localStorage.getItem(STORAGE_KEY) === 'true') {
            setHasLiked(true);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Gagal memuat stats:', error);
        if (isMounted) setLoading(false);
      }
    };

    if (projectId) fetchData();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  const handleLike = async () => {
    if (hasLiked) return; // Cegah klik ganda

    // --- OPTIMISTIC UPDATE (Ubah tampilan dulu biar cepat) ---
    setLikes((prev) => prev + 1);
    setHasLiked(true);
    localStorage.setItem(STORAGE_KEY, 'true');

    try {
      // --- LOGIKA IP ADDRESS ---
      let userIp = 'anon-' + Date.now(); // Nilai default jika API gagal

      try {
        // Gunakan ipify yang lebih ringan & stabil daripada ipapi
        const ipRes = await fetch('https://api.ipify.org?format=json');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          userIp = ipData.ip;
        }
      } catch (ipError) {
        console.warn('Gagal fetch IP, menggunakan ID anonim.', ipError);
      }

      // --- KIRIM KE DATABASE ---
      const { error } = await supabase.from('project_likes').insert([
        {
          project_id: projectId,
          ip_address: userIp,
        },
      ]);

      if (error) {
        // Kode 23505 = Unique Violation (IP ini sudah ada di DB untuk project ini)
        // Kita abaikan error ini karena artinya like sudah tercatat
        if (error.code !== '23505') {
          throw error; // Lempar error lain selain duplikat
        }
      }
    } catch (err) {
      console.error('Gagal mengirim like:', err);
      // Rollback tampilan jika error fatal (misal internet putus)
      setLikes((prev) => prev - 1);
      setHasLiked(false);
      localStorage.removeItem(STORAGE_KEY);
    }
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
      }}>
      {/* --- VIEW COUNTER (Mata) --- */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#666',
          fontSize: '0.9rem',
          fontFamily: 'Inter, sans-serif',
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

      {/* --- LIKE BUTTON (Hati) --- */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleLike}
        disabled={hasLiked}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          // Merah jika sudah like, Abu-abu jika belum
          background: hasLiked ? '#ff4757' : '#f1f2f6',
          color: hasLiked ? 'white' : '#2f3542',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '50px',
          fontWeight: '600',
          fontSize: '0.9rem',
          cursor: hasLiked ? 'default' : 'pointer',
          outline: 'none',
          boxShadow: hasLiked ? '0 4px 12px rgba(255, 71, 87, 0.3)' : 'none',
          transition: 'all 0.3s ease',
        }}>
        <svg
          width='18'
          height='18'
          viewBox='0 0 24 24'
          // Isi warna putih jika liked, kosong jika belum
          fill={hasLiked ? 'white' : 'none'}
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'></path>
        </svg>
        <span>{likes.toLocaleString()}</span>
      </motion.button>
    </div>
  );
};

export default LikeButton;
