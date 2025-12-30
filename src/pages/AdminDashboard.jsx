// import React, { useEffect, useState, useMemo, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../lib/supabaseClient';
// import { motion, AnimatePresence } from 'framer-motion';
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

// import './AdminDashboard.scss';
// import ManageProjects from '../components/admin/ManageProjects';

// // WARNA UNTUK CHART
// const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// // --- KOMPONEN KECIL: FILTER DROPDOWN TABEL (EXCEL STYLE) ---
// const FilterDropdown = ({
//   options,
//   selectedValues,
//   onToggle,
//   onClear,
//   onClose,
// }) => {
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         onClose();
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [onClose]);

//   return (
//     <div
//       className='excel-filter-dropdown'
//       ref={dropdownRef}>
//       <div className='filter-actions'>
//         <button
//           className='btn-clear'
//           onClick={onClear}
//           disabled={selectedValues.length === 0}>
//           Clear Filter
//         </button>
//       </div>
//       <div className='filter-options-list'>
//         {options.map((option) => (
//           <label
//             key={option}
//             className='filter-option'>
//             <input
//               type='checkbox'
//               checked={selectedValues.includes(option)}
//               onChange={() => onToggle(option)}
//             />
//             <span>{option}</span>
//           </label>
//         ))}
//       </div>
//     </div>
//   );
// };

// // --- KOMPONEN STAT CARD ---
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

//   // --- STATE DATA ---
//   const [stats, setStats] = useState({
//     daily: 0,
//     monthly: 0,
//     yearly: 0,
//     total: 0,
//   });
//   const [logs, setLogs] = useState([]); // Raw data
//   const [loading, setLoading] = useState(true);

//   // --- STATE UI UTAMA ---
//   const [activeTab, setActiveTab] = useState('analytics');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   // --- STATE FILTER CHART (BARU) ---
//   const [timeFilter, setTimeFilter] = useState('daily'); // daily, weekly, monthly, yearly
//   const [viewFilter, setViewFilter] = useState('traffic'); // traffic, device, pages, location

//   // --- STATE FILTER TABEL ---
//   const [activeFilters, setActiveFilters] = useState({});
//   const [filterOpen, setFilterOpen] = useState(null);

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
//       const { data: summary } = await supabase.rpc('get_visitor_stats');
//       if (summary) setStats(summary);

//       // Fetch limit dinaikkan ke 1000 agar filter Yearly/Monthly punya data cukup
//       const { data: logData } = await supabase
//         .from('analytics')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(1000);

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

//   const handleNavClick = (tabName) => {
//     setActiveTab(tabName);
//     setIsMobileMenuOpen(false);
//   };

//   // =========================================================
//   // LOGIC 1: CHART DATA PROCESSING (Time + View Filter)
//   // =========================================================
//   const chartData = useMemo(() => {
//     // 1. Validasi Data
//     if (!logs.length) return [];

//     // 2. Filter Logs Berdasarkan Waktu (Time Scope)
//     const now = new Date();
//     const timeFilteredLogs = logs.filter((log) => {
//       const logDate = new Date(log.created_at);

//       if (timeFilter === 'daily') {
//         // 24 Jam Terakhir
//         const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
//         return logDate >= oneDayAgo;
//       } else if (timeFilter === 'weekly') {
//         // 7 Hari Terakhir
//         const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//         return logDate >= sevenDaysAgo;
//       } else if (timeFilter === 'monthly') {
//         // 30 Hari Terakhir
//         const thirtyDaysAgo = new Date(
//           now.getTime() - 30 * 24 * 60 * 60 * 1000
//         );
//         return logDate >= thirtyDaysAgo;
//       } else if (timeFilter === 'yearly') {
//         // 365 Hari Terakhir
//         const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
//         return logDate >= oneYearAgo;
//       }
//       return true;
//     });

//     if (timeFilteredLogs.length === 0) return [];

//     // 3. Agregasi Data Berdasarkan Tampilan (View Type)

