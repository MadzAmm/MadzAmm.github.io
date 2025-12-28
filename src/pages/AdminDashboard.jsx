// import React, { useEffect, useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../lib/supabaseClient';
// import { motion } from 'framer-motion';
// // IMPORTS CHARTING LIBRARY
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// // IMPORTS STYLE & COMPONENTS
// import './AdminDashboard.scss';
// import ManageProjects from '../components/admin/ManageProjects';

// // WARNA UNTUK CHART
// const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// const StatCard = ({ title, value, color }) => (
//   <motion.div
//     className='stat-card'
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}>
//     <h4>{title}</h4>
//     <p
//       className='stat-value'
//       style={{ color: color }}>
//       {value}
//     </p>
//   </motion.div>
// );

// const AdminDashboard = () => {
//   const navigate = useNavigate();

//   // STATE DATA
//   const [stats, setStats] = useState({
//     daily: 0,
//     monthly: 0,
//     yearly: 0,
//     total: 0,
//   });
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // STATE UI
//   const [activeTab, setActiveTab] = useState('analytics');
//   const [chartType, setChartType] = useState('dailyTrend');

//   // STATE MOBILE MENU
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   // --- AUTH CHECK & FETCH ---
//   useEffect(() => {
//     const checkUser = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();
//       if (!session) navigate('/login');
//       else fetchDashboardData();
//     };
//     checkUser();
//   }, [navigate]);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);

//       // 1. Stats Cards
//       const { data: summary } = await supabase.rpc('get_visitor_stats');
//       if (summary) setStats(summary);

//       // 2. Raw Logs
//       const { data: logData } = await supabase
//         .from('analytics')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(200);

//       if (logData) setLogs(logData);
//     } catch (error) {
//       console.error('Error fetching dashboard:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     navigate('/login');
//   };

//   // Fungsi helper untuk menutup menu saat item diklik (UX mobile)
//   const handleNavClick = (tabName) => {
//     setActiveTab(tabName);
//     setIsMobileMenuOpen(false);
//   };

//   // --- DATA TRANSFORMATION FOR CHARTS (Memoized) ---
//   const chartData = useMemo(() => {
//     if (!logs.length) return [];

//     switch (chartType) {
//       case 'dailyTrend': {
//         const counts = {};
//         logs.forEach((log) => {
//           const date = new Date(log.created_at).toLocaleDateString('en-US', {
//             month: 'short',
//             day: 'numeric',
//           });
//           counts[date] = (counts[date] || 0) + 1;
//         });
//         return Object.keys(counts)
//           .map((key) => ({ name: key, visits: counts[key] }))
//           .reverse();
//       }

//       case 'deviceSplit': {
//         const counts = { Desktop: 0, Mobile: 0 };
//         logs.forEach((log) => {
//           const type = log.device_type === 'mobile' ? 'Mobile' : 'Desktop';
//           counts[type]++;
//         });
//         return Object.keys(counts).map((key) => ({
//           name: key,
//           value: counts[key],
//         }));
//       }

//       case 'topPages': {
//         const counts = {};
//         logs.forEach((log) => {
//           const path =
//             log.page_path.length > 20
//               ? log.page_path.substring(0, 20) + '...'
//               : log.page_path;
//           counts[path] = (counts[path] || 0) + 1;
//         });
//         return Object.entries(counts)
//           .sort((a, b) => b[1] - a[1])
//           .slice(0, 5)
//           .map(([name, count]) => ({ name, count }));
//       }

//       case 'location': {
//         const counts = {};
//         logs.forEach((log) => {
//           const loc = log.city || 'Unknown';
//           counts[loc] = (counts[loc] || 0) + 1;
//         });
//         return Object.entries(counts)
//           .sort((a, b) => b[1] - a[1])
//           .slice(0, 5)
//           .map(([name, count]) => ({ name, count }));
//       }

//       default:
//         return [];
//     }
//   }, [logs, chartType]);

