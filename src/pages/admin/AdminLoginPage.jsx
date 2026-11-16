import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, supabaseEnvMissing } from '../../lib/supabase.js';
import { ADMIN_STATUS, getAdminAllowList, resolveAdminStatus } from '../../lib/authGuard.js';
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
  // Menahan form sampai pengecekan sesi selesai supaya tidak berkedip
  // "form login" lalu langsung pindah ke dashboard.
  const [checking, setChecking] = useState(!supabaseEnvMissing);
  const navigate = useNavigate();

  useEffect(() => {
    if (supabaseEnvMissing) return undefined
    let mounted = true
    const allowList = getAdminAllowList()

    const redirectIfAuthed = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return
        if (resolveAdminStatus(session, allowList) === ADMIN_STATUS.authed) {
          navigate('/admin/dashboard', { replace: true })
        }
      } catch {
        // abaikan: tetap di halaman login
      } finally {
        if (mounted) setChecking(false)
      }
    };

    redirectIfAuthed()

    // Pengaman: bila sesi berubah (mis. logout di tab lain), form login harus
    // tetap tampil dan tidak mengarahkan balik ke dashboard.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return
      if (event === 'SIGNED_OUT' || !session) setChecking(false)
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (supabaseEnvMissing) {
      setError('Konfigurasi server belum lengkap. Hubungi pengelola website.');
      return;
    }
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
        console.error('Login gagal, status:', error.status || '-');
        setError(friendlyLoginError(error.message));
        setLoading(false);
      } else {
        setLoading(false);
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Login gagal: gangguan jaringan atau tak terduga.', err?.name || '');
      setError(friendlyLoginError(err?.message || ''));
      setLoading(false);
    }
  };

  if (checking) {
    return <div className="admin-login-page admin-login-page--checking">Memeriksa sesi...</div>;
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h2>Masuk Panel Admin</h2>
          <p>Banyu Frozen Food</p>
        </div>

        {supabaseEnvMissing && (
          <div className="admin-alert admin-alert-error" role="alert">
            Konfigurasi Supabase belum diisi. Panel admin tidak dapat digunakan sampai
            VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY tersedia.
          </div>
        )}

        {error && <div className="admin-alert admin-alert-error" role="alert">{error}</div>}

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
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
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn-admin-login" disabled={loading}>
            {loading ? 'Sedang masuk...' : 'Masuk'}
          </button>
        </form>
        <div className="admin-login-footer">
          <p>Kembali ke <a href="/">Beranda Website</a></p>
        </div>
      </div>
    </div>
  );
}
