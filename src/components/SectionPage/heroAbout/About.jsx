// import React, { useRef } from 'react';
// import { motion, useScroll, useTransform } from 'framer-motion';
// import './About.scss';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// const openVariants = {
//   open: { transition: { staggerChildren: 0.1 } },
//   closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
// };
// const itemVariants = {
//   open: { y: 0, opacity: 1 },
//   closed: { y: 200, opacity: 0 },
// };

// // Komponen Utama Halaman Tentang Saya =====================
// // ===================================================================
// const About = () => {
//   // Logic untuk .parallax-section (Gambar Penuh)
//   const fullParallaxRef = useRef(null);
//   const { scrollYProgress: fullParallaxScroll } = useScroll({
//     target: fullParallaxRef,
//     offset: ['start end', 'end start'],
//   });
//   const fullParallaxY = useTransform(
//     fullParallaxScroll,
//     [0, 1],
//     ['-15%', '15%']
//   );

//   // Logic untuk .typography-section-reworked
//   const typographyRef = useRef(null);
//   const { scrollYProgress: typographyScroll } = useScroll({
//     target: typographyRef,
//     offset: ['start end', 'end start'],
//   });
//   const headingY = useTransform(typographyScroll, [0.2, 1], ['0%', '-100%']);
//   const paragraphY = useTransform(typographyScroll, [0.2, 1], ['0%', '-60%']);
//   const typographyImageY = useTransform(
//     typographyScroll,
//     [0, 1],
//     ['-20%', '20%']
//   );
//   // --- Akhir logic parallax ---

//   return (
//     <motion.div
//       className='page-container about-page-container'
//       variants={openVariants}
//       initial='closed'
//       animate='open'>
//       {/* Bagian 1: Header (Replikasi .project-intro) */}
//       <motion.section
//         className='project-intro about-intro'
//         variants={itemVariants}>
//         <h1 className='project-title'>About Me</h1>
//         <div className='project-meta'>
//           <div>
//             <span>ROLE / FOCUS</span>
//             <p>Designer | Data Analyst</p>
//           </div>
//           <div>
//             <span>BACKGROUND</span>
//             <p>Aqidah & Islamic Philosophy</p>
//           </div>
//           <div>
//             <span>LOCATION</span>
//             <p>Jakarta, Indonesia</p>
//           </div>
//         </div>
//       </motion.section>

//       {/* Bagian 2: Gambar Parallax Penuh (Replikasi .parallax-section) */}
//       <motion.section
//         variants={itemVariants}
//         ref={fullParallaxRef}
//         className='parallax-section'>
//         <div className='parallax-image-wrapper'>
//           <motion.img
//             src='/kampus.avif' // <-- Ganti dengan gambar Anda
//             alt='Potret diri atau ruang kerja'
//             style={{ y: fullParallaxY, scale: 1.15 }}
//           />
//         </div>
//       </motion.section>

//       {/* BAGIAN BARU: SERVICES SECTION (di bawah gambar pertama) */}
//       {/* ========================================================= */}
//       <section className='services-section'>
//         {/* <div className='services-header'>
//           <h2 className='section-title'>I can help you with ...</h2>
//         </div> */}
//         <div className='services-grid'>
//           <div className='service-item'>
//             <span className='service-number'>01</span>
//             <h3 className='service-name'>Design</h3>
//             <p className='service-description'>
//               Designing with purpose. I combine a thoughtful approach with
//               creative execution to produce visuals that are not only beautiful
//               but meaningful.
//             </p>
//             {/* Tambahkan ikon di sini jika ada */}
//           </div>
//           <div className='service-item'>
//             <span className='service-number'>02</span>
//             <h3 className='service-name'>Development</h3>
//             <p className='service-description'>
//               Turning logic into live sites, Eager learner and problem solver.
//               Continuously mastering new technologies to contribute effective,
//               up-to-date code to dynamic projects.
//             </p>
//             {/* Tambahkan ikon di sini jika ada */}
//           </div>
//           <div className='service-item'>
//             <span className='service-number'>03</span>
//             <h3 className='service-name'>Analysis</h3>
//             <p className='service-description'>
//               Turning data into clarity. Proficient in Python, Data
//               Visualization, and Statistical Analysis to drive smart
//               decision-making.
//             </p>
//             {/* Tambahkan ikon di sini jika ada */}

//             {/* Contoh SVG icon */}
//           </div>
//         </div>
//       </section>

//       {/* Bagian 3: Tipografi (Gambar di kiri, Teks di kanan, dengan Lottie) */}
//       {/* ========================================================= */}
//       <section
//         className='typography-section-reworked'
//         ref={typographyRef}>
//         {/* Gambar Tipografi  */}
//         <div className='typography-image-container'>
//           <div className='typography-parallax-image'>
//             <motion.img
//               src='/mjas.avif'
//               alt='Detail pekerjaan atau hobi'
//               style={{ y: typographyImageY }}
//             />
//           </div>
//         </div>

//         {/* Konten Teks Tipografi */}
//         <div className='typography-text-content'>
//           <div
//             className='lottie-globe-wrapper'
//             style={{ y: headingY }}>
//             <DotLottieReact
//               src='/starGlobe.json'
//               loop
//               autoplay
//             />
//           </div>