//   // --- RENDER CHART COMPONENT ---
//   const renderChart = () => {
//     if (chartType === 'dailyTrend') {
//       return (
//         <ResponsiveContainer
//           width='100%'
//           height='100%'>
//           <LineChart data={chartData}>
//             <CartesianGrid
//               strokeDasharray='3 3'
//               vertical={false}
//             />
//             <XAxis dataKey='name' />
//             <YAxis allowDecimals={false} />
//             <Tooltip
//               contentStyle={{
//                 borderRadius: '8px',
//                 border: 'none',
//                 boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//               }}
//             />
//             <Line
//               type='monotone'
//               dataKey='visits'
//               stroke='#3b82f6'
//               strokeWidth={3}
//               activeDot={{ r: 8 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       );
//     } else if (chartType === 'deviceSplit') {
//       return (
//         <ResponsiveContainer
//           width='100%'
//           height='100%'>
//           <PieChart>
//             <Pie
//               data={chartData}
//               cx='50%'
//               cy='50%'
//               innerRadius={60}
//               outerRadius={100}
//               paddingAngle={5}
//               dataKey='value'>
//               {chartData.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend
//               verticalAlign='bottom'
//               height={36}
//             />
//           </PieChart>
//         </ResponsiveContainer>
//       );
//     } else {
//       return (
//         <ResponsiveContainer
//           width='100%'
//           height='100%'>
//           <BarChart
//             data={chartData}
//             layout='vertical'
//             margin={{ left: 20 }}>
//             <CartesianGrid
//               strokeDasharray='3 3'
//               horizontal={true}
//               vertical={false}
//             />
//             <XAxis
//               type='number'
//               hide
//             />
//             <YAxis
//               dataKey='name'
//               type='category'
//               width={100}
//               tick={{ fontSize: 12 }}
//             />
//             <Tooltip cursor={{ fill: 'transparent' }} />
//             <Bar
//               dataKey='count'
//               fill='#8b5cf6'
//               radius={[0, 4, 4, 0]}
//               barSize={20}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       );
//     }
//   };

//   const getReferrerDisplay = (referrer) => {
//     if (!referrer || referrer === 'Direct') return '-';
//     try {
//       return new URL(referrer).hostname;
//     } catch (e) {
//       return referrer;
//     }
//   };

//   if (loading)
//     return <div className='loading-state'>Loading Command Center...</div>;

//   return (
//     <div className='admin-dashboard'>
//       {/* HEADER YANG DIMODIFIKASI */}
//       <header className='dashboard-header'>
//         <h1>Dashboard</h1>

//         {/* Tombol Hamburger (Hanya muncul di mobile via CSS) */}
//         <button
//           className={`hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`}
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           aria-label='Toggle menu'>
//           <span></span>
//           <span></span>
//           <span></span>
//         </button>

//         {/* Menu Controls */}
//         <div
//           className={`tab-controls ${
//             isMobileMenuOpen ? 'mobile-visible' : ''
//           }`}>
//           <button
//             className={activeTab === 'analytics' ? 'active' : ''}
//             onClick={() => handleNavClick('analytics')}>
//             Analytics
//           </button>
//           <button
//             className={activeTab === 'projects' ? 'active' : ''}
//             onClick={() => handleNavClick('projects')}>
//             Projects
//           </button>
//           <button
//             className='btn-logout'
//             onClick={handleLogout}>
//             Logout
//           </button>
//         </div>
//       </header>

//       {/* CONTENT AREA */}
//       <div className='dashboard-content'>
//         {activeTab === 'analytics' ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}>
//             {/* 1. STAT CARDS */}
//             <section className='stats-grid'>
//               <StatCard
//                 title='Today'
//                 value={stats.daily}
//                 color='#10b981'
//               />
//               <StatCard
//                 title='This Month'
//                 value={stats.monthly}
//                 color='#3b82f6'
//               />
//               <StatCard
//                 title='This Year'
//                 value={stats.yearly}
//                 color='#8b5cf6'
//               />
//               <StatCard
//                 title='All Time'
//                 value={stats.total}
//                 color='#6684b6ff'
//               />
//             </section>

//             {/* 2. DYNAMIC CHART SECTION */}
//             <section
//               className='chart-section'
//               style={{ marginTop: '2rem' }}>
//               <div className='chart-header'>
//                 <h3>Insight Visualization</h3>
//                 <select
//                   className='chart-selector'
//                   value={chartType}
//                   onChange={(e) => setChartType(e.target.value)}>
//                   <option value='dailyTrend'>Daily Traffic Trend</option>
//                   <option value='deviceSplit'>Device Distribution</option>
//                   <option value='topPages'>Top Visited Pages</option>
//                   <option value='location'>Visitor Location</option>
//                 </select>
//               </div>
//               <div className='chart-wrapper'>
//                 {logs.length > 0 ? (
//                   renderChart()
//                 ) : (
//                   <p style={{ textAlign: 'center', marginTop: '150px' }}>
//                     Not enough data for chart
//                   </p>
//                 )}
//               </div>
//             </section>