//     // A. TRAFFIC TREND (Line Chart)
//     if (viewFilter === 'traffic') {
//       const counts = {};
//       timeFilteredLogs.forEach((log) => {
//         const date = new Date(log.created_at);
//         let label = '';

//         if (timeFilter === 'daily') {
//           // Label: Jam (09:00)
//           label =
//             date.toLocaleTimeString('en-US', {
//               hour: '2-digit',
//               hour12: false,
//             }) + ':00';
//         } else if (timeFilter === 'weekly') {
//           // Label: Hari (Mon, Tue)
//           label = date.toLocaleDateString('en-US', { weekday: 'short' });
//         } else if (timeFilter === 'monthly') {
//           // Label: Tanggal (Oct 25)
//           label = date.toLocaleDateString('en-US', {
//             month: 'short',
//             day: 'numeric',
//           });
//         } else {
//           // Label: Bulan (Jan 24)
//           label = date.toLocaleDateString('en-US', {
//             month: 'short',
//             year: '2-digit',
//           });
//         }
//         counts[label] = (counts[label] || 0) + 1;
//       });
//       // Sort manual khusus daily jam agar urut, yg lain pakai reverse log yg sudah desc
//       return Object.keys(counts)
//         .map((key) => ({ name: key, visits: counts[key] }))
//         .reverse();
//     }

//     // B. DEVICE DISTRIBUTION (Pie Chart)
//     else if (viewFilter === 'device') {
//       const counts = { Desktop: 0, Mobile: 0 };
//       timeFilteredLogs.forEach((log) => {
//         const type = log.device_type === 'mobile' ? 'Mobile' : 'Desktop';
//         counts[type]++;
//       });
//       return Object.keys(counts).map((key) => ({
//         name: key,
//         value: counts[key],
//       }));
//     }

//     // C. TOP PAGES (Bar Chart)
//     else if (viewFilter === 'pages') {
//       const counts = {};
//       timeFilteredLogs.forEach((log) => {
//         const path =
//           log.page_path.length > 20
//             ? log.page_path.substring(0, 20) + '...'
//             : log.page_path;
//         counts[path] = (counts[path] || 0) + 1;
//       });
//       return Object.entries(counts)
//         .sort((a, b) => b[1] - a[1])
//         .slice(0, 5)
//         .map(([name, count]) => ({ name, count }));
//     }

//     // D. VISITOR LOCATION (Bar Chart)
//     else if (viewFilter === 'location') {
//       const counts = {};
//       timeFilteredLogs.forEach((log) => {
//         const loc = log.city || 'Unknown';
//         counts[loc] = (counts[loc] || 0) + 1;
//       });
//       return Object.entries(counts)
//         .sort((a, b) => b[1] - a[1])
//         .slice(0, 5)
//         .map(([name, count]) => ({ name, count }));
//     }

//     return [];
//   }, [logs, timeFilter, viewFilter]);

//   // Helper Render Chart
//   const renderChart = () => {
//     if (viewFilter === 'traffic') {
//       return (
//         <ResponsiveContainer
//           width='100%'
//           height='100%'>
//           <LineChart data={chartData}>
//             <CartesianGrid
//               strokeDasharray='3 3'
//               vertical={false}
//             />
//             <XAxis
//               dataKey='name'
//               hide={chartData.length > 12}
//             />
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
//     } else if (viewFilter === 'device') {
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

//   // =========================================================
//   // LOGIC 2: TABLE DATA PROCESSING (Excel Filtering)
//   // =========================================================

//   const getUniqueValues = (key) => {
//     const values = logs.map((log) => {
//       if (key === 'created_at')
//         return new Date(log.created_at).toLocaleDateString();
//       return log[key] || 'Unknown';
//     });
//     return [...new Set(values)].sort();
//   };