//           <motion.h2
//             className='typography-heading'
//             style={{ y: headingY }}
//             dangerouslySetInnerHTML={{
//               __html: 'My Philosophy:<br />Code & Clarity',
//             }}
//           />
//           <motion.p
//             className='typography-paragraph'
//             style={{ y: paragraphY }}>
//             My background in philosophy teaches me to dissect complex problems
//             and find logical, ethical, and structured solutions. I approach
//             every project by asking the 'right' questions to build interfaces
//             that are not only beautiful but also intuitive and meaningful.
//           </motion.p>
//         </div>
//       </section>
//     </motion.div>
//   );
// };

// export default About;
//
//
//
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './About.scss';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// 1. CONFIG VARIANTS (NAIK HALUS TANPA PANTULAN)
// 1. CONFIG VARIANTS (VERSI CEPAT & RESPONSIF)
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      // Jeda antar item dipercepat (sebelumnya 0.15)
      // 0.07 artinya item muncul beruntun dengan cepat
      staggerChildren: 0.07,

      // Waktu tunggu awal dikurangi (sebelumnya 0.2)
      // 0.1 artinya hampir instan langsung mulai saat halaman dimuat
      delayChildren: -0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    // Jarak tempuh dikurangi (60 -> 30) agar perjalanan lebih singkat & cepat
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      // Tetap smooth curve (Cubic Bezier), tapi...
      ease: [0.25, 0.1, 0.25, 1],
      // Durasinya dipangkas (sebelumnya 0.8 jadi 0.5)
      duration: 0.5,
    },
  },
};
const About = () => {
  // --- Logic Parallax (Tetap Sama) ---
  const fullParallaxRef = useRef(null);
  const { scrollYProgress: fullParallaxScroll } = useScroll({
    target: fullParallaxRef,
    offset: ['start end', 'end start'],
  });
  const fullParallaxY = useTransform(
    fullParallaxScroll,
    [0, 1],
    ['-15%', '15%']
  );

  const typographyRef = useRef(null);
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
  // -----------------------------------

  return (
    <motion.div
      className='page-container about-page-container'
      // Hubungkan variants container di sini
      variants={containerVariants}
      initial='hidden'
      animate='visible'>
      {/* Bagian 1: Header */}
      {/* Hapus variants pada section pembungkus agar stagger mengalir ke anak-anaknya */}
      <section className='project-intro about-intro'>
        {/* ITEM 1: TITLE */}
        <motion.h1
          className='project-title'
          variants={itemVariants}>
          About Me
        </motion.h1>

        <div className='project-meta'>
          {/* ITEM 2: ROLE */}
          <motion.div variants={itemVariants}>
            <span>ROLE / FOCUS</span>
            <p>Designer | Data Analyst</p>
          </motion.div>

          {/* ITEM 3: BACKGROUND */}
          <motion.div variants={itemVariants}>
            <span>BACKGROUND</span>
            <p>Aqidah & Islamic Philosophy</p>
          </motion.div>

          {/* ITEM 4: LOCATION */}
          <motion.div variants={itemVariants}>
            <span>LOCATION</span>
            <p>Jakarta, Indonesia</p>
          </motion.div>
        </div>
      </section>

      {/* ITEM 5: GAMBAR PARALLAX */}
      <motion.section
        variants={itemVariants} // Gambar akan muncul terakhir setelah text selesai
        ref={fullParallaxRef}
        className='parallax-section'>
        <div className='parallax-image-wrapper'>
          <motion.img
            src='/kampus.avif'
            alt='Potret diri atau ruang kerja'
            style={{ y: fullParallaxY, scale: 1.15 }}
          />
        </div>
      </motion.section>

      {/* --- BAGIAN DI BAWAHNYA TIDAK PERLU IKUT ANIMASI INTRO --- */}
      {/* Gunakan viewport={{ once: true }} agar animasi scroll trigger normal */}

      <motion.section
        className='services-section'
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}>
        <div className='services-grid'>
          {/* Service Items... (Isi tetap sama) */}
          <div className='service-item'>
            <span className='service-number'>01</span>
            <h3 className='service-name'>Design</h3>
            <p className='service-description'>
              Designing with purpose. I combine a thoughtful approach with
              creative execution to produce visuals that are not only beautiful
              but meaningful.
            </p>
          </div>
          <div className='service-item'>
            <span className='service-number'>02</span>
            <h3 className='service-name'>Development</h3>
            <p className='service-description'>
              Turning logic into live sites, Eager learner and problem solver.
              Continuously mastering new technologies.
            </p>
          </div>
          <div className='service-item'>
            <span className='service-number'>03</span>
            <h3 className='service-name'>Analysis</h3>
            <p className='service-description'>
              Turning data into clarity. Proficient in Python, Data
              Visualization, and Statistical Analysis.
            </p>
          </div>
        </div>
      </motion.section>

      <section
        className='typography-section-reworked'
        ref={typographyRef}>
        {/* ... Isi Typography Section tetap sama ... */}
        <div className='typography-image-container'>
          <div className='typography-parallax-image'>
            <motion.img
              src='/mjas.avif'
              alt='Detail pekerjaan atau hobi'
              style={{ y: typographyImageY }}
            />
          </div>
        </div>

        <div className='typography-text-content'>
          <div
            className='lottie-globe-wrapper'
            style={{ y: headingY }}>
            <DotLottieReact
              src='/starGlobe.json'
              loop
              autoplay
            />
          </div>

          <motion.h2
            className='typography-heading'
            style={{ y: headingY }}
            dangerouslySetInnerHTML={{
              __html: 'My Philosophy:<br />Code & Clarity',
            }}
          />
          <motion.p
            className='typography-paragraph'
            style={{ y: paragraphY }}>
            My background in philosophy teaches me to dissect complex problems
            and find logical, ethical, and structured solutions.
          </motion.p>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
