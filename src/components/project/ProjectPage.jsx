import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Magnetic from '../DateBubble/Magnetic';
import LikeButton from './LikeButton';
import './ProjectPage.scss';

// ===================================================================
// 1. KOMPONEN PROJECT SPECIFICS (DATA LOGIC SUDAH BENAR)
// ===================================================================
// ===================================================================
// GANTI KOMPONEN DetailItem YANG LAMA DENGAN INI
// ===================================================================
const DetailItem = ({ label, value }) => {
  // 1. Jika nilai kosong/null, jangan render apa-apa
  if (!value) return null;

  // 2. LOGIKA DETEKSI PALET WARNA
  // Kita cek apakah:
  // a) Nilainya adalah Array (kumpulan data)
  // b) DAN item pertama dalam array itu dimulai dengan tanda '#' (ciri khas kode warna hex)
  const isColorPalette =
    Array.isArray(value) &&
    typeof value[0] === 'string' &&
    value[0].startsWith('#');

  return (
    <div className='spec-item'>
      <span className='spec-label'>{label}</span>
      <span
        className='spec-value'
        style={{ width: '100%' }}>
        {isColorPalette ? (
          // --- INI WRAPPER PALET WARNA YANG ANDA MINTA ---
          <div className='palette-wrapper'>
            {value.map((color, i) => (
              <div
                key={i}
                title={color} // Munculkan kode warna saat di-hover
                className='color-circle'
                style={{
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
        ) : // --- AKHIR WRAPPER ---
        // Tampilan Normal (Jika bukan warna)
        // Jika array biasa (misal: Tools), gabung pakai koma. Jika string, tampilkan langsung.
        Array.isArray(value) ? (
          value.join(', ')
        ) : (
          value
        )}
      </span>
    </div>
  );
};

const LinkItem = ({ label, url, color = 'white' }) => {
  if (!url) return null;
  return (
    <div className='spec-item'>
      <span className='spec-label'>{label}</span>
      <a
        href={url}
        target='_blank'
        rel='noreferrer'
        style={{
          color: color,
          textDecoration: 'underline',
          textUnderlineOffset: '4px',
          cursor: 'pointer',
        }}>
        Open Link
      </a>
    </div>
  );
};

// ... import dan komponen DetailItem / LinkItem di atas tetap sama ...

const ProjectSpecifics = ({ project }) => {
  const { details, repoLink, notionLink, externalLink, emergencyLink } =
    project;

  // 1. Pastikan details adalah object, bukan null
  const safeDetails = details || {};

  // 2. Ambil semua key dan value dari JSON
  const detailEntries = Object.entries(safeDetails);

  // 3. Helper untuk merapikan nama Label (misal: "dataSource" -> "Data Source")
  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1') // Tambah spasi sebelum huruf besar
      .replace(/^./, (str) => str.toUpperCase()) // Huruf pertama kapital
      .replace('_', ' '); // Ganti underscore dengan spasi
  };

  return (
    <div className='specs-grid'>
      {/* 4. LOOPING OTOMATIS (Ini kuncinya agar data pasti muncul) */}
      {detailEntries.length > 0 ? (
        detailEntries.map(([key, value]) => (
          <DetailItem
            key={key}
            label={formatLabel(key)}
            value={value}
          />
        ))
      ) : (
        // Pesan jika JSON kosong (opsional, bisa dihapus)
        <div style={{ opacity: 0.5, fontSize: '0.8rem' }}>
          No specs details.
        </div>
      )}

      {/* 5. Link-link Project (Selalu Muncul) */}
      <LinkItem
        label='Repository'
        url={repoLink}
        color='#35428dff'
      />
      <LinkItem
        label='Documentation'
        url={notionLink}
        color='#35428dff'
      />
      <LinkItem
        label='Live Demo'
        url={externalLink}
        color='#35428dff'
      />

      {emergencyLink && (
        <LinkItem
          label='Emergency'
          url={emergencyLink}
          color='#35428dff'
        />
      )}
    </div>
  );
};

// ===================================================================
// 2. HELPER (CURSOR & PARALLAX)
// ===================================================================
const NUMBER_OF_DOTS = 10;
const SPRING_CONFIG = { stiffness: 400, damping: 25 };

const SnakeCursor = () => {
  const [cursorVariant, setCursorVariant] = useState('default');
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const handleMouseOver = (e) => {
      if (e.target.closest('a, .next-project-content, .spec-item a'))
        setCursorVariant('hover');
    };
    const handleMouseOut = (e) => {
      if (e.target.closest('a, .next-project-content, .spec-item a'))
        setCursorVariant('default');
    };
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [mouseX, mouseY]);

  const dots = Array.from({ length: NUMBER_OF_DOTS }).map((_, i) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const springX = useSpring(mouseX, {
      ...SPRING_CONFIG,
      damping: SPRING_CONFIG.damping + i * 4,
    });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const springY = useSpring(mouseY, {
      ...SPRING_CONFIG,
      damping: SPRING_CONFIG.damping + i * 4,
    });
    return { x: springX, y: springY };
  });

  return (
    <>
      {dots.map((dot, index) => (
        <motion.div
          key={index}
          className='snakeCursor'
          animate={cursorVariant}
          variants={{
            default: {
              scale: 1,
              backgroundColor: 'white',
              mixBlendMode: 'difference',
            },
            hover: {
              scale: 2,
              height: 50,
              width: 50,
              backgroundColor: '#0041c2',
              mixBlendMode: 'normal',
            },
          }}
          style={{
            x: dot.x,
            y: dot.y,
            scale: (NUMBER_OF_DOTS - index) / NUMBER_OF_DOTS,
            position: 'fixed',
            top: 0,
            left: 0,
            width: 25,
            height: 25,
            borderRadius: '50%',
            pointerEvents: 'none',
            translateX: '-50%',
            translateY: '-50%',
            zIndex: 9999,
            display: cursorVariant === 'hover' && index > 0 ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '8px',
          }}>
          {cursorVariant === 'hover' && index === 0 && (
            <Magnetic>
              <span className='cursor-text'>View</span>
            </Magnetic>
          )}
        </motion.div>
      ))}
    </>
  );
};

const ContentParallaxImage = ({ src, alt, speed = 0.1 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${speed * 100}%`, `${speed * 100}%`]
  );
  return (
    <div
      className='content-parallax-wrapper'
      ref={ref}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className='content-parallax-image'
        draggable='false'
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

// ===================================================================
// 3. VARIAN ANIMASI (DIKEMBALIKAN DARI KODE ASLI)
// ===================================================================

// Stagger Animation untuk Halaman Masuk
const openVariants = {
  open: { transition: { staggerChildren: 0.1 } },
  closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};
const itemVariants = {
  open: { y: 0, opacity: 1 },
  closed: { y: 200, opacity: 0 },
};

// Animasi Kartu Next Project (Wallet Effect)
const cardWalletVariants = {
  rest: {
    y: 120,
    scale: 0.95,
    transition: { type: 'tween', ease: 'easeOut', duration: 0.4 },
  },
  hover: {
    y: 40,
    scale: 1,
    transition: { type: 'spring', stiffness: 250, damping: 30 },
  },
};

const titleVariants = {
  rest: {
    opacity: 1,
    transition: { type: 'tween', ease: 'easeOut', duration: 0.4 },
  },
  hover: {
    opacity: 0.2,
    transition: { type: 'tween', ease: 'easeIn', duration: 0.3 },
  },
};

// ===================================================================
// 4. KOMPONEN UTAMA
// ===================================================================
const ProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [nextProject, setNextProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FETCHING DATA ---
  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        const id = parseInt(projectId);
        if (isNaN(id)) return;

        // 1. Current Project
        const { data: dbData, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !dbData) throw new Error('Project not found');

        const mappedProject = {
          id: dbData.id,
          title: dbData.title,
          category: dbData.category,
          year: dbData.year,
          place: dbData.place,
          company: dbData.company,
          heroImage: dbData.hero_image,
          detailImage1: dbData.detail_image_1,
          detailImage2: dbData.detail_image_2,
          imageUrl: dbData.image_url,
          tagline: dbData.tagline,
          descriptionTitle: dbData.description_title,
          descriptionBody: dbData.description_body,
          repoLink: dbData.repo_link,
          notionLink: dbData.notion_link,
          emergencyLink: dbData.emergency_link,
          externalLink: dbData.external_link,
          details: dbData.details,
        };

        // 2. Next Project
        let { data: nextDbData } = await supabase
          .from('projects')
          .select('id, title, image_url')
          .gt('id', id)
          .order('id', { ascending: true })
          .limit(1)
          .single();

        if (!nextDbData) {
          const { data: firstData } = await supabase
            .from('projects')
            .select('id, title, image_url')
            .order('id', { ascending: true })
            .limit(1)
            .single();
          nextDbData = firstData;
        }

        const mappedNextProject = nextDbData
          ? {
              id: nextDbData.id,
              title: nextDbData.title,
              imageUrl: nextDbData.image_url,
            }
          : null;

        setProject(mappedProject);
        setNextProject(mappedNextProject);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [projectId]);

  // --- ANIMASI SCROLL ---
  const typographyRef = useRef(null);
  const fullParallaxRef = useRef(null);
  const { scrollYProgress: typographyScroll } = useScroll({
    target: typographyRef,
    offset: ['start end', 'end start'],
  });
  const headingY = useTransform(typographyScroll, [0.2, 1], ['0%', '-100%']);
  const paragraphY = useTransform(typographyScroll, [0.2, 1], ['0%', '-60%']);
  const typographyImageY = useTransform(
    typographyScroll,
    [0, 1],
    ['-20%', '20%']
  );
  const { scrollYProgress: fullScroll } = useScroll({
    target: fullParallaxRef,
    offset: ['start end', 'end start'],
  });
  const fullParallaxY = useTransform(fullScroll, [0, 1], ['-15%', '15%']);

  // --- PREMIUM SKELETON LOADER ---
  if (loading || !project || !nextProject) {
    return (
      <div className='skeleton-loading-container'>
        {/* 1. Bagian Intro (Title & Meta) */}
        <section className='project-intro'>
          {/* Title Besar Placeholder */}
          <div className='sk-item sk-title' />

          {/* Grid Meta Data (3 Kolom Fake) */}
          <div className='sk-meta-grid'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='sk-meta-col'>
                <div className='sk-item sk-label' />
                <div className='sk-item sk-value' />
              </div>
            ))}
          </div>
        </section>

        {/* 2. Bagian Hero Image Placeholder */}
        <div className='sk-item sk-hero-image' />
      </div>
    );
  }

  return (
    <motion.div
      key={project.id}
      className='page-container'
      variants={openVariants} // ✅ Animasi Stagger Dikembalikan
      initial='closed'
      animate='open'
      exit='closed'
      transition={{ duration: 0.5 }}>
      <SnakeCursor />

      {/* 1. Header (Pakai itemVariants untuk stagger) */}
      <motion.section
        className='project-intro'
        variants={itemVariants}>
        <motion.h1 className='project-title'>{project.title}</motion.h1>
        <motion.div className='project-meta'>
          <div>
            <span>SERVICES</span>
            <p>{project.category?.join(' & ')}</p>
          </div>
          <div>
            <span>CREDITS</span>
            <p>Owned By: {project.company}</p>
          </div>
          <div>
            <span>LOCATION / YEAR</span>
            <p>
              {project.place} © {project.year}
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* 2. Hero Image */}
      <motion.section
        className='parallax-section'
        ref={fullParallaxRef}
        variants={itemVariants}>
        <div className='parallax-image-wrapper'>
          <motion.img
            src={project.heroImage}
            alt={project.title}
            style={{ y: fullParallaxY, scale: 1.15 }}
            draggable='false'
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      </motion.section>

      {/* 3. Showcase Frame */}
      <section className='content-showcase-section'>
        <div className='showcase-frame'>
          <header className='frame-header'>
            <div className='frame-logo'>© PORTFOLIO</div>
            <div className='frame-nav'>
              <span>{project.category?.[0]?.toUpperCase()}</span>
              <span>{project.year}</span>
              <div className='frame-menu-icon'>
                <span></span>
                <span></span>
              </div>
            </div>
          </header>
          <div className='frame-content'>
            <ContentParallaxImage
              src={project.detailImage1}
              alt='Detail'
            />
          </div>
          <footer className='frame-footer'>
            <h3
              className='footer-title'
              dangerouslySetInnerHTML={{
                __html: project.tagline?.toUpperCase(),
              }}
            />
            {/* ✅ Teks Sapere Aude Dikembalikan */}
            <div className='footer-partner'>
              <span>Sapere aude</span>
            </div>
          </footer>
        </div>
      </section>

      {/* 4. Typography & Details */}
      <div className='stacked-sections-container'>
        <section
          className='typography-section-reworked'
          ref={typographyRef}>
          <div className='typography-text-content'>
            <motion.h2
              className='typography-heading'
              style={{ y: headingY }}
              dangerouslySetInnerHTML={{ __html: project.descriptionTitle }}
            />
            <motion.div
              className='project-specifics-container'
              style={{ y: paragraphY }}>
              <ProjectSpecifics project={project} />
            </motion.div>
            <motion.p
              className='typography-paragraph'
              style={{ y: paragraphY }}>
              {project.descriptionBody}
            </motion.p>

            {/* {project.emergencyLink && (
              <motion.div style={{ y: paragraphY, marginTop: '20px' }}>
                <a
                  href={project.emergencyLink}
                  target='_blank'
                  rel='noreferrer'
                  style={{
                    color: '#ff5555',
                    fontSize: '0.9rem',
                    textDecoration: 'underline',
                  }}>
                  Download Emergency Backup
                </a>
              </motion.div>
            )} */}

            <motion.div style={{ y: paragraphY, marginTop: '3rem' }}>
              <LikeButton projectId={project.id} />
            </motion.div>
          </div>

          <div className='typography-image-container'>
            <div className='typography-parallax-image'>
              <motion.img
                src={project.detailImage2}
                alt='Mood'
                style={{ y: typographyImageY }}
                draggable='false'
              />
            </div>
          </div>
        </section>

        {/* 5. Next Project (Animasi Card Dikembalikan) */}
        <section className='next-project-section'>
          <motion.div
            className='next-project-link'
            onClick={() => navigate(`/project/${nextProject.id}`)}
            style={{ cursor: 'pointer' }}
            initial='rest'
            whileHover='hover' // ✅ Trigger animasi saat hover
            animate='rest'>
            <div className='next-project-content'>
              <span>Next Project</span>
              <motion.h2 variants={titleVariants}>
                {nextProject.title}
              </motion.h2>
              <div className='card-animation-wrapper'>
                {/* ✅ Animasi Dompet (Card Wallet) */}
                <motion.div
                  className='next-project-card-frame'
                  variants={cardWalletVariants}>
                  <div className='card-frame-content'>
                    <img
                      src={nextProject.imageUrl}
                      alt='Next'
                      draggable='false'
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
};

export default ProjectPage;