//   const toggleFilter = (columnKey, value) => {
//     setActiveFilters((prev) => {
//       const currentValues = prev[columnKey] || [];
//       if (currentValues.includes(value)) {
//         const newValues = currentValues.filter((v) => v !== value);
//         if (newValues.length === 0) {
//           const { [columnKey]: _, ...rest } = prev;
//           return rest;
//         }
//         return { ...prev, [columnKey]: newValues };
//       } else {
//         return { ...prev, [columnKey]: [...currentValues, value] };
//       }
//     });
//   };

//   const clearColumnFilter = (columnKey) => {
//     setActiveFilters((prev) => {
//       const { [columnKey]: _, ...rest } = prev;
//       return rest;
//     });
//   };

//   // Logika Filter Tabel (Menggunakan logs mentah, tidak terpengaruh filter chart)
//   const filteredLogs = useMemo(() => {
//     return logs.filter((log) => {
//       return Object.entries(activeFilters).every(([key, selectedValues]) => {
//         if (!selectedValues || selectedValues.length === 0) return true;
//         let logValue = log[key] || 'Unknown';
//         if (key === 'created_at')
//           logValue = new Date(log.created_at).toLocaleDateString();
//         return selectedValues.includes(logValue);
//       });
//     });
//   }, [logs, activeFilters]);

//   // Helper Header dengan Filter
//   const RenderFilterableHeader = ({ label, columnKey }) => {
//     const isActive =
//       activeFilters[columnKey] && activeFilters[columnKey].length > 0;
//     const isOpen = filterOpen === columnKey;

//     return (
//       <th className={`filterable-th ${isActive ? 'filter-active' : ''}`}>
//         <div className='th-content'>
//           {label}
//           <button
//             className='filter-icon-btn'
//             onClick={(e) => {
//               e.stopPropagation();
//               setFilterOpen(isOpen ? null : columnKey);
//             }}>
//             <svg
//               width='12'
//               height='12'
//               viewBox='0 0 24 24'
//               fill={isActive ? 'currentColor' : 'none'}
//               stroke='currentColor'
//               strokeWidth='3'
//               strokeLinecap='round'
//               strokeLinejoin='round'>
//               <polygon points='22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3'></polygon>
//             </svg>
//           </button>
//         </div>
//         {isOpen && (
//           <FilterDropdown
//             options={getUniqueValues(columnKey)}
//             selectedValues={activeFilters[columnKey] || []}
//             onToggle={(val) => toggleFilter(columnKey, val)}
//             onClear={() => clearColumnFilter(columnKey)}
//             onClose={() => setFilterOpen(null)}
//           />
//         )}
//       </th>
//     );
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
//       {/* --- HEADER --- */}
//       <header className='dashboard-header'>
//         <h1>Dashboard</h1>

//         {/* Tombol Hamburger Mobile */}
//         <button
//           className={`hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`}
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           aria-label='Toggle menu'>
//           <span></span>
//           <span></span>
//           <span></span>
//         </button>

//         {/* Menu Navigasi */}
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

//       {/* --- CONTENT AREA --- */}
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

//             {/* 2. CHART SECTION (DUA FILTER) */}
//             <section
//               className='chart-section'
//               style={{ marginTop: '2rem' }}>
//               <div className='chart-header'>
//                 <h3>Insight Visualization</h3>
//                 <div
//                   className='chart-filters'
//                   style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
//                   {/* Filter 1: Rentang Waktu */}
//                   <select
//                     className='chart-selector'
//                     value={timeFilter}
//                     onChange={(e) => setTimeFilter(e.target.value)}>
//                     <option value='daily'>Last 24 Hours</option>
//                     <option value='weekly'>Last 7 Days</option>
//                     <option value='monthly'>Last 30 Days</option>
//                     <option value='yearly'>Last Year</option>
//                   </select>

