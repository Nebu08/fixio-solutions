import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, LogOut, LayoutDashboard, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { cartCount } = useCart();
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <header className="navbar glass">
      <div className="container nav-content">
        <div className="nav-brand">
          <Link to="/">
            <img
              src="/logo.png"
              alt="Fixio Solutions Logo"
              style={{ maxHeight: '40px', display: 'block' }}
              onError={(e) => {
                // Si logo.png falla, intenta con logo.svg.jpg que vimos en tu carpeta public
                if (!e.target.getAttribute('data-tried-fallback')) {
                  e.target.setAttribute('data-tried-fallback', 'true');
                  e.target.src = '/logo.svg.jpg';
                } else {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                }
              }}
            />
            <h2 style={{ display: 'none' }}>Fixio<span>.</span></h2>
          </Link>
        </div>

        <nav className={`nav-links${mobileMenuOpen ? ' nav-links--open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
          <Link to="/catalog" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Catálogo</Link>
          <Link to="/blog" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
          <Link to="/nosotros" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Nosotros</Link>
        </nav>

        <div className="nav-actions">
          <button className="icon-btn" aria-label="Buscar">
            <Search size={20} />
          </button>

          <Link to="/cart" className="icon-btn cart-btn" aria-label="Carrito">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* Botón de usuario */}
          {currentUser ? (
            <div className="user-menu-wrapper" ref={menuRef}>
              <button
                className="user-avatar-btn"
                onClick={() => setUserMenuOpen(o => !o)}
                aria-label="Menú de usuario"
                aria-expanded={userMenuOpen}
              >
                <span className="user-avatar">{getInitials(currentUser.name)}</span>
                <span className="user-name-short">{currentUser.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className={`chevron ${userMenuOpen ? 'chevron--up' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="user-dropdown glass animate-slide-up">
                  <div className="user-dropdown-header">
                    <span className="user-avatar user-avatar--lg">{getInitials(currentUser.name)}</span>
                    <div>
                      <p className="dropdown-user-name">{currentUser.name}</p>
                      <p className="dropdown-user-email">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="user-dropdown-divider" />
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="user-dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard size={15} />
                      Panel de Admin
                    </Link>
                  )}
                  <button className="user-dropdown-item user-dropdown-item--danger" onClick={handleLogout}>
                    <LogOut size={15} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="icon-btn login-nav-btn" aria-label="Iniciar sesión">
              <User size={20} />
            </Link>
          )}

          {/* Botón menú móvil */}
          <button
            className="icon-btn menu-btn"
            aria-label="Menú"
            onClick={() => setMobileMenuOpen(o => !o)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
