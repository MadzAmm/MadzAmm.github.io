import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      // Jika sukses, simpan token sesi (opsional, supabase menghandle ini via localstorage)
      console.log('Login sukses:', data);
      navigate('/admin'); // Redirect ke dashboard
    } catch (error) {
      setErrorMsg(error.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fff7ed', // Sesuaikan tema
        fontFamily: 'sans-serif',
      }}>
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}>
        <h2
          style={{ margin: '0 0 20px 0', textAlign: 'center', color: '#333' }}>
          Admin Access
        </h2>

        {errorMsg && (
          <div
            style={{
              background: '#ffe6e6',
              color: '#d63031',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '0.9rem',
            }}>
            {errorMsg}
          </div>
        )}

        <input
          type='email'
          placeholder='Admin Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '1rem',
          }}
        />

        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '1rem',
          }}
        />

        <button
          type='submit'
          disabled={loading}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            background: '#000',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}>
          {loading ? 'Checking...' : 'Enter Dashboard'}
        </button>
      </motion.form>
    </div>
  );
};

export default LoginPage;
