import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimateInteractiveText } from '../../AnimatedText/AnimateInteractiveText ';
import './ContactForm.scss';

const variants = {
  open: { transition: { staggerChildren: 0.1 } },
  closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};
const itemVariants = {
  open: { y: 0, opacity: 1 },
  closed: { y: 200, opacity: 0 },
};
// --- DATA & KONFIGURASI (statis) ---
const formFields = [
  {
    name: 'name',
    label: 'Your Name',
    type: 'text',
    placeholder: 'Anna *',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Anna10@example.com *',
  },
  {
    name: 'organization',
    label: 'Organization / Company',
    type: 'text',
    placeholder: 'Anna Inc. *',
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    placeholder: 'Brief description of your project or question... *',
  },
];

const contactDetails = {
  email: 'yahdien04@gmail.com',
  phone: '+62 896 6434 8459',
};
const businessDetails = {
  name: 'Muhammad',
  coc: '',
  vat: '',
  location: 'Location: Jakarta Selatan',
};
const socialLinks = [
  { name: 'Instagram', url: 'https://www.instagram.com/muhafasy' },
  { name: 'Github', url: 'https://github.com/MadzAmm/' },
  { name: 'Threads', url: 'https://www.threads.com/@muhafasy' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/madz-am-664983394' },
];

// --- KOMPONEN KECIL ---
const FormField = ({
  number,
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  error,
}) => (
  <div style={styles.fieldContainer}>
    <span style={styles.fieldNumber}>{number}</span>
    <div style={styles.fieldInputWrapper}>
      <label
        htmlFor={name}
        style={styles.fieldLabel}>
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ ...styles.input, ...styles.textarea }}
          rows='2'
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={styles.input}
        />
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            style={styles.errorMessage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  </div>
);

