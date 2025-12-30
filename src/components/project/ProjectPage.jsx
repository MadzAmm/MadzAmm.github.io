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

// ... (Bagian DetailItem, LinkItem, ProjectSpecifics, SnakeCursor, ContentParallaxImage, Variants tetap SAMA seperti sebelumnya) ...

// SAYA PERSINGKAT KODE ATASNYA AGAR FOKUS KE PERUBAHAN UTAMA
// (Pastikan Anda tetap menggunakan kode helper/component di atas yang sudah ada)

const DetailItem = ({ label, value }) => {
  if (!value) return null;
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
          <div className='palette-wrapper'>
            {value.map((color, i) => (
              <div
                key={i}
                title={color}
                className='color-circle'
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        ) : Array.isArray(value) ? (
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
const ProjectSpecifics = ({ project }) => {
  const { details, repoLink, notionLink, externalLink, emergencyLink } =
    project;
  const safeDetails = details || {};
  const detailEntries = Object.entries(safeDetails);
  const formatLabel = (key) =>
    key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace('_', ' ');
  return (
    <div className='specs-grid'>
      {detailEntries.length > 0 ? (
        detailEntries.map(([key, value]) => (
          <DetailItem
            key={key}
            label={formatLabel(key)}
            value={value}
          />
        ))
      ) : (
        <div style={{ opacity: 0.5, fontSize: '0.8rem' }}>
          No specs details.
        </div>
      )}
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
    const springX = useSpring(mouseX, {
      ...SPRING_CONFIG,
      damping: SPRING_CONFIG.damping + i * 4,
    });
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
const openVariants = {
  open: { transition: { staggerChildren: 0.1 } },
  closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};
const itemVariants = {
  open: { y: 0, opacity: 1 },
  closed: { y: 200, opacity: 0 },
};
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

  // STATE BARU: Untuk expand/collapse deskripsi ala Instagram di Mobile
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        const id = parseInt(projectId);
        if (isNaN(id)) return;
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

  if (loading || !project || !nextProject) {
    return (
      <div className='skeleton-loading-container'>
        <section className='project-intro'>
          <div className='sk-item sk-title' />
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
        <div className='sk-item sk-hero-image' />
      </div>
    );
  }

  // LOGIC POTONG TEXT
  const mobileDescription = isMobileExpanded
    ? project.descriptionBody
    : project.descriptionBody?.slice(0, 90) + '...';

  // LOGIC TOGGLE EXPAND
  const toggleExpand = () => {
    // Jika sedang expanded, klik akan menutupnya. Jika belum, klik akan membukanya.
    setIsMobileExpanded(!isMobileExpanded);
  };

  return (
    <motion.div
      key={project.id}
      className='page-container'
      variants={openVariants}
      initial='closed'
      animate='open'
      exit='closed'
      transition={{ duration: 0.5 }}>
      <SnakeCursor />

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

      <motion.section
        className='parallax-section2'
        ref={fullParallaxRef}
        variants={itemVariants}>
        <div className='parallax-image-wrapper2'>
          <motion.img
            src={project.heroImage}
            alt={project.title}
            style={{ y: fullParallaxY, scale: 1.15 }}
            draggable='false'
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      </motion.section>

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
            <div className='footer-partner'>
              <span>Sapere aude</span>
            </div>
          </footer>
        </div>
      </section>

      <div className='stacked-sections-container'>
        <section
          className='typography-section-rework'
          ref={typographyRef}>
          {/* KOLOM KIRI (TEXT) -> AKAN JADI BAWAH DI MOBILE */}
          <div className='typography-text-content2'>
            {/* DESKTOP ONLY */}
            <motion.h2
              className='typography-heading desktop-only'
              style={{ y: headingY }}
              dangerouslySetInnerHTML={{ __html: project.descriptionTitle }}
            />
            <motion.div
              className='project-specifics-container desktop-only'
              style={{ y: paragraphY }}>
              <ProjectSpecifics project={project} />
            </motion.div>
            <motion.p
              className='typography-paragraph desktop-only'
              style={{ y: paragraphY }}>
              {project.descriptionBody}
            </motion.p>

            {/* LIKE BUTTON (Action Bar) */}
            <motion.div
              className='like-button-wrapper'
              style={{ y: paragraphY, marginTop: '4rem' }}>
              <LikeButton
                projectId={project.id}
                projectData={project}
              />
            </motion.div>

            {/* --- MOBILE INSTAGRAM CAPTION --- */}
            <div
              className='mobile-ig-caption'
              onClick={toggleExpand} // ✅ Klik dimanapun di area caption untuk toggle
              style={{ cursor: 'pointer' }}>
              <span className='ig-username'>{project.title}</span>
              <span className='ig-text'>&nbsp;{mobileDescription}</span>
              {!isMobileExpanded && <span className='ig-more'>&nbsp;more</span>}
            </div>
            {/* ---------------------------------- */}
          </div>

          {/* KOLOM KANAN (IMAGE) -> AKAN JADI ATAS DI MOBILE */}
          <div className='typography-image-container2'>
            <div className='typography-parallax-image2'>
              <motion.img
                src={project.detailImage2}
                alt='Mood'
                style={{ y: typographyImageY }}
                draggable='false'
              />
            </div>
          </div>
        </section>

        <section className='next-project-section'>
          <motion.div
            className='next-project-link'
            onClick={() => navigate(`/project/${nextProject.id}`)}
            style={{ cursor: 'pointer' }}
            initial='rest'
            whileHover='hover'
            animate='rest'>
            <div className='next-project-content'>
              <span>Next Project</span>
              <motion.h2 variants={titleVariants}>
                {nextProject.title}
              </motion.h2>
              <div className='card-animation-wrapper'>
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
