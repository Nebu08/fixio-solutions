import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { User, Mail, Lock, Phone, MapPin, Eye, EyeOff, CheckCircle } from 'lucide-react';
import './Login.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '65625975165-ifbuvkl6p76a48l31mqmbdr0f2pafdb9.apps.googleusercontent.com';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    acceptPolicy: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleCallback = useCallback(async (response) => {
    if (!response?.credential) return;
    setGoogleLoading(true);
    setError('');
    const result = await loginWithGoogle(response.credential);
    setGoogleLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  }, [loginWithGoogle, navigate]);

  useEffect(() => {
    const scriptId = 'gsi-script';
    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
          auto_select: false,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-register-btn'),
          { type: 'standard', shape: 'rectangular', theme: 'outline', size: 'large', width: 340, locale: 'es', text: 'signup_with' }
        );
      }
    };

    if (document.getElementById(scriptId)) {
      initGoogle();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.head.appendChild(script);
  }, [handleGoogleCallback]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('El nombre es requerido.');
      return;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!formData.acceptPolicy) {
      setError('Debes aceptar la Política de Tratamiento de Datos para continuar.');
      return;
    }

    setLoading(true);
    const result = register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address
    });
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  const getPasswordStrength = () => {
    const pw = formData.password;
    if (pw.length === 0) return { level: 0, label: '', color: '' };
    if (pw.length < 6) return { level: 1, label: 'Débil', color: 'var(--color-error, #ef4444)' };
    if (pw.length < 10 || !/[0-9]/.test(pw)) return { level: 2, label: 'Media', color: 'var(--color-warning, #f59e0b)' };
    return { level: 3, label: 'Fuerte', color: 'var(--color-success, #10b981)' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="login-page animate-fade-in">
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>

      <div className="login-container glass" style={{ maxWidth: '520px' }}>
        <div className="login-logo-area">
          <div className="auth-icon-circle">
            <User size={28} />
          </div>
        </div>
        <h1 className="login-title">Crear Cuenta</h1>
        <p className="login-subtitle">Únete a Fixio Solutions</p>

        {error && <div className="login-error">{error}</div>}

        {/* Botón Google */}
        <div className="google-btn-wrapper">
          {googleLoading ? (
            <div className="google-loading">
              <div className="spinner-sm"></div>
              <span>Conectando con Google...</span>
            </div>
          ) : (
            <div id="google-register-btn" className="google-gsi-btn"></div>
          )}
        </div>

        <div className="auth-divider">
          <span>o crea tu cuenta con correo</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Nombre */}
          <div className="form-group input-icon-wrap">
            <label htmlFor="name">Nombre Completo</label>
            <div className="input-icon-inner">
              <User size={16} className="input-icon" />
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Juan Pérez" required />
            </div>
          </div>

          {/* Email */}
          <div className="form-group input-icon-wrap">
            <label htmlFor="email">Correo Electrónico</label>
            <div className="input-icon-inner">
              <Mail size={16} className="input-icon" />
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="juan@email.com" required />
            </div>
          </div>

          {/* Contraseña */}
          <div className="form-group input-icon-wrap">
            <label htmlFor="password">Contraseña</label>
            <div className="input-icon-inner">
              <Lock size={16} className="input-icon" />
              <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" required />
              <button type="button" className="pw-toggle" onClick={() => setShowPassword(p => !p)} tabIndex={-1}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {formData.password.length > 0 && (
              <div className="pw-strength-bar">
                <div className="pw-strength-track">
                  <div className="pw-strength-fill" style={{ width: `${(strength.level / 3) * 100}%`, backgroundColor: strength.color }} />
                </div>
                <span className="pw-strength-label" style={{ color: strength.color }}>{strength.label}</span>
              </div>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div className="form-group input-icon-wrap">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <div className="input-icon-inner">
              <Lock size={16} className="input-icon" />
              <input type={showConfirm ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repite tu contraseña" required />
              <button type="button" className="pw-toggle" onClick={() => setShowConfirm(p => !p)} tabIndex={-1}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <CheckCircle size={16} className="pw-match-icon" style={{ color: 'var(--color-success, #10b981)' }} />
              )}
            </div>
          </div>

          {/* Teléfono */}
          <div className="form-group input-icon-wrap">
            <label htmlFor="phone">Teléfono / WhatsApp <span className="optional-label">(opcional)</span></label>
            <div className="input-icon-inner">
              <Phone size={16} className="input-icon" />
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+57 310 123 4567" />
            </div>
          </div>

          {/* Dirección */}
          <div className="form-group input-icon-wrap">
            <label htmlFor="address">Dirección de Entrega <span className="optional-label">(opcional)</span></label>
            <div className="input-icon-inner" style={{ alignItems: 'flex-start' }}>
              <MapPin size={16} className="input-icon" style={{ marginTop: '12px' }} />
              <textarea id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Calle, Número, Barrio, Ciudad..." rows="2" style={{ resize: 'vertical', paddingTop: '10px' }} />
            </div>
          </div>

          {/* Política de datos */}
          <div className="policy-checkbox-wrap">
            <input
              type="checkbox"
              id="acceptPolicy"
              name="acceptPolicy"
              checked={formData.acceptPolicy}
              onChange={handleChange}
            />
            <label htmlFor="acceptPolicy">
              He leído y acepto la{' '}
              <Link to="/privacy-policy" target="_blank" className="auth-link">
                Política de Tratamiento de Datos Personales
              </Link>
            </label>
          </div>

          <Button type="submit" variant="primary" className="login-btn" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
        </form>

        <div className="login-footer-links">
          <p>¿Ya tienes cuenta? <Link to="/login" className="auth-link">Inicia sesión aquí</Link></p>
        </div>
      </div>
    </div>
  );
}
