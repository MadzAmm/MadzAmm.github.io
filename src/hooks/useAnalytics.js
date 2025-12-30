// import { useEffect, useRef } from 'react';
// import { useLocation } from 'react-router-dom';
// import { supabase } from '../lib/supabaseClient';

// const useAnalytics = () => {
//   const location = useLocation();
//   const hasTracked = useRef(false);

//   useEffect(() => {
//     // 1. Reset status tracking setiap URL berubah
//     hasTracked.current = false;

//     // Fungsi Fetch IP Cerdas (Punya Anda + Perbaikan Mapping Data)
//     const fetchIP = async () => {
//       try {
//         // Prioritas 1: Data Lengkap (ipapi.co)
//         const res = await fetch('https://ipapi.co/json/');
//         if (!res.ok) throw new Error('Limit');
//         const data = await res.json();
//         return {
//           ip: data.ip,
//           city: data.city,
//           country: data.country_name,
//           isp: data.org,
//         };
//       } catch (e) {
//         try {
//           // Prioritas 2: Fallback IP Saja (ipify.org)
//           const res2 = await fetch('https://api.ipify.org?format=json');
//           const data = await res2.json();
//           // Kembalikan null untuk data yang tidak diketahui
//           return { ip: data.ip, city: null, country: null, isp: null };
//         } catch (err) {
//           // Prioritas 3: Menyerah (Anonim)
//           return { ip: 'anon', city: null, country: null, isp: null };
//         }
//       }
//     };

//     const track = async () => {
//       // 2. Cegah Double Tracking (React Strict Mode Bug)
//       if (hasTracked.current) return;
//       hasTracked.current = true;

//       const currentPath = location.pathname;

//       // 3. 🔥 FITUR BARU: CEGAH SPAM REFRESH 🔥
//       // Cek apakah user ini sudah pernah dilacak di halaman ini dalam sesi browser ini?
//       const sessionKey = `tracked:${currentPath}`;
//       if (sessionStorage.getItem(sessionKey)) {
//         // Jika sudah ada, jangan kirim data ke database. Stop di sini.
//         return;
//       }
//       // Jika belum, tandai sudah dilacak
//       sessionStorage.setItem(sessionKey, 'true');

//       // 4. Ambil Project ID dari URL
//       let projectId = null;
//       const pathSegments = currentPath.split('/');
//       if (pathSegments[1] === 'project' && !isNaN(pathSegments[2])) {
//         projectId = parseInt(pathSegments[2]);
//       }

//       // 5. Ambil Data Browser (Gratis & Detail)
//       const net = await fetchIP();
//       const ua = navigator.userAgent;
//       const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
//       const screenRes = `${window.screen.width}x${window.screen.height}`;
//       const connection =
//         navigator.connection ||
//         navigator.mozConnection ||
//         navigator.webkitConnection;

//       // 6. Kirim ke Supabase
//       // Pastikan nama key sesuai dengan kolom di tabel 'analytics'
//       const { error } = await supabase.from('analytics').insert([
//         {
//           page_path: currentPath,
//           project_id: projectId,

//           // Data Identitas (Dari fetchIP)
//           ip_address: net.ip,
//           city: net.city,
//           country: net.country,
//           isp: net.isp,

//           // Data Perangkat
//           device_type: isMobile ? 'mobile' : 'desktop',
//           os_name: navigator.platform,
//           browser_name: 'Unknown', // Parsing browser name butuh library berat, skip saja
//           user_agent: ua, // Simpan mentahnya saja
//           screen_resolution: screenRes,
//           language: navigator.language || 'en',
//           connection_type: connection ? connection.effectiveType : null, // 4g/wifi
//           window_width: window.innerWidth,
//           window_height: window.innerHeight,

//           // Data Asal
//           referrer: document.referrer || 'Direct',
//         },
//       ]);

//       if (error) console.error('Analytics DB Error:', error.message);
//       else console.log('Analytics: Data recorded for', currentPath);
//     };

//     track();
//   }, [location]);
// };

// export default useAnalytics;
//
//
//
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// --- HELPER 1: DETEKSI BROWSER (MANUAL & KUAT) ---
const detectBrowser = (ua) => {
  const s = ua.toLowerCase();

  // Urutan ini VITAL: Samsung > Edge > Chrome > Safari
  if (s.includes('samsungbrowser')) return 'Samsung Internet';
  if (s.includes('edg')) return 'Edge';
  if (s.includes('crios') || s.includes('chrome')) return 'Chrome';
  if (s.includes('firefox') || s.includes('fxios')) return 'Firefox';

  // Safari (Hanya jika TIDAK mengandung kata-kata lain)
  if (
    s.includes('safari') &&
    !s.includes('chrome') &&
    !s.includes('crios') &&
    !s.includes('edg') &&
    !s.includes('android')
  ) {
    return 'Safari';
  }

  return 'Unknown';
};

