import React, { useState, useRef } from 'react';
import { useScroll } from 'framer-motion';
import emailjs from '@emailjs/browser'; // <--- IMPORT EMAILJS
import PageTransition from './PageTransition';
import DateBubble from '../components/DateBubble/DateBubble';
import ContactForm from '../components/SectionPage/contact/ContactForm.jsx';
import useResponsiveBubble from '../components/DateBubble/UseResponsiveBubble';
import Footer from '../components/hero/footer/Footer';
import './pages.scss';

export default function ContactPage() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const { position, motionConfig } = useResponsiveBubble('contact');

  // --- Logika Form ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [formState, setFormState] = useState('idle');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid.';
    }
    if (!formData.message) newErrors.message = 'Message is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // FUNGSI SUBMIT DENGAN EMAILJS ===============================
  // ==================================================================
  const handleSubmit = () => {
    if (formState !== 'idle' || !validateForm()) return;

    setFormState('loading');

    // Kredensial EmailJS
    const SERVICE_ID = 'service_nfztccn';
    const TEMPLATE_ID = 'template_lu5ui7o';
    const PUBLIC_KEY = 'kfDaQJZ6MvJ9qJPxs';

    // Objek formData sudah sesuai dengan yang dibutuhkan template
    const templateParams = formData;

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY).then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
        setFormState('success');
        setFormData({ name: '', email: '', organization: '', message: '' });
        setTimeout(() => setFormState('idle'), 4000);
      },
      (err) => {
        console.error('FAILED...', err);
        setFormState('error');
        setTimeout(() => setFormState('idle'), 4000);
      }
    );
  };

  const { isMobile } = useResponsiveBubble('contact');

  const contactPageStages = [
    {
      range: [0, 0.4],
      text: 'Let’s Talk',
      hoverText: 'date',
      baseBg: '',
      bg: 'rgba(76, 52, 103, 0.7)',
      onClick: () => console.log('Let’s Talk clicked'),
    },
    {
      range: [0.4, 0.7],
      text: 'Get in Touch',
      hoverText: '',
      baseBg: '',
      bg: 'rgba(32,42,68,0.6)',
      color: '#eee',
      onClick: () => console.log('Get in Touch clicked'),
    },
    {
      range: [0.7, 0.8],
      text: 'Tap to top',
      hoverText: 'Tap!',
      baseBg: '#ff4d4d',
      bg: '#002f45',
      color: '#fff',
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
    {
      range: [0.8, 1], // Tahap akhir menjadi tombol submit
      text:
        formState === 'idle'
          ? 'Submit Form'
          : formState === 'loading'
          ? 'Sending...'
          : formState === 'success'
          ? 'Sent!'
          : 'Failed!',
      baseBg:
        formState === 'success'
          ? 'rgba(40, 167, 69, 0.8)'
          : formState === 'error'
          ? 'rgba(220, 53, 69, 0.8)'
          : '#002f45',
      color:
        formState === 'success' || formState === 'error' ? '#fff' : 'cadetblue',
      bg: '#15018833',

      onClick: handleSubmit, // Menghubungkan aksi klik dengan fungsi submit
    },
  ];

  return (
    <PageTransition label='Contact'>
      <div
        className='pageWrapper'
        ref={ref}>
        <DateBubble
          mode='custom'
          scrollYProgress={scrollYProgress}
          position={position}
          motionConfig={motionConfig}
          customStages={contactPageStages}
          backgroundColor='rgba(219, 19, 19, 0.7)'
        />

        <ContactForm
          formData={formData}
          errors={errors}
          formState={formState}
          handleChange={handleChange}
          isMobile={isMobile}
        />

        <div style={{ width: '100vw' }}>
          <Footer />
        </div>
      </div>
    </PageTransition>
  );
}
