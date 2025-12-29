// import React, { useEffect, useState } from 'react';
// import { supabase } from '../../../lib/supabaseClient';

// const VisitorStats = () => {
//   // Pastikan state awal memiliki 'yearly'
//   const [stats, setStats] = useState({
//     daily: 0,
//     monthly: 0,
//     yearly: 0,
//     total: 0,
//   });

//   useEffect(() => {
//     const fetchStats = async () => {
//       // Memanggil fungsi SQL
//       const { data, error } = await supabase.rpc('get_visitor_stats');

//       if (!error && data) {
//         setStats(data);
//       }
//     };

//     fetchStats();
//   }, []);

//   return (
//     <div
//       style={{
//         display: 'flex',
//         gap: '25px', // Jarak antar item
//         fontSize: '0.9rem', // Ukuran font diperkecil sedikit agar muat
//         color: 'rgb(255, 255, 255)',
//         marginTop: '15px',
//         fontFamily: 'monospace',
//         flexWrap: 'wrap', // Agar aman di layar HP kecil
//         justifyContent: 'space-between', // Rata tengah
//       }}>
//       <span title='Visitors Today'>
//         Today: <b>{stats.daily}</b>
//       </span>

//       <span title='Visitors This Month'>
//         Month: <b>{stats.monthly}</b>
//       </span>

//       {/* --- INI YANG BARU DITAMBAHKAN (YEAR) --- */}
//       <span title='Visitors This Year'>
//         Year: <b>{stats.yearly}</b>
//       </span>
//       {/* ---------------------------------------- */}

//       <span title='Total Visitors Since Launch'>
//         Total: <b>{stats.total}</b>
//       </span>
//     </div>
//   );
// };

// export default VisitorStats;

//
//
//
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient'; // Sesuaikan path jika perlu
import './VisitorStats.scss'; // 👈 Import SCSS di sini

const VisitorStats = () => {
  const [stats, setStats] = useState({
    daily: 0,
    monthly: 0,
    yearly: 0,
    total: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.rpc('get_visitor_stats');
      if (!error && data) {
        setStats(data);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className='visitor-stats-container'>
      {/* JUDUL BARU */}
      <h5 className='visitor-title'>VISITOR ANALYTICS</h5>

      {/* ANGKA STATISTIK */}
      <div className='visitor-metrics'>
        <div
          className='stat-item'
          title='Visitors Today'>
          <span className='label'>Today:</span>
          <span className='value'>{stats.daily || 0}</span>
        </div>

        <div
          className='stat-item'
          title='Visitors This Month'>
          <span className='label'>Month:</span>
          <span className='value'>{stats.monthly || 0}</span>
        </div>

        <div
          className='stat-item'
          title='Visitors This Year'>
          <span className='label'>Year:</span>
          <span className='value'>{stats.yearly || 0}</span>
        </div>

        <div
          className='stat-item'
          title='Total Visitors Since Launch'>
          <span className='label'>Total:</span>
          <span className='value'>{stats.total || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default VisitorStats;