//             {/* 3. DETAILED LOGS TABLE */}
//             <section
//               className='table-section'
//               style={{ marginTop: '2rem' }}>
//               <div className='table-header'>
//                 <h3>Recent Traffic Logs</h3>
//                 <button onClick={fetchDashboardData}>Refresh Data ↻</button>
//               </div>

//               <div className='table-responsive'>
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Time</th>
//                       <th>Location</th>
//                       <th>Device</th>
//                       <th>Page / Referrer</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {logs.map((log) => (
//                       <tr key={log.id}>
//                         <td>
//                           {new Date(log.created_at).toLocaleTimeString([], {
//                             hour: '2-digit',
//                             minute: '2-digit',
//                           })}
//                           <span className='sub-text'>
//                             {new Date(log.created_at).toLocaleDateString()}
//                           </span>
//                         </td>
//                         <td>
//                           <span style={{ fontWeight: 600 }}>
//                             {log.city || 'Unknown'}
//                           </span>
//                           <span className='sub-text'>
//                             {log.country} • {log.isp}
//                           </span>
//                         </td>
//                         <td>
//                           <span className={`badge ${log.device_type}`}>
//                             {log.device_type?.toUpperCase() || 'DESKTOP'}
//                           </span>
//                           <span className='sub-text'>{log.os_name}</span>
//                         </td>
//                         <td>
//                           {log.page_path}
//                           {log.referrer && log.referrer !== 'Direct' && (
//                             <span
//                               className='sub-text'
//                               style={{ color: '#d97706' }}>
//                               via {getReferrerDisplay(log.referrer)}
//                             </span>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </section>
//           </motion.div>
//         ) : (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}>
//             <ManageProjects />
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
//
//
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
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

import './AdminDashboard.scss';
import ManageProjects from '../components/admin/ManageProjects';

