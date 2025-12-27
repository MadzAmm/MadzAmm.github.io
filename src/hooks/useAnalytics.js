import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const useAnalytics = () => {
  const location = useLocation();
  const hasTracked = useRef(false);

  useEffect(() => {
    // 1. Reset status tracking setiap URL berubah
    hasTracked.current = false;

    // Fungsi Fetch IP Cerdas (Punya Anda + Perbaikan Mapping Data)
    const fetchIP = async () => {
      try {
        // Prioritas 1: Data Lengkap (ipapi.co)
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('Limit');
        const data = await res.json();
        return {
          ip: data.ip,
          city: data.city,
          country: data.country_name,
          isp: data.org,
        };
      } catch (e) {
        try {
          // Prioritas 2: Fallback IP Saja (ipify.org)
          const res2 = await fetch('https://api.ipify.org?format=json');
          const data = await res2.json();
          // Kembalikan null untuk data yang tidak diketahui
          return { ip: data.ip, city: null, country: null, isp: null };
        } catch (err) {
          // Prioritas 3: Menyerah (Anonim)
          return { ip: 'anon', city: null, country: null, isp: null };
        }
      }
    };

    const track = async () => {
      // 2. Cegah Double Tracking (React Strict Mode Bug)
      if (hasTracked.current) return;
      hasTracked.current = true;

      const currentPath = location.pathname;

      // 3. 🔥 FITUR BARU: CEGAH SPAM REFRESH 🔥
      // Cek apakah user ini sudah pernah dilacak di halaman ini dalam sesi browser ini?
      const sessionKey = `tracked:${currentPath}`;
      if (sessionStorage.getItem(sessionKey)) {
        // Jika sudah ada, jangan kirim data ke database. Stop di sini.
        return;
      }
      // Jika belum, tandai sudah dilacak
      sessionStorage.setItem(sessionKey, 'true');

      // 4. Ambil Project ID dari URL
      let projectId = null;
      const pathSegments = currentPath.split('/');
      if (pathSegments[1] === 'project' && !isNaN(pathSegments[2])) {
        projectId = parseInt(pathSegments[2]);
      }

      // 5. Ambil Data Browser (Gratis & Detail)
      const net = await fetchIP();
      const ua = navigator.userAgent;
      const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
      const screenRes = `${window.screen.width}x${window.screen.height}`;
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

      // 6. Kirim ke Supabase
      // Pastikan nama key sesuai dengan kolom di tabel 'analytics'
      const { error } = await supabase.from('analytics').insert([
        {
          page_path: currentPath,
          project_id: projectId,

          // Data Identitas (Dari fetchIP)
          ip_address: net.ip,
          city: net.city,
          country: net.country,
          isp: net.isp,

          // Data Perangkat
          device_type: isMobile ? 'mobile' : 'desktop',
          os_name: navigator.platform,
          browser_name: 'Unknown', // Parsing browser name butuh library berat, skip saja
          user_agent: ua, // Simpan mentahnya saja
          screen_resolution: screenRes,
          language: navigator.language || 'en',
          connection_type: connection ? connection.effectiveType : null, // 4g/wifi
          window_width: window.innerWidth,
          window_height: window.innerHeight,

          // Data Asal
          referrer: document.referrer || 'Direct',
        },
      ]);

      if (error) console.error('Analytics DB Error:', error.message);
      else console.log('Analytics: Data recorded for', currentPath);
    };

    track();
  }, [location]);
};

export default useAnalytics;