//                   {/* Filter 2: Jenis Tampilan */}
//                   <select
//                     className='chart-selector'
//                     value={viewFilter}
//                     onChange={(e) => setViewFilter(e.target.value)}>
//                     <option value='traffic'>Traffic Trend</option>
//                     <option value='device'>Device Distribution</option>
//                     <option value='pages'>Top Visited Pages</option>
//                     <option value='location'>Visitor Location</option>
//                   </select>
//                 </div>
//               </div>

//               <div className='chart-wrapper'>
//                 {chartData.length > 0 ? (
//                   renderChart()
//                 ) : (
//                   <div
//                     style={{
//                       height: '100%',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       color: '#64748b',
//                     }}>
//                     <p style={{ fontWeight: 600 }}>No Data Available</p>
//                     <p style={{ fontSize: '0.9rem' }}>
//                       Try changing the time filter.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </section>

//             {/* 3. TABLE SECTION (EXCEL FILTER) */}
//             <section
//               className='table-section'
//               style={{ marginTop: '2rem' }}>
//               <div className='table-header'>
//                 <h3>
//                   Recent Traffic Logs{' '}
//                   {Object.keys(activeFilters).length > 0 && (
//                     <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>
//                       (Filtered)
//                     </span>
//                   )}
//                 </h3>
//                 <button onClick={fetchDashboardData}>Refresh Data ↻</button>
//               </div>

//               <div
//                 className='table-responsive'
//                 style={{ overflow: 'visible' }}>
//                 <table>
//                   <thead>
//                     <tr>
//                       <RenderFilterableHeader
//                         label='Date'
//                         columnKey='created_at'
//                       />
//                       <RenderFilterableHeader
//                         label='Location (City)'
//                         columnKey='city'
//                       />
//                       <RenderFilterableHeader
//                         label='Device'
//                         columnKey='device_type'
//                       />
//                       <RenderFilterableHeader
//                         label='Page Path'
//                         columnKey='page_path'
//                       />
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredLogs.length > 0 ? (
//                       filteredLogs.map((log) => (
//                         <tr key={log.id}>
//                           <td>
//                             {new Date(log.created_at).toLocaleTimeString([], {
//                               hour: '2-digit',
//                               minute: '2-digit',
//                             })}
//                             <span className='sub-text'>
//                               {new Date(log.created_at).toLocaleDateString()}
//                             </span>
//                           </td>
//                           <td>
//                             <span style={{ fontWeight: 600 }}>
//                               {log.city || 'Unknown'}
//                             </span>
//                             <span className='sub-text'>
//                               {log.country} • {log.isp}
//                             </span>
//                           </td>
//                           <td>
//                             <span className={`badge ${log.device_type}`}>
//                               {log.device_type?.toUpperCase() || 'DESKTOP'}
//                             </span>
//                             <span className='sub-text'>{log.os_name}</span>
//                           </td>
//                           <td>
//                             {log.page_path}
//                             {log.referrer && log.referrer !== 'Direct' && (
//                               <span
//                                 className='sub-text'
//                                 style={{ color: '#d97706' }}>
//                                 via {getReferrerDisplay(log.referrer)}
//                               </span>
//                             )}
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan='4'
//                           style={{ textAlign: 'center', padding: '2rem' }}>
//                           No data matches your filter.
//                         </td>
//                       </tr>
//                     )}
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
//
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
// IMPORTS CHARTING LIBRARY LENGKAP
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
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
const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#6366f1',
];

// --- KOMPONEN KECIL: FILTER DROPDOWN TABEL (TETAP SAMA) ---
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

// --- KOMPONEN STAT CARD (DIUPDATE SEDIKIT UTK ICON) ---
const StatCard = ({ title, value, subValue, color, icon }) => (
  <motion.div
    className='stat-card'
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <h4>{title}</h4>
      {icon && <span style={{ fontSize: '1.2rem', opacity: 0.7 }}>{icon}</span>}
    </div>
    <p
      className='stat-value'
      style={{ color: color }}>
      {value}
    </p>
    {subValue && (
      <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
        {subValue}
      </p>
    )}
  </motion.div>
);

