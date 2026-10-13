import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase.js';
import './AdminLoginPage.css';

function friendlyLoginError(message) {
  if (/invalid login credentials/i.test(message)) return 'Email atau password salah.';
  if (/email not confirmed/i.test(message)) return 'Email belum dikonfirmasi. Silakan cek inbox email Anda.';
  if (/rate limit/i.test(message)) return 'Terlalu banyak percobaan masuk. Tunggu sebentar lagi.';
  if (/failed to fetch|network|fetch/i.test(message)) return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
  return 'Gagal masuk. Silakan coba lagi.';
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    let mounted = true
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted && session) {
          navigate('/admin/dashboard');
        }
      } catch {
        // abaikan: tetap di halaman login
      }
    };
    checkSession();
    return () => { mounted = false }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
      setError('Masukkan email yang valid.');
      return;
    }
    if (!password) {
      setError('Masukkan password.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        console.error('Login gagal:', error.message);
        setError(friendlyLoginError(error.message));
        setLoading(false);
      } else {
        setLoading(false);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Login gagal:', err);
      setError(friendlyLoginError(err?.message || ''));
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h2>Admin Login</h2>
          <p>Banyu Frozen Food</p>
        </div>
        
        {error && <div className="admin-alert admin-alert-error">{error}</div>}

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@banyu.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-admin-login" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="admin-login-footer">
          <p>Kembali ke <a href="/">Beranda Website</a></p>
        </div>
      </div>
    </div>
  );
}
