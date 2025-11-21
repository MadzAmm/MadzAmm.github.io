import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const Velocity = () => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const [direction, setDirection] = useState(1);
  const prevY = useRef(0);

  // Mendeteksi arah scroll (atas atau bawah)
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const delta = latest - prevY.current;
    // perlu tahu arahnya, bukan seberapa cepat
    if (delta !== 0) {
      setDirection(delta > 0 ? 1 : -1);
    }
    prevY.current = latest;
  });

  const [imageX, setImageX] = useState(0);
  const [textX, setTextX] = useState(0);

  // Konfigurasi kecepatan dan lebar loop
  const imageSpeed = 1;
  const textSpeed = 1;
  const imageLoopWidth = 5 * (300 + 24); // 5 gambar × (lebar 300px + celah 24px) = 1620
  const textLoopWidth = 9000; // Asumsi lebar untuk satu blok teks

  // Menggandakan array gambar untuk loop yang mulus. Cukup 2x.
  const imageUrls = ['pbak.jpg', 'fil.png', 'best.jpg', 'audit.png', 'kkn.jpg'];
  const duplicatedImages = [...imageUrls, ...imageUrls];

  useEffect(() => {
    let frame;

    const update = () => {
      // Logika update untuk gambar
      setImageX((prev) => {
        // Hitung posisi baru
        let newX = prev + direction * imageSpeed;

        // Cek kondisi reset untuk loop tak berujung
        // Jika bergerak ke kanan (scroll ke bawah) dan sudah melewati titik awal
        if (newX > 0) {
          newX -= imageLoopWidth;
        }
        // Jika bergerak ke kiri (scroll ke atas) dan set pertama sudah lewat
        else if (newX < -imageLoopWidth) {
          newX += imageLoopWidth;
        }
        return newX;
      });

      // Logika update untuk teks (arah berlawanan)
      setTextX((prev) => {
        // Hitung posisi baru
        let newX = prev - direction * textSpeed;

        // Cek kondisi reset untuk loop tak berujung
        // Jika bergerak ke kanan (scroll ke atas) dan sudah melewati titik awal
        if (newX > 0) {
          newX -= textLoopWidth;
        }
        // Jika bergerak ke kiri (scroll ke bawah) dan set pertama sudah lewat
        else if (newX < -textLoopWidth) {
          newX += textLoopWidth;
        }
        return newX;
      });

      frame = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(frame);
    // Tambahkan dependensi agar useEffect berjalan sesuai
  }, [direction, imageLoopWidth, textLoopWidth]);

  return (
    <div
      ref={ref}
      style={{
        height: '0vh',

        background: 'rgba(255, 255, 255, 0)',
        // overflow: 'hidden', // Penting untuk menyembunyikan konten duplikat
        // position: 'relative',
      }}>
      {/* Gambar
      <div style={{ overflow: 'hidden', padding: '0 0' }}>
        <motion.div
          style={{
            display: 'flex',
            gap: '10px', // gap diperbesar agar bingkai tidak saling berhimpit
            x: imageX,
            width: 'max-content',
          }}>
          {duplicatedImages.map((url, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              // transition={{ type: 'spring', stiffness: 300, damping: 50 }}
              style={{
                width: '300px',
                height: '200px',
                border: '5px solid #002f45', // bingkai gambar,
                overflow: 'hidden',
                flexShrink: 0,
              }}>
              <img
                src={url}
                alt={`Project ${i + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div> */}

      <div
        style={{
          // overflow: 'hidden',
          whiteSpace: 'nowrap',
          background: 'tranparent', // background warna teks
        }}>
        <motion.div
          style={{
            x: textX,
            display: 'inline-flex',
            fontSize: '3rem',
            fontWeight: '300',
            color: '#ffffffff',
          }}>
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              style={{ display: 'inline-flex' }}>
              {[...Array(8)].map((_, j) => (
                <span
                  key={j}
                  style={{
                    textTransform: 'uppercase',
                    fontFamily: 'Champion-HTF-Bantamweight, sans-serif ',
                    fontSize: '5rem',
                    color: '#bfbebe13',
                    paddingRight: '100px',
                  }}>
                  The goal is not merely to find the 'right' answer, but more
                  importantly, to ask the 'right' questions.
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Velocity;