// --- KOMPONEN BARU: LOG DETAIL MODAL (DEEP DIVE) ---
const LogDetailModal = ({ log, onClose }) => {
  if (!log) return null;
  const details = [
    { label: 'Time', value: new Date(log.created_at).toLocaleString() },
    { label: 'Page', value: log.page_path },
    { label: 'Project ID', value: log.project_id || '-' },
    { label: 'IP Address', value: log.ip_address },
    { label: 'ISP', value: log.isp },
    { label: 'Location', value: `${log.city}, ${log.country}` },
    { label: 'Device', value: log.device_type?.toUpperCase() },
    { label: 'OS', value: log.os_name },
    { label: 'Browser', value: log.browser_name },
    { label: 'Screen', value: log.screen_resolution },
    { label: 'Referrer', value: log.referrer },
    { label: 'User Agent', value: log.user_agent, full: true },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        }}
        onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '16px',
            borderBottom: '1px solid #eee',
          }}>
          <h3>Session Details</h3>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
            }}>
            ×
          </button>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}>
          {details.map((item, idx) => (
            <div
              key={idx}
              style={{ gridColumn: item.full ? 'span 2' : 'span 1' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                {item.label}
              </p>
              <p
                style={{ margin: 0, fontWeight: 500, wordBreak: 'break-word' }}>
                {item.value || '-'}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  // --- STATE DATA ---
  const [stats, setStats] = useState({
    daily: 0,
    monthly: 0,
    yearly: 0,
    total: 0,
  });
  const [projectPerf, setProjectPerf] = useState([]); // State Baru: Ranking Project
  const [chartData, setChartData] = useState([]); // State Baru: Data Chart dari RPC
  const [logs, setLogs] = useState([]); // Raw data tabel
  const [loading, setLoading] = useState(true);

  // --- STATE UI UTAMA ---
  const [activeTab, setActiveTab] = useState('analytics');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null); // State Baru: Modal

  // --- STATE FILTER CHART ---
  const [timeFilter, setTimeFilter] = useState('daily');
  const [viewFilter, setViewFilter] = useState('traffic');
  const [chartType, setChartType] = useState('area'); // State Baru: Pilihan Model Chart

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

  // Effect Baru: Re-fetch Chart saat filter berubah
  useEffect(() => {
    if (!loading) fetchChartRpc();
  }, [timeFilter, viewFilter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Stat Cards (Existing RPC)
      const { data: summary } = await supabase.rpc('get_visitor_stats');
      if (summary) setStats(summary);

      // 2. Ranking Popularitas & Conversion (New RPC)
      const { data: rankings } = await supabase.rpc('get_project_performance');
      if (rankings) setProjectPerf(rankings);

      // 3. Chart Data (New RPC)
      await fetchChartRpc();

      // 4. Table Logs (Raw Data)
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

  // Fungsi khusus fetch chart RPC
  const fetchChartRpc = async () => {
    try {
      const { data } = await supabase.rpc('get_analytics_trend', {
        time_range: timeFilter,
        metric_type: viewFilter,
      });
      if (data) setChartData(data);
    } catch (e) {
      console.error('Chart Error', e);
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

  // --- HELPER RENDER CHART BARU (FLEKSIBEL) ---
  const renderChart = () => {
    if (!chartData || chartData.length === 0)
      return (
        <div
          className='no-data'
          style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
          No Data Available
        </div>
      );

    const isCategory = viewFilter !== 'traffic';
    const CommonTooltip = () => (
      <Tooltip
        contentStyle={{
          borderRadius: '8px',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      />
    );

    return (
      <ResponsiveContainer
        width='100%'
        height='100%'>
        {chartType === 'area' && !isCategory ? (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient
                id='colorVal'
                x1='0'
                y1='0'
                x2='0'
                y2='1'>
                <stop
                  offset='5%'
                  stopColor='#3b82f6'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='#3b82f6'
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray='3 3'
              vertical={false}
            />
            <XAxis
              dataKey='label'
              hide={chartData.length > 20}
            />
            <YAxis />
            <CommonTooltip />
            <Area
              type='monotone'
              dataKey='value'
              stroke='#3b82f6'
              fillOpacity={1}
              fill='url(#colorVal)'
            />
          </AreaChart>
        ) : chartType === 'bar' ? (
          <BarChart
            data={chartData}
            layout={isCategory ? 'vertical' : 'horizontal'}>
            <CartesianGrid
              strokeDasharray='3 3'
              horizontal={true}
              vertical={false}
            />
            {isCategory ? (
              <>
                <XAxis
                  type='number'
                  hide
                />
                <YAxis
                  dataKey='label'
                  type='category'
                  width={100}
                  tick={{ fontSize: 11 }}
                />
              </>
            ) : (
              <>
                <XAxis dataKey='label' />
                <YAxis />
              </>
            )}
            <CommonTooltip />
            <Bar
              dataKey='value'
              fill='#8b5cf6'
              radius={[0, 4, 4, 0]}
              barSize={20}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        ) : chartType === 'radar' ? (
          <RadarChart
            cx='50%'
            cy='50%'
            outerRadius='80%'
            data={chartData}>
            <PolarGrid />
            <PolarAngleAxis
              dataKey='label'
              tick={{ fontSize: 10 }}
            />
            <PolarRadiusAxis />
            <Radar
              name='Count'
              dataKey='value'
              stroke='#10b981'
              fill='#10b981'
              fillOpacity={0.6}
            />
            <CommonTooltip />
          </RadarChart>
        ) : chartType === 'pie' || chartType === 'donut' ? (
          <PieChart>
            <Pie
              data={chartData}
              cx='50%'
              cy='50%'
              innerRadius={chartType === 'donut' ? 60 : 0}
              outerRadius={80}
              paddingAngle={5}
              dataKey='value'
              nameKey='label'>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <CommonTooltip />
            <Legend
              verticalAlign='bottom'
              height={36}
            />
          </PieChart>
        ) : (
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray='3 3'
              vertical={false}
            />
            <XAxis
              dataKey='label'
              hide={chartData.length > 20}
            />
            <YAxis />
            <CommonTooltip />
            <Line
              type='monotone'
              dataKey='value'
              stroke='#f59e0b'
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    );
  };

  // --- LOGIC FILTER TABEL (TETAP SAMA) ---
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

  // --- DERIVED DATA UNTUK STAT CARDS BARU ---
  const topViewed = projectPerf[0] || { title: '-', total_views: 0 };
  const topLiked = [...projectPerf].sort(
    (a, b) => b.total_likes - a.total_likes
  )[0] || { title: '-', total_likes: 0 };
  const topConv = [...projectPerf].sort(
    (a, b) => b.conversion_rate - a.conversion_rate
  )[0] || { title: '-', conversion_rate: 0 };
  // Fallback client side utk top location jika belum ada RPC location khusus
  const locations = logs.map((l) => l.city);
  const topLoc =
    locations
      .sort(
        (a, b) =>
          locations.filter((v) => v === a).length -
          locations.filter((v) => v === b).length
      )
      .pop() || '-';

  return (
    <div className='admin-dashboard'>
      {/* MODAL DEEP DIVE */}
      <LogDetailModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />

      {/* --- HEADER --- */}
      <header className='dashboard-header'>
        <h1>Dashboard</h1>
        <button
          className={`hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
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
            {/* 1. STAT CARDS (DITAMBAH YANG BARU) */}
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

              {/* Tambahan Stat Card Ranking */}
              <StatCard
                title='Top Viewed'
                value={topViewed.title}
                subValue={`${topViewed.total_views} Views`}
                color='#f59e0b'
                icon='👁'
              />
              <StatCard
                title='Top Liked'
                value={topLiked.title}
                subValue={`${topLiked.total_likes} Likes`}
                color='#ec4899'
                icon='♥'
              />
              <StatCard
                title='Best Conversion'
                value={`${topConv.conversion_rate}%`}
                subValue={topConv.title}
                color='#10b981'
                icon='⚡'
              />
              <StatCard
                title='Top Location'
                value={topLoc}
                color='#6366f1'
                icon='📍'
              />
            </section>

            {/* 2. CHART SECTION (DIUPDATE DENGAN OPTION BARU) */}
            <section
              className='chart-section'
              style={{ marginTop: '2rem' }}>
              <div
                className='chart-header'
                style={{ flexWrap: 'wrap', gap: '10px' }}>
                <h3>Insight Visualization</h3>
                <div
                  className='chart-filters'
                  style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {/* Filter Time */}
                  <select
                    className='chart-selector'
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}>
                    <option value='daily'>Last 24 Hours</option>
                    <option value='weekly'>Last 7 Days</option>
                    <option value='monthly'>Last 30 Days</option>
                    <option value='yearly'>Last Year</option>
                  </select>

                  {/* Filter Metric (Ditambah option baru) */}
                  <select
                    className='chart-selector'
                    value={viewFilter}
                    onChange={(e) => setViewFilter(e.target.value)}>
                    <option value='traffic'>Traffic Trend</option>
                    <option value='device'>Device Distribution</option>
                    <option value='pages'>Top Visited Pages</option>
                    <option value='location'>Visitor Location</option>
                    <option value='os'>OS System</option>
                    <option value='browser'>Browser</option>
                  </select>

                  {/* Filter Chart Type (BARU) */}
                  <select
                    className='chart-selector'
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    style={{
                      borderLeft: '2px solid #ddd',
                      paddingLeft: '10px',
                    }}>
                    <option value='area'>Area Chart</option>
                    <option value='line'>Line Chart</option>
                    <option value='bar'>Bar Chart</option>
                    <option value='pie'>Pie Chart</option>
                    <option value='donut'>Donut Chart</option>
                    <option value='radar'>Radar Chart</option>
                  </select>
                </div>
              </div>

              <div
                className='chart-wrapper'
                style={{ minHeight: '350px' }}>
                {renderChart()}
              </div>
            </section>

            {/* 3. TABLE SECTION (DITAMBAH FAT INDICATOR & KOLOM BARU) */}
            <section
              className='table-section'
              style={{ marginTop: '2rem' }}>
              <div
                className='table-header'
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center',
                  }}>
                  <h3>Recent Traffic Logs</h3>
                  <button onClick={fetchDashboardData}>Refresh Data ↻</button>
                </div>

                {/* DATA FAT INDICATOR */}
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#64748b',
                    background: '#f8fafc',
                    padding: '5px 10px',
                    borderRadius: '15px',
                  }}>
                  Showing <b>{filteredLogs.length}</b> filtered from{' '}
                  <b>{logs.length}</b> records fetched.
                </div>
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
                        label='Location'
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
                      {/* Kolom Tambahan */}
                      <RenderFilterableHeader
                        label='OS'
                        columnKey='os_name'
                      />
                      <RenderFilterableHeader
                        label='Browser'
                        columnKey='browser_name'
                      />
                      <th>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
                        <tr
                          key={log.id}
                          onClick={() => setSelectedLog(log)}
                          style={{
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                          }}
                          title='Click to Deep Dive'
                          onMouseOver={(e) =>
                            (e.currentTarget.style.background = '#f8fafc')
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.background = 'transparent')
                          }>
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
                          </td>
                          <td>{log.page_path}</td>
                          {/* Data Kolom Tambahan */}
                          <td>{log.os_name}</td>
                          <td>{log.browser_name}</td>
                          <td>
                            {log.referrer && log.referrer !== 'Direct' ? (
                              <span
                                className='sub-text'
                                style={{ color: '#d97706' }}>
                                {getReferrerDisplay(log.referrer)}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan='7'
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