// --- HELPER 2: DETEKSI OS ---
const detectOS = (ua) => {
  const s = ua.toLowerCase();
  if (s.includes('iphone') || s.includes('ipad') || s.includes('ipod'))
    return 'iOS';
  if (s.includes('android')) return 'Android';
  if (s.includes('win')) return 'Windows';
  if (s.includes('mac')) return 'MacOS';
  if (s.includes('linux')) return 'Linux';
  return 'Unknown OS';
};

const useAnalytics = () => {
  const location = useLocation();

  // Refs untuk menjaga state tanpa re-render
  const lastTrackedPath = useRef(null);
  const currentSessionId = useRef(null); // Menyimpan ID database baris saat ini
  const visitStartTime = useRef(null); // Menyimpan jam masuk

  useEffect(() => {
    const currentPath = location.pathname;

    // 1. CEGAH DUPLIKAT (Hanya track jika path berubah)
    if (lastTrackedPath.current === currentPath) return;
    lastTrackedPath.current = currentPath;

    // Reset timer & ID session untuk halaman baru ini
    visitStartTime.current = Date.now();
    currentSessionId.current = null;

    // FUNGSI UTAMA: TRACK ENTRY
    const trackEntry = async () => {
      // A. Ambil Project ID
      let projectId = null;
      const pathSegments = currentPath.split('/');
      const projectIndex = pathSegments.indexOf('project');
      if (projectIndex !== -1 && pathSegments[projectIndex + 1]) {
        const potentialId = parseInt(pathSegments[projectIndex + 1]);
        if (!isNaN(potentialId)) projectId = potentialId;
      }

      // B. Fetch IP (Dengan Fallback)
      let netData = { ip: null, city: null, country: null, isp: null };
      try {
        // Prioritas 1: Data Lengkap
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('Limit');
        const data = await res.json();
        netData = {
          ip: data.ip,
          city: data.city,
          country: data.country_name,
          isp: data.org,
        };
      } catch (e) {
        try {
          // Prioritas 2: IP Only
          const res2 = await fetch('https://api.ipify.org?format=json');
          const data = await res2.json();
          netData.ip = data.ip;
        } catch (err) {
          netData.ip = 'anon';
        }
      }

      // C. Deteksi Browser & OS (Manual)
      const rawUA = navigator.userAgent;
      const finalBrowser = detectBrowser(rawUA);
      const finalOS = detectOS(rawUA);
      const isMobile = /Android|iPhone|iPad|iPod/i.test(rawUA);

      // D. Info Tambahan (Connection & Language)
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
      const connectionType = connection ? connection.effectiveType : null; // '4g', '3g'
      const language = navigator.language || 'en';

      // E. INSERT ke Supabase
      const { data, error } = await supabase
        .from('analytics')
        .insert([
          {
            page_path: currentPath,
            project_id: projectId,

            // Network
            ip_address: netData.ip,
            city: netData.city,
            country: netData.country,
            isp: netData.isp,
            connection_type: connectionType,

            // Device
            device_type: isMobile ? 'mobile' : 'desktop',
            os_name: finalOS,
            browser_name: finalBrowser,
            user_agent: rawUA,
            language: language,

            // Screen
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            window_width: window.innerWidth,
            window_height: window.innerHeight,
            referrer: document.referrer || 'Direct',

            // Time on Page (Awalnya NULL)
            time_on_page: null,
          },
        ])
        .select(); // .select() penting untuk mengambil ID baris baru

      if (error) {
        console.error('[Analytics] Insert Error:', error.message);
      } else if (data && data.length > 0) {
        // Simpan ID baris ini untuk di-update nanti saat user pergi
        currentSessionId.current = data[0].id;
        console.log(
          `[Analytics] Entry: ${finalBrowser} on ${finalOS} (ID: ${data[0].id})`
        );
      }
    };

    trackEntry();

    // FUNGSI CLEANUP: TRACK EXIT (Jalan saat user pindah halaman)
    return () => {
      // Hanya update jika kita punya Session ID (artinya insert awal sukses)
      if (currentSessionId.current && visitStartTime.current) {
        const endTime = Date.now();
        // Hitung selisih waktu (detik)
        const durationSeconds = Math.floor(
          (endTime - visitStartTime.current) / 1000
        );

        // Kirim UPDATE ke Supabase
        // "Tolong update baris ID sekian, isi kolom time_on_page dengan durasi sekian"
        supabase
          .from('analytics')
          .update({ time_on_page: durationSeconds })
          .eq('id', currentSessionId.current)
          .then(({ error }) => {
            if (error)
              console.error('[Analytics] Update Time Error:', error.message);
            else console.log(`[Analytics] Time Updated: ${durationSeconds}s`);
          });
      }
    };
  }, [location.pathname]);
};

export default useAnalytics;
