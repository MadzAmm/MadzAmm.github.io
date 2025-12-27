import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const VisitorStats = () => {
  // Pastikan state awal memiliki 'yearly'
  const [stats, setStats] = useState({
    daily: 0,
    monthly: 0,
    yearly: 0,
    total: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Memanggil fungsi SQL
      const { data, error } = await supabase.rpc('get_visitor_stats');

      if (!error && data) {
        setStats(data);
      }
    };

    fetchStats();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        gap: '25px', // Jarak antar item
        fontSize: '0.9rem', // Ukuran font diperkecil sedikit agar muat
        color: 'rgb(255, 255, 255)',
        marginTop: '15px',
        fontFamily: 'monospace',
        flexWrap: 'wrap', // Agar aman di layar HP kecil
        justifyContent: 'space-between', // Rata tengah
      }}>
      <span title='Visitors Today'>
        Today: <b>{stats.daily}</b>
      </span>

      <span title='Visitors This Month'>
        Month: <b>{stats.monthly}</b>
      </span>

      {/* --- INI YANG BARU DITAMBAHKAN (YEAR) --- */}
      <span title='Visitors This Year'>
        Year: <b>{stats.yearly}</b>
      </span>
      {/* ---------------------------------------- */}

      <span title='Total Visitors Since Launch'>
        Total: <b>{stats.total}</b>
      </span>
    </div>
  );
};

export default VisitorStats;
