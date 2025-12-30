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