// WARNA UNTUK CHART
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// --- KOMPONEN KECIL: FILTER DROPDOWN TABEL (EXCEL STYLE) ---
const FilterDropdown = ({
  options,
  selectedValues,
  onToggle,
  onClear,
  onClose,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      className='excel-filter-dropdown'
      ref={dropdownRef}>
      <div className='filter-actions'>
        <button
          className='btn-clear'
          onClick={onClear}
          disabled={selectedValues.length === 0}>
          Clear Filter
        </button>
      </div>
      <div className='filter-options-list'>
        {options.map((option) => (
          <label
            key={option}
            className='filter-option'>
            <input
              type='checkbox'
              checked={selectedValues.includes(option)}
              onChange={() => onToggle(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// --- KOMPONEN STAT CARD ---
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

  // --- STATE DATA ---
  const [stats, setStats] = useState({
    daily: 0,
    monthly: 0,
    yearly: 0,
    total: 0,
  });
  const [logs, setLogs] = useState([]); // Raw data
  const [loading, setLoading] = useState(true);

  // --- STATE UI UTAMA ---
  const [activeTab, setActiveTab] = useState('analytics');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- STATE FILTER CHART (BARU) ---
  const [timeFilter, setTimeFilter] = useState('daily'); // daily, weekly, monthly, yearly
  const [viewFilter, setViewFilter] = useState('traffic'); // traffic, device, pages, location

  // --- STATE FILTER TABEL ---
  const [activeFilters, setActiveFilters] = useState({});
  const [filterOpen, setFilterOpen] = useState(null);

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
      const { data: summary } = await supabase.rpc('get_visitor_stats');
      if (summary) setStats(summary);

      // Fetch limit dinaikkan ke 1000 agar filter Yearly/Monthly punya data cukup
      const { data: logData } = await supabase
        .from('analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

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

  const handleNavClick = (tabName) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false);
  };

  // =========================================================
  // LOGIC 1: CHART DATA PROCESSING (Time + View Filter)
  // =========================================================
  const chartData = useMemo(() => {
    // 1. Validasi Data
    if (!logs.length) return [];

    // 2. Filter Logs Berdasarkan Waktu (Time Scope)
    const now = new Date();
    const timeFilteredLogs = logs.filter((log) => {
      const logDate = new Date(log.created_at);

      if (timeFilter === 'daily') {
        // 24 Jam Terakhir
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return logDate >= oneDayAgo;
      } else if (timeFilter === 'weekly') {
        // 7 Hari Terakhir
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return logDate >= sevenDaysAgo;
      } else if (timeFilter === 'monthly') {
        // 30 Hari Terakhir
        const thirtyDaysAgo = new Date(
          now.getTime() - 30 * 24 * 60 * 60 * 1000
        );
        return logDate >= thirtyDaysAgo;
      } else if (timeFilter === 'yearly') {
        // 365 Hari Terakhir
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        return logDate >= oneYearAgo;
      }
      return true;
    });

    if (timeFilteredLogs.length === 0) return [];

    // 3. Agregasi Data Berdasarkan Tampilan (View Type)

    // A. TRAFFIC TREND (Line Chart)
    if (viewFilter === 'traffic') {
      const counts = {};
      timeFilteredLogs.forEach((log) => {
        const date = new Date(log.created_at);
        let label = '';

        if (timeFilter === 'daily') {
          // Label: Jam (09:00)
          label =
            date.toLocaleTimeString('en-US', {
              hour: '2-digit',
              hour12: false,
            }) + ':00';
        } else if (timeFilter === 'weekly') {
          // Label: Hari (Mon, Tue)
          label = date.toLocaleDateString('en-US', { weekday: 'short' });
        } else if (timeFilter === 'monthly') {
          // Label: Tanggal (Oct 25)
          label = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
        } else {
          // Label: Bulan (Jan 24)
          label = date.toLocaleDateString('en-US', {
            month: 'short',
            year: '2-digit',
          });
        }
        counts[label] = (counts[label] || 0) + 1;
      });
      // Sort manual khusus daily jam agar urut, yg lain pakai reverse log yg sudah desc
      return Object.keys(counts)
        .map((key) => ({ name: key, visits: counts[key] }))
        .reverse();
    }

    // B. DEVICE DISTRIBUTION (Pie Chart)
    else if (viewFilter === 'device') {
      const counts = { Desktop: 0, Mobile: 0 };
      timeFilteredLogs.forEach((log) => {
        const type = log.device_type === 'mobile' ? 'Mobile' : 'Desktop';
        counts[type]++;
      });
      return Object.keys(counts).map((key) => ({
        name: key,
        value: counts[key],
      }));
    }

    // C. TOP PAGES (Bar Chart)
    else if (viewFilter === 'pages') {
      const counts = {};
      timeFilteredLogs.forEach((log) => {
        const path =
          log.page_path.length > 20
            ? log.page_path.substring(0, 20) + '...'
            : log.page_path;
        counts[path] = (counts[path] || 0) + 1;
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));
    }

    // D. VISITOR LOCATION (Bar Chart)
    else if (viewFilter === 'location') {
      const counts = {};
      timeFilteredLogs.forEach((log) => {
        const loc = log.city || 'Unknown';
        counts[loc] = (counts[loc] || 0) + 1;
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));
    }

    return [];
  }, [logs, timeFilter, viewFilter]);

  // Helper Render Chart
  const renderChart = () => {
    if (viewFilter === 'traffic') {
      return (
        <ResponsiveContainer
          width='100%'
          height='100%'>
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray='3 3'
              vertical={false}
            />
            <XAxis
              dataKey='name'
              hide={chartData.length > 12}
            />
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
    } else if (viewFilter === 'device') {
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

  // =========================================================
  // LOGIC 2: TABLE DATA PROCESSING (Excel Filtering)
  // =========================================================

  const getUniqueValues = (key) => {
    const values = logs.map((log) => {
      if (key === 'created_at')
        return new Date(log.created_at).toLocaleDateString();
      return log[key] || 'Unknown';
    });
    return [...new Set(values)].sort();
  };

  const toggleFilter = (columnKey, value) => {
    setActiveFilters((prev) => {
      const currentValues = prev[columnKey] || [];
      if (currentValues.includes(value)) {
        const newValues = currentValues.filter((v) => v !== value);
        if (newValues.length === 0) {
          const { [columnKey]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [columnKey]: newValues };
      } else {
        return { ...prev, [columnKey]: [...currentValues, value] };
      }
    });
  };

  const clearColumnFilter = (columnKey) => {
    setActiveFilters((prev) => {
      const { [columnKey]: _, ...rest } = prev;
      return rest;
    });
  };

  // Logika Filter Tabel (Menggunakan logs mentah, tidak terpengaruh filter chart)
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      return Object.entries(activeFilters).every(([key, selectedValues]) => {
        if (!selectedValues || selectedValues.length === 0) return true;
        let logValue = log[key] || 'Unknown';
        if (key === 'created_at')
          logValue = new Date(log.created_at).toLocaleDateString();
        return selectedValues.includes(logValue);
      });
    });
  }, [logs, activeFilters]);

  // Helper Header dengan Filter
  const RenderFilterableHeader = ({ label, columnKey }) => {
    const isActive =
      activeFilters[columnKey] && activeFilters[columnKey].length > 0;
    const isOpen = filterOpen === columnKey;

    return (
      <th className={`filterable-th ${isActive ? 'filter-active' : ''}`}>
        <div className='th-content'>
          {label}
          <button
            className='filter-icon-btn'
            onClick={(e) => {
              e.stopPropagation();
              setFilterOpen(isOpen ? null : columnKey);
            }}>
            <svg
              width='12'
              height='12'
              viewBox='0 0 24 24'
              fill={isActive ? 'currentColor' : 'none'}
              stroke='currentColor'
              strokeWidth='3'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <polygon points='22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3'></polygon>
            </svg>
          </button>
        </div>
        {isOpen && (
          <FilterDropdown
            options={getUniqueValues(columnKey)}
            selectedValues={activeFilters[columnKey] || []}
            onToggle={(val) => toggleFilter(columnKey, val)}
            onClear={() => clearColumnFilter(columnKey)}
            onClose={() => setFilterOpen(null)}
          />
        )}
      </th>
    );
  };

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
      {/* --- HEADER --- */}
      <header className='dashboard-header'>
        <h1>Dashboard</h1>

        {/* Tombol Hamburger Mobile */}
        <button
          className={`hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label='Toggle menu'>
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menu Navigasi */}
        <div
          className={`tab-controls ${
            isMobileMenuOpen ? 'mobile-visible' : ''
          }`}>
          <button
            className={activeTab === 'analytics' ? 'active' : ''}
            onClick={() => handleNavClick('analytics')}>
            Analytics
          </button>
          <button
            className={activeTab === 'projects' ? 'active' : ''}
            onClick={() => handleNavClick('projects')}>
            Projects
          </button>
          <button
            className='btn-logout'
            onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* --- CONTENT AREA --- */}
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

            {/* 2. CHART SECTION (DUA FILTER) */}
            <section
              className='chart-section'
              style={{ marginTop: '2rem' }}>
              <div className='chart-header'>
                <h3>Insight Visualization</h3>
                <div
                  className='chart-filters'
                  style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {/* Filter 1: Rentang Waktu */}
                  <select
                    className='chart-selector'
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}>
                    <option value='daily'>Last 24 Hours</option>
                    <option value='weekly'>Last 7 Days</option>
                    <option value='monthly'>Last 30 Days</option>
                    <option value='yearly'>Last Year</option>
                  </select>

                  {/* Filter 2: Jenis Tampilan */}
                  <select
                    className='chart-selector'
                    value={viewFilter}
                    onChange={(e) => setViewFilter(e.target.value)}>
                    <option value='traffic'>Traffic Trend</option>
                    <option value='device'>Device Distribution</option>
                    <option value='pages'>Top Visited Pages</option>
                    <option value='location'>Visitor Location</option>
                  </select>
                </div>
              </div>

              <div className='chart-wrapper'>
                {chartData.length > 0 ? (
                  renderChart()
                ) : (
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#64748b',
                    }}>
                    <p style={{ fontWeight: 600 }}>No Data Available</p>
                    <p style={{ fontSize: '0.9rem' }}>
                      Try changing the time filter.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* 3. TABLE SECTION (EXCEL FILTER) */}
            <section
              className='table-section'
              style={{ marginTop: '2rem' }}>
              <div className='table-header'>
                <h3>
                  Recent Traffic Logs{' '}
                  {Object.keys(activeFilters).length > 0 && (
                    <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>
                      (Filtered)
                    </span>
                  )}
                </h3>
                <button onClick={fetchDashboardData}>Refresh Data ↻</button>
              </div>

              <div
                className='table-responsive'
                style={{ overflow: 'visible' }}>
                <table>
                  <thead>
                    <tr>
                      <RenderFilterableHeader
                        label='Date'
                        columnKey='created_at'
                      />
                      <RenderFilterableHeader
                        label='Location (City)'
                        columnKey='city'
                      />
                      <RenderFilterableHeader
                        label='Device'
                        columnKey='device_type'
                      />
                      <RenderFilterableHeader
                        label='Page Path'
                        columnKey='page_path'
                      />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
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
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan='4'
                          style={{ textAlign: 'center', padding: '2rem' }}>
                          No data matches your filter.
                        </td>
                      </tr>
                    )}
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
