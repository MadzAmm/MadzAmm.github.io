import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
// IMPORTS CHARTING LIBRARY
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// IMPORTS STYLE & COMPONENTS
import './AdminDashboard.scss';
import ManageProjects from '../components/admin/ManageProjects';

// WARNA UNTUK CHART
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const StatCard = ({ title, value, color }) => (
  <motion.div
    className='stat-card'
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}>
    <h4>{title}</h4>
    <p
      className='stat-value'
      style={{ color: color }}>
      {value}
    </p>
  </motion.div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  // STATE DATA
  const [stats, setStats] = useState({
    daily: 0,
    monthly: 0,
    yearly: 0,
    total: 0,
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // STATE UI
  const [activeTab, setActiveTab] = useState('analytics');
  const [chartType, setChartType] = useState('dailyTrend'); // dailyTrend, deviceSplit, topPages, location

  // --- AUTH CHECK & FETCH ---
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) navigate('/login');
      else fetchDashboardData();
    };
    checkUser();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Stats Cards
      const { data: summary } = await supabase.rpc('get_visitor_stats');
      if (summary) setStats(summary);

      // 2. Raw Logs (Ambil 200 terakhir untuk sample grafik yang cukup)
      const { data: logData } = await supabase
        .from('analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (logData) setLogs(logData);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // --- DATA TRANSFORMATION FOR CHARTS (Memoized) ---
  const chartData = useMemo(() => {
    if (!logs.length) return [];

    switch (chartType) {
      case 'dailyTrend': {
        // Group by Date (Last 7 Days)
        const counts = {};
        logs.forEach((log) => {
          const date = new Date(log.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          counts[date] = (counts[date] || 0) + 1;
        });
        // Ubah ke array dan reverse biar urut tanggal
        return Object.keys(counts)
          .map((key) => ({ name: key, visits: counts[key] }))
          .reverse();
      }

      case 'deviceSplit': {
        const counts = { Desktop: 0, Mobile: 0 };
        logs.forEach((log) => {
          const type = log.device_type === 'mobile' ? 'Mobile' : 'Desktop';
          counts[type]++;
        });
        return Object.keys(counts).map((key) => ({
          name: key,
          value: counts[key],
        }));
      }

      case 'topPages': {
        const counts = {};
        logs.forEach((log) => {
          // Bersihkan path
          const path =
            log.page_path.length > 20
              ? log.page_path.substring(0, 20) + '...'
              : log.page_path;
          counts[path] = (counts[path] || 0) + 1;
        });
        return Object.entries(counts)
          .sort((a, b) => b[1] - a[1]) // Sort terbanyak
          .slice(0, 5) // Ambil top 5
          .map(([name, count]) => ({ name, count }));
      }

      case 'location': {
        const counts = {};
        logs.forEach((log) => {
          const loc = log.city || 'Unknown';
          counts[loc] = (counts[loc] || 0) + 1;
        });
        return Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }));
      }

      default:
        return [];
    }
  }, [logs, chartType]);

  // --- RENDER CHART COMPONENT ---
  const renderChart = () => {
    if (chartType === 'dailyTrend') {
      return (
        <ResponsiveContainer
          width='100%'
          height='100%'>
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray='3 3'
              vertical={false}
            />
            <XAxis dataKey='name' />
            <YAxis allowDecimals={false} />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Line
              type='monotone'
              dataKey='visits'
              stroke='#3b82f6'
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'deviceSplit') {
      return (
        <ResponsiveContainer
          width='100%'
          height='100%'>
          <PieChart>
            <Pie
              data={chartData}
              cx='50%'
              cy='50%'
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey='value'>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              verticalAlign='bottom'
              height={36}
            />
          </PieChart>
        </ResponsiveContainer>
      );
    } else {
      // Bar Chart for Pages & Location
      return (
        <ResponsiveContainer
          width='100%'
          height='100%'>
          <BarChart
            data={chartData}
            layout='vertical'
            margin={{ left: 20 }}>
            <CartesianGrid
              strokeDasharray='3 3'
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type='number'
              hide
            />
            <YAxis
              dataKey='name'
              type='category'
              width={100}
              tick={{ fontSize: 12 }}
            />
            <Tooltip cursor={{ fill: 'transparent' }} />
            <Bar
              dataKey='count'
              fill='#8b5cf6'
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };

  // Helper safe URL
  const getReferrerDisplay = (referrer) => {
    if (!referrer || referrer === 'Direct') return '-';
    try {
      return new URL(referrer).hostname;
    } catch (e) {
      return referrer;
    }
  };

  if (loading)
    return <div className='loading-state'>Loading Command Center...</div>;

  return (
    <div className='admin-dashboard'>
      {/* HEADER */}
      <header className='dashboard-header'>
        <h1>Dashboard</h1>
        <div className='tab-controls'>
          <button
            className={activeTab === 'analytics' ? 'active' : ''}
            onClick={() => setActiveTab('analytics')}>
            Analytics
          </button>
          <button
            className={activeTab === 'projects' ? 'active' : ''}
            onClick={() => setActiveTab('projects')}>
            Projects
          </button>
          <button
            className='btn-logout'
            onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* CONTENT AREA */}
      <div className='dashboard-content'>
        {activeTab === 'analytics' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}>
            {/* 1. STAT CARDS */}
            <section className='stats-grid'>
              <StatCard
                title='Today'
                value={stats.daily}
                color='#10b981'
              />
              <StatCard
                title='This Month'
                value={stats.monthly}
                color='#3b82f6'
              />
              <StatCard
                title='This Year'
                value={stats.yearly}
                color='#8b5cf6'
              />
              <StatCard
                title='All Time'
                value={stats.total}
                color='#6684b6ff'
              />
            </section>

            {/* 2. DYNAMIC CHART SECTION */}
            <section
              className='chart-section'
              style={{ marginTop: '2rem' }}>
              <div className='chart-header'>
                <h3>Insight Visualization</h3>
                <select
                  className='chart-selector'
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}>
                  <option value='dailyTrend'>Daily Traffic Trend</option>
                  <option value='deviceSplit'>Device Distribution</option>
                  <option value='topPages'>Top Visited Pages</option>
                  <option value='location'>Visitor Location</option>
                </select>
              </div>
              <div className='chart-wrapper'>
                {logs.length > 0 ? (
                  renderChart()
                ) : (
                  <p style={{ textAlign: 'center', marginTop: '150px' }}>
                    Not enough data for chart
                  </p>
                )}
              </div>
            </section>

            {/* 3. DETAILED LOGS TABLE */}
            <section
              className='table-section'
              style={{ marginTop: '2rem' }}>
              <div className='table-header'>
                <h3>Recent Traffic Logs</h3>
                <button onClick={fetchDashboardData}>Refresh Data ↻</button>
              </div>

              <div className='table-responsive'>
                <table>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Location</th>
                      <th>Device</th>
                      <th>Page / Referrer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          {new Date(log.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          <span className='sub-text'>
                            {new Date(log.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600 }}>
                            {log.city || 'Unknown'}
                          </span>
                          <span className='sub-text'>
                            {log.country} • {log.isp}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${log.device_type}`}>
                            {log.device_type?.toUpperCase() || 'DESKTOP'}
                          </span>
                          <span className='sub-text'>{log.os_name}</span>
                        </td>
                        <td>
                          {log.page_path}
                          {log.referrer && log.referrer !== 'Direct' && (
                            <span
                              className='sub-text'
                              style={{ color: '#d97706' }}>
                              via {getReferrerDisplay(log.referrer)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}>
            <ManageProjects />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