const NotificationArea = ({ formState }) => {
  let message = '';
  if (formState === 'success')
    message = 'Message sent successfully! We will get back to you soon.';
  if (formState === 'error')
    message = 'Something went wrong. Please try again later.';
  return (
    <div style={styles.notificationContainer}>
      <AnimatePresence>
        {(formState === 'success' || formState === 'error') && (
          <AnimateInteractiveText
            initialColor={formState === 'success' ? '#86d799ff' : '#dc3545'}
            as='motion.p'
            style={{
              ...styles.notificationText,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}>
            {message}
          </AnimateInteractiveText>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- KOMPONEN UTAMA (Tampilan Murni) ---
const ContactForm = ({
  formData,
  errors,
  formState,
  handleChange,
  isMobile,
}) => {
  // Tentukan style secara dinamis berdasarkan prop isMobile
  const mainContentStyle = isMobile
    ? styles.mainContentMobile // Gunakan style khusus mobile
    : styles.mainContentDesktop; // Gunakan style khusus desktop

  return (
    <motion.div
      variants={variants}
      initial='closed'
      animate='open'
      className='pageContainer'
      style={styles.pageContainer}>
      <motion.header
        variants={itemVariants}
        className='header'
        style={styles.header}>
        <h1 style={styles.title}>
          Let’s Bring <br />
          Your Ideas to Life.
        </h1>
      </motion.header>

      {/* Terapkan style yang sudah ditentukan di sini */}
      <motion.main
        variants={itemVariants}
        style={mainContentStyle}>
        <aside style={styles.sidebar}>
          <div
            className='sidebarContent'
            style={styles.sidebarContent}>
            <div style={styles.sidebarImage}></div>
            <div style={styles.sidebarContact}>
              <p style={styles.sidebarTitle}>CONTACT DETAILS</p>
              <motion.a
                whileHover={{ color: 'cadetblue', scale: 1.1 }}
                whileTap={{ scale: 0.85 }}
                href={`mailto:${contactDetails.email}`}
                style={styles.sidebarLink}>
                {contactDetails.email}
              </motion.a>
              <motion.a
                whileHover={{ color: 'cadetblue', scale: 1.1 }}
                whileTap={{ scale: 0.85 }}
                href={`tel:${contactDetails.phone.replace(/\s/g, '')}`}
                style={styles.sidebarLink}>
                {contactDetails.phone}
              </motion.a>
            </div>
            <div>
              <p style={styles.sidebarTitle}>BUSINESS DETAILS</p>
              <p style={styles.sidebarText}>{businessDetails.name}</p>
              <p style={styles.sidebarText}>{businessDetails.coc}</p>
              <p style={styles.sidebarText}>{businessDetails.vat}</p>
              <p style={styles.sidebarText}>{businessDetails.location}</p>
            </div>
            <div style={styles.sidebarLink}>
              <p style={styles.sidebarTitle}>SOCIALS</p>
              {socialLinks.map((link) => (
                <motion.a
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    color: 'cadetblue',
                  }}
                  whileTap={{ scale: 0.85 }}
                  key={link.name}
                  href={link.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={styles.sidebarLink}>
                  {link.name}
                </motion.a>
              ))}
            </div>
          </div>
        </aside>
        <div style={styles.formFieldsContainer}>
          {formFields.map((field, index) => (
            <FormField
              key={field.name}
              number={`0${index + 1}`}
              label={field.label}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              error={errors[field.name]}
            />
          ))}
        </div>
      </motion.main>
      <footer style={styles.footer}>
        <NotificationArea formState={formState} />
      </footer>
    </motion.div>
  );
};

// --- STYLING ---
const styles = {
  pageContainer: {
    // backgroundColor: '#1c1c1f',
    color: '#FFFFFF',
    padding: 'clamp(2rem, 5vw, 4rem)',
    fontFamily: 'system-ui, sans-serif',
    minHeight: '100vh',
    width: '100vw',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    margin: '5rem 0 4rem 3rem',
  },

  footer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: '1.3px solid rgba(255, 255, 255, 0.2)',
    height: '15vh',
    paddingTop: '2.5rem',
    marginBottom: '1rem',
  },
  title: {
    fontSize: 'clamp(2.5rem, 8vw, 4rem)',
    margin: 0,
    lineHeight: 1.1,
    fontWeight: 500,
  },

  // ================== PERUBAHAN UTAMA DI SINI ==================
  // Style untuk Desktop (Grid)
  mainContentDesktop: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '5rem',
  },
  // Style untuk Mobile (Flex dengan urutan terbalik)
  mainContentMobile: {
    display: 'flex',
    flexDirection: 'column-reverse', // Ini akan memindahkan elemen kedua (aside) ke atas
    gap: '4rem',
  },
  // =============================================================

  formFieldsContainer: {},
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
    paddingTop: '0.5rem',
    alignItems: 'center',
  },
  sidebarContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    backgroundColor: '#252529ff',
    padding: '35px 60px 35px 60px',
    borderRadius: '30px',
  },

  sidebarImage: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundImage: 'url("m10.png")',
    WebkitTouchCallout: 'none', // <- Properti Kunci img untuk iOS
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: '-0.7rem',
  },

  sidebarContact: {
    display: 'flex',
    flexDirection: 'column',
  },

  fieldContainer: {
    display: 'flex',
    gap: '2rem',
    borderBottom: '1.3px solid rgba(255, 255, 255, 0.2)',
    padding: '2rem 0',
  },
  fieldNumber: { color: '#888', fontSize: '0.8rem', paddingTop: '0.5rem' },
  fieldInputWrapper: { flex: 1 },
  fieldLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '1.25rem',
    color: '#FFF',
  },
  input: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '1rem',
    width: '100%',
    padding: '0.5rem 0',
    outline: 'none',
  },
  textarea: { resize: 'none' },
  errorMessage: {
    color: '#ff4d4d',
    fontSize: '0.8rem',
    margin: '0.5rem 0 0 0',
  },
  sidebarTitle: {
    color: '#888',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '1rem',
  },
  sidebarLink: {
    color: '#FFF',
    textDecoration: 'none',
    display: 'flex',
    fontSize: '0.9rem',
    flexDirection: 'column',
    marginBottom: '0.5rem',
    transition: 'color 0.2s',
  },
  sidebarText: { color: '#FFF', margin: '0 0 0.5rem 0', fontSize: '0.9rem' },
  notificationContainer: { minHeight: '40px' },
  notificationText: { margin: 0, fontWeight: 'bold' },
};

export default ContactForm;
