import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" style={{ backgroundColor: 'var(--color-surface-1)' }}>
      <div className="container footer-content">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2>Fixio<span>.</span></h2>
            <p>Productos tecnológicos prácticos, útiles y fáciles de usar que contribuyen a mejorar tu calidad de vida.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" aria-label="Youtube"><Youtube size={20} /></a>
            </div>
          </div>
          
          <div className="footer-links">
            <h3>Tienda</h3>
            <ul>
              <li><Link to="/catalog">Todos los Productos</Link></li>
              <li><a href="#">Novedades</a></li>
              <li><a href="#">Más Vendidos</a></li>
              <li><a href="#">Ofertas</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h3>Soporte</h3>
            <ul>
              <li><a href="#">Preguntas Frecuentes</a></li>
              <li><a href="#">Envíos y Devoluciones</a></li>
              <li><a href="#">Rastrear Pedido</a></li>
              <li><a href="#">Contáctanos</a></li>
            </ul>
          </div>
          
          <div className="footer-newsletter">
            <h3>Mantente Actualizado</h3>
            <p>Suscríbete para recibir ofertas especiales sobre tecnología práctica para el hogar.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Ingresa tu correo" required />
              <button type="submit">Suscribir</button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Fixio Solutions. Todos los derechos reservados.</p>
          <div className="footer-legal">
              <Link to="/privacy-policy">Política de Privacidad</Link>
              <a href="#">Términos de Servicio</a>
            </div>
        </div>
      </div>
    </footer>
  );
}
