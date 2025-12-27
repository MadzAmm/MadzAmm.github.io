import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronUp, FiChevronDown, FiAlertCircle } from 'react-icons/fi';
import './ManageProjects.scss';
import { ButtonReveal } from '../buttonReveal/ButtonReveal';

// Hook useOnClickOutside untuk menutup dropdown
const useOnClickOutside = (ref, callback) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      callback(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, callback]);
};

// Varian animasi dropdown identik dengan UserInputBar
const menuVariants = {
  open: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
      staggerDirection: -1,
    },
  },
  closed: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: 1,
      when: 'afterChildren',
    },
  },
};

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: { y: { stiffness: 1000, velocity: -100 } },
  },
  closed: { y: 20, opacity: 0, transition: { y: { stiffness: 1000 } } },
};

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    category: '',
    is_activity: false,
    place: '',
    company: '',
    tagline: '',
    description_title: '',
    description_body: '',
    image_url: '',
    hero_image: '',
    detail_image_1: '',
    detail_image_2: '',
    repo_link: '',
    notion_link: '',
    emergency_link: '',
    external_link: '',
    details: '{}',
  });

  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('id', { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTemplateSelect = (type) => {
    let template = '{}';
    if (type === 'web') {
      template =
        '{\n  "frontend": "React, Vite",\n  "backend": "Node.js",\n  "database": "Supabase",\n  "deploy": "Vercel"\n}';
    } else if (type === 'analysis') {
      template =
        '{\n  "tools": "Python, SQL",\n  "visualization": "Tableau",\n  "insight": "Retention up 20%",\n  "dataSource": "Internal DB",\n  "methodology": "Cohort Analysis"\n}';
    } else if (type === 'data') {
      template =
        '{\n  "tools": "Python, Scikit-Learn",\n  "visualization": "Tableau",\n  "model": "Random Forest",\n  "dataset": "Kaggle",\n  "metric": "Accuracy 95%"\n}';
    } else if (type === 'design') {
      template =
        '{\n  "software": "Figma",\n  "typography": "Inter",\n  "colors": ["#000000", "#FFFFFF"]\n}';
    }
    setFormData((prev) => ({ ...prev, details: template }));
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        category: formData.category.split(',').map((c) => c.trim()),
        details: JSON.parse(formData.details),
      };
      const { error } = isEditing
        ? await supabase.from('projects').update(payload).eq('id', editId)
        : await supabase.from('projects').insert([payload]);

      if (error) throw error;
      alert('Berhasil!');
      resetForm();
      fetchProjects();
    } catch (err) {
      alert('Format JSON Error atau ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      year: new Date().getFullYear(),
      category: '',
      is_activity: false,
      place: '',
      company: '',
      tagline: '',
      description_title: '',
      description_body: '',
      image_url: '',
      hero_image: '',
      detail_image_1: '',
      detail_image_2: '',
      repo_link: '',
      notion_link: '',
      emergency_link: '',
      external_link: '',
      details: '{}',
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleEdit = (p) => {
    setIsEditing(true);
    setEditId(p.id);
    setFormData({
      ...p,
      category: p.category.join(', '),
      details: JSON.stringify(p.details, null, 2),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus proyek ini?')) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (!error) fetchProjects();
    }
  };

  return (
    <div className='manage-container'>
      <header className='manage-header'>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}>
          {isEditing ? 'Edit Project Mode' : 'Add New Project'}
        </motion.h2>
        {isEditing && (
          <ButtonReveal
            whileTap={{ scale: 0.85 }}
            className='btn-cancel'
            onClick={resetForm}>
            Cancel Edit
          </ButtonReveal>
        )}
      </header>

      <form
        className='manage-form'
        onSubmit={handleSubmit}>
        {/* GROUP 1: IDENTITAS */}
        <motion.div
          className='form-card'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}>
          <h4 className='section-title'>1. Identitas & Meta</h4>
          <div
            className='input-group'
            data-tooltip='Judul utama (H1) di paling atas halaman ProjectPage.'>
            <label>Project Title</label>
            <input
              name='title'
              value={formData.title}
              onChange={handleChange}
              placeholder='Contoh: Emu Wildlife Analytics'
              required
            />
          </div>
          <div className='grid-row'>
            <div
              className='input-group'
              data-tooltip='Tahun proyek.'>
              <label>Year</label>
              <input
                name='year'
                value={formData.year}
                onChange={handleChange}
                placeholder='2025'
              />
            </div>
            <div
              className='input-group'
              data-tooltip='Nama Klien/Perusahaan.'>
              <label>Company</label>
              <input
                name='company'
                value={formData.company}
                onChange={handleChange}
                placeholder='Wildlife Protection Inc.'
              />
            </div>
          </div>
          <div
            className='input-group'
            data-tooltip='Kategori (Pisahkan koma).'>
            <label>Category</label>
            <input
              name='category'
              value={formData.category}
              onChange={handleChange}
              placeholder='Web Development, Data Analysis'
            />
          </div>
          <div
            className='input-group'
            data-tooltip='Lokasi proyek.'>
            <label>Location</label>
            <input
              name='place'
              value={formData.place}
              onChange={handleChange}
              placeholder='Perth, Australia'
            />
          </div>
          <motion.label
            whileTap={{ scale: 0.98 }}
            className='checkbox-box'
            data-tooltip='Centang jika ini Sertifikasi/Seminar.'>
            <input
              type='checkbox'
              name='is_activity'
              checked={formData.is_activity}
              onChange={handleChange}
            />
            <span>Mark as Activity</span>
          </motion.label>
        </motion.div>

        {/* GROUP 2: VISUAL */}
        <motion.div
          className='form-card'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}>
          <h4 className='section-title'>2. Visual & Media</h4>
          <div
            className='input-group'
            data-tooltip='Thumbnail kecil kartu Next Project.'>
            <label>Thumbnail URL</label>
            <input
              name='image_url'
              value={formData.image_url}
              onChange={handleChange}
              placeholder='https://.../emu.avif'
            />
          </div>
          <div
            className='input-group'
            data-tooltip='Gambar parallax raksasa di atas.'>
            <label>Hero Image URL</label>
            <input
              name='hero_image'
              value={formData.hero_image}
              onChange={handleChange}
              placeholder='https://.../emu.avif'
            />
          </div>
          <div className='grid-row'>
            <div
              className='input-group'
              data-tooltip='Gambar di dalam frame putih.'>
              <label>Detail Image 1</label>
              <input
                name='detail_image_1'
                value={formData.detail_image_1}
                onChange={handleChange}
                placeholder='URL'
              />
            </div>
            <div
              className='input-group'
              data-tooltip='Gambar pendamping deskripsi.'>
              <label>Detail Image 2</label>
              <input
                name='detail_image_2'
                value={formData.detail_image_2}
                onChange={handleChange}
                placeholder='URL'
              />
            </div>
          </div>
        </motion.div>

        {/* GROUP 3: CONTENT */}
        <motion.div
          className='form-card'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}>
          <h4 className='section-title'>3. Konten Teks</h4>
          <div
            className='input-group'
            data-tooltip='Teks footer frame (Mendukung tag <b>).'>
            <label>Tagline</label>
            <input
              name='tagline'
              value={formData.tagline}
              onChange={handleChange}
              placeholder='CONSERVING <b>THE FUTURE</b>'
            />
          </div>
          <div
            className='input-group'
            data-tooltip='Judul deskripsi (Mendukung tag <br/>).'>
            <label>Description Title</label>
            <input
              name='description_title'
              value={formData.description_title}
              onChange={handleChange}
              placeholder='The Avian <br/> Data Project'
            />
          </div>
          <div
            className='input-group'
            data-tooltip='Paragraf narasi utama.'>
            <label>Description Body</label>
            <textarea
              name='description_body'
              value={formData.description_body}
              onChange={handleChange}
              placeholder='Platform pelacakan data real-time...'
            />
          </div>
        </motion.div>

        {/* GROUP 4: LINKS & SPECS (JSONB LUAS) */}
        <motion.div
          className='form-card form-card-full'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}>
          <h4 className='section-title'>4. Links & Technical Specs</h4>
          <div className='grid-row'>
            <div className='input-group'>
              <input
                name='repo_link'
                value={formData.repo_link}
                onChange={handleChange}
                placeholder='Repo Link (GitHub)'
              />
            </div>
            <div className='input-group'>
              <input
                name='notion_link'
                value={formData.notion_link}
                onChange={handleChange}
                placeholder='Notion Docs URL'
              />
            </div>
            <div className='input-group'>
              <input
                name='external_link'
                value={formData.external_link}
                onChange={handleChange}
                placeholder='Live Site URL'
              />
            </div>
            <div className='input-group'>
              <input
                name='emergency_link'
                value={formData.emergency_link}
                onChange={handleChange}
                placeholder='Emergency Drive Link'
              />
            </div>
          </div>

          <div
            className='task-dropdown-container'
            ref={dropdownRef}>
            <ButtonReveal
              type='button'
              whileTap={{ scale: 0.95 }}
              className={`task-toggle ${isDropdownOpen ? 'active' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <span>Pilih Template JSON</span>
              <div className='dropdown-trigger'>
                <FiChevronUp
                  className={`chevron ${isDropdownOpen ? 'open' : ''}`}
                />
              </div>
            </ButtonReveal>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  className='task-dropdown-menu'
                  variants={menuVariants}
                  initial='closed'
                  animate='open'
                  exit='closed'>
                  {[
                    { id: 'web', name: 'Web Dev' },
                    { id: 'analysis', name: 'Data Analysis' },
                    { id: 'data', name: 'Data Science' },
                    { id: 'design', name: 'UI/UX Design' },
                  ].map((opt) => (
                    <motion.div
                      key={opt.id}
                      variants={itemVariants}>
                      <ButtonReveal
                        type='button'
                        whileTap={{ scale: 0.85 }}
                        className='task-toggle'
                        onClick={() => handleTemplateSelect(opt.id)}>
                        {opt.name}
                      </ButtonReveal>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className='input-group'>
            <label>JSON Data Editor</label>
            <textarea
              name='details'
              value={formData.details}
              onChange={handleChange}
              className='json-textarea'
              placeholder='{"key": "value"}'
            />
          </div>
        </motion.div>

        <ButtonReveal
          as='button'
          type='submit'
          className='btn-save'
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}>
          {isEditing ? '💾 Update Changes' : '🚀 Publish Project'}
        </ButtonReveal>
      </form>

      {/* LIST TABLE SECTION */}
      <motion.div
        className='table-card'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <h3 className='section-title'>Stored Projects ({projects.length})</h3>
        <div className='table-wrapper'>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Year</th>
                <th className='actions'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td className='p-title'>{p.title}</td>
                  <td>{p.category?.join(', ')}</td>
                  <td>{p.year}</td>
                  <td className='actions'>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.1 }}
                      className='edit'
                      onClick={() => handleEdit(p)}>
                      Edit
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.1 }}
                      className='del'
                      onClick={() => handleDelete(p.id)}>
                      Hapus
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ManageProjects;
