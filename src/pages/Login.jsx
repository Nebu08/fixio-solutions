import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import './Login.css';

// Client ID de Google — reemplaza con el tuyo de Google Cloud Console
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '65625975165-ifbuvkl6p76a48l31mqmbdr0f2pafdb9.apps.googleusercontent.com';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  // Callback que llama Google Identity Services al completar login
  const handleGoogleCallback = useCallback(async (response) => {
    if (!response?.credential) return;
    setGoogleLoading(true);
    setError('');
    const result = await loginWithGoogle(response.credential);
    setGoogleLoading(false);
    if (result.success) {
      navigate(result.role === 'admin' ? '/admin' : from);
    } else {
      setError(result.error);
    }
  }, [loginWithGoogle, navigate, from]);

  // Cargar el script de Google Identity Services
  useEffect(() => {
    const scriptId = 'gsi-script';
    if (document.getElementById(scriptId)) {
      // Script ya cargado, solo inicializar
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { type: 'standard', shape: 'rectangular', theme: 'outline', size: 'large', width: 340, locale: 'es' }
        );
      }
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
          auto_select: false,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { type: 'standard', shape: 'rectangular', theme: 'outline', size: 'large', width: 340, locale: 'es' }
        );
      }
    };
    document.head.appendChild(script);
  }, [handleGoogleCallback]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="login-page animate-fade-in">
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>

      <div className="login-container glass">
        <div className="login-logo-area">
          <div className="auth-icon-circle">
            <ShieldCheck size={28} />
          </div>
        </div>
        <h1 className="login-title">Iniciar Sesión</h1>
        <p className="login-subtitle">Bienvenido de regreso a Fixio Solutions</p>

        {error && <div className="login-error">{error}</div>}

        {/* Botón de Google */}
        <div className="google-btn-wrapper">
          {googleLoading ? (
            <div className="google-loading">
              <div className="spinner-sm"></div>
              <span>Conectando con Google...</span>
            </div>
          ) : (
            <div id="google-signin-btn" className="google-gsi-btn"></div>
          )}
        </div>

        <div className="auth-divider">
          <span>o continúa con tu correo</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group input-icon-wrap">
            <label htmlFor="email">Correo Electrónico</label>
            <div className="input-icon-inner">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <div className="form-group input-icon-wrap">
            <label htmlFor="password">Contraseña</label>
            <div className="input-icon-inner">
              <Lock size={16} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPassword(p => !p)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary" className="login-btn" disabled={loading}>
            {loading ? 'Verificando...' : 'Ingresar'}
          </Button>
        </form>

        <div className="login-footer-links">
          <p>¿No tienes cuenta? <Link to="/register" className="auth-link">Regístrate gratis</Link></p>
        </div>

        <div className="login-hint">
          <p>Admin: <code>admin@fixio.com / admin123</code></p>
          <p>Demo: <code>maria@ejemplo.com / cliente123</code></p>
        </div>
      </div>
    </div>
  );
}
