import { createContext, useContext, useState, useEffect } from 'react';
import { verifyGoogleToken, loginWithEmail as apiLogin, registerWithEmail as apiRegister } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const DEFAULT_USERS = [
  {
    id: 'u1',
    name: 'María García',
    email: 'maria@ejemplo.com',
    password: 'cliente123',
    phone: '+57 311 234 5678',
    address: 'Calle 72 # 10-34, Bogotá',
    role: 'customer',
    provider: 'email',
    createdAt: '2025-01-15'
  }
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fixio_token');
    const savedUser = localStorage.getItem('fixio_user');
    
    if (token && savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      // Clear inconsistent state
      localStorage.removeItem('fixio_token');
      localStorage.removeItem('fixio_user');
    }
    setLoading(false);
  }, []);

  const _saveSession = (user, token) => {
    localStorage.setItem('fixio_user', JSON.stringify(user));
    if (token) localStorage.setItem('fixio_token', token);
    setCurrentUser(user);
  };

  // ─── LOGIN EMAIL ───────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const { user, token } = await apiLogin(email, password);
      _saveSession(user, token);
      return { success: true, role: user.role };
    } catch (error) {
      return { success: false, error: error.message || 'Correo o contraseña incorrectos.' };
    }
  };

  // ─── GOOGLE LOGIN ──────────────────────────────────────────────────────────
  const loginWithGoogle = async (credential) => {
    try {
      const { user, token } = await verifyGoogleToken(credential);
      _saveSession(user, token);
      return { success: true, role: user.role };
    } catch (error) {
      return { success: false, error: error.message || 'Error al iniciar sesión con Google.' };
    }
  };

  // ─── REGISTER ─────────────────────────────────────────────────────────────
  const register = async (userData) => {
    try {
      const { user, token } = await apiRegister(userData);
      _saveSession(user, token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Error al registrar la cuenta.' };
    }
  };

  // ─── LOGOUT ───────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('fixio_user');
    localStorage.removeItem('fixio_token');
    setCurrentUser(null);
  };

  // ─── UPDATE PROFILE ───────────────────────────────────────────────────────
  const updateProfile = (updatedData) => {
    const storedUsers = JSON.parse(localStorage.getItem('fixio_users') || '[]');
    const updatedUsers = storedUsers.map(u =>
      u.id === currentUser.id ? { ...u, ...updatedData } : u
    );
    localStorage.setItem('fixio_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    const updatedUser = { ...currentUser, ...updatedData };
    _saveSession(updatedUser);
    return { success: true };
  };

  const value = {
    currentUser,
    users,
    login,
    loginWithGoogle,
    register,
    logout,
    updateProfile,
    isAdmin: currentUser?.role === 'admin',
    isCustomer: currentUser?.role === 'customer',
    isLoggedIn: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
