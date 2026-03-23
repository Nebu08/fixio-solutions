import { MapPin, Phone, Mail, Clock, MessageCircle, ShieldCheck, Zap, Users, Star } from 'lucide-react';
import SEO from '../components/ui/SEO';
import Button from '../components/ui/Button';
import './Nosotros.css';

export default function Nosotros() {
  const handleWhatsApp = () => {
    window.open('https://wa.me/573116860336?text=Hola%20Fixio%2C%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n.', '_blank');
  };

  return (
    <div className="nosotros-page animate-fade-in">
      <SEO
        title="Nosotros"
        description="Conoce a Fixio Solutions — tu aliado en tecnología inteligente para el hogar. Descubre nuestra historia, valores y cómo contactarnos."
        url="/nosotros"
      />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="nosotros-hero">
        <div className="nosotros-hero-bg" />
        <div className="container nosotros-hero-content">
          <span className="badge glass">Sobre Nosotros</span>
          <h1>
            Tecnología que <span className="text-gradient">transforma</span> tu hogar
          </h1>
          <p>
            En Fixio Solutions llevamos la tecnología de vanguardia directamente a las manos
            de quienes más la necesitan — de forma simple, segura y accesible.
          </p>
        </div>
      </section>

      {/* ── QUIÉNES SOMOS ────────────────────────────── */}
      <section className="container nosotros-about">
        <div className="nosotros-about-grid">
          <div className="nosotros-about-text glass">
            <h2>¿Quiénes somos?</h2>
            <p>
              Somos una empresa colombiana fundada con una misión clara: <strong>democratizar
                el acceso a la tecnología inteligente.</strong> Nació de la convicción de que
              los gadgets modernos deben estar al alcance de todos, sin importar el nivel
              técnico del usuario.
            </p>
            <p>
              Desde Bogotá, operamos con un catálogo cuidadosamente seleccionado de productos
              probados, garantizados y respaldados por nuestro equipo de soporte. Cada artículo
              que vendemos pasa por un riguroso proceso de validación de calidad y
              compatibilidad.
            </p>
            <p>
              Nuestra promesa es simple: <strong>tecnología que funciona desde el primer
                momento</strong>, con el respaldo humano que mereces cuando lo necesitas.
            </p>
          </div>
          <div className="nosotros-stats-grid">
            <div className="nosotros-stat glass">
              <span className="stat-number text-gradient">500+</span>
              <span className="stat-label">Clientes satisfechos</span>
            </div>
            <div className="nosotros-stat glass">
              <span className="stat-number text-gradient">100+</span>
              <span className="stat-label">Productos disponibles</span>
            </div>
            <div className="nosotros-stat glass">
              <span className="stat-number text-gradient">4.9★</span>
              <span className="stat-label">Calificación promedio</span>
            </div>
            <div className="nosotros-stat glass">
              <span className="stat-number text-gradient">24h</span>
              <span className="stat-label">Tiempo de respuesta</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALORES ──────────────────────────────────── */}
      <section className="nosotros-valores">
        <div className="container">
          <h2 className="section-title text-center">Nuestros Valores</h2>
          <div className="valores-grid">
            <div className="valor-card glass">
              <div className="valor-icon"><Zap size={28} /></div>
              <h3>Innovación Accesible</h3>
              <p>Llevamos lo último en tecnología a precios que se adaptan a la realidad colombiana.</p>
            </div>
            <div className="valor-card glass">
              <div className="valor-icon"><ShieldCheck size={28} /></div>
              <h3>Confianza y Garantía</h3>
              <p>Todos nuestros productos cuentan con garantía y soporte post-venta real.</p>
            </div>
            <div className="valor-card glass">
              <div className="valor-icon"><Users size={28} /></div>
              <h3>Servicio Humano</h3>
              <p>Detrás de cada pedido hay personas reales listas para ayudarte.</p>
            </div>
            <div className="valor-card glass">
              <div className="valor-icon"><Star size={28} /></div>
              <h3>Calidad Comprobada</h3>
              <p>Seleccionamos solo productos que cumplan nuestros altos estándares de calidad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISIÓN Y VISIÓN ──────────────────────────── */}
      <section className="container nosotros-mision">
        <div className="mision-grid">
          <div className="mision-card glass">
            <div className="mision-icon">🎯</div>
            <h3>Misión</h3>
            <p>
              Facilitar el acceso a tecnología inteligente y de calidad para hogares colombianos,
              ofreciendo productos confiables, soporte excepcional y una experiencia de compra
              simple y segura.
            </p>
          </div>
          <div className="mision-card glass">
            <div className="mision-icon">🚀</div>
            <h3>Visión</h3>
            <p>
              Ser la plataforma líder en Colombia para la adopción de tecnología del hogar,
              reconocida por la calidad de nuestros productos, la confianza de nuestros clientes
              y nuestro impacto positivo en la calidad de vida de las familias.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTACTO ─────────────────────────────────── */}
      <section id="contacto" className="nosotros-contacto">
        <div className="container">
          <h2 className="section-title text-center">Contáctanos</h2>
          <p className="contacto-subtitle text-center">
            ¿Tienes preguntas sobre un producto o tu pedido? Estamos aquí para ayudarte.
          </p>

          <div className="contacto-grid">
            {/* Info de contacto */}
            <div className="contacto-info">
              <div className="contacto-card glass">
                <div className="contacto-icon"><MapPin size={24} /></div>
                <div>
                  <h4>Ubicación</h4>
                  <p>Bogotá, Colombia</p>
                  <p className="text-muted">Carrera 7 #32-16, Chapinero</p>
                </div>
              </div>
              <div className="contacto-card glass">
                <div className="contacto-icon"><Phone size={24} /></div>
                <div>
                  <h4>Teléfono / WhatsApp</h4>
                  <p>+57 311 686 0336</p>
                  <button className="wp-inline-btn" onClick={handleWhatsApp}>
                    <MessageCircle size={16} /> Escribir por WhatsApp
                  </button>
                </div>
              </div>
              <div className="contacto-card glass">
                <div className="contacto-icon"><Mail size={24} /></div>
                <div>
                  <h4>Correo Electrónico</h4>
                  <p>soporte@fixiosolutions.com</p>
                  <p className="text-muted">ventas@fixiosolutions.com</p>
                </div>
              </div>
              <div className="contacto-card glass">
                <div className="contacto-icon"><Clock size={24} /></div>
                <div>
                  <h4>Horario de Atención</h4>
                  <p>Lun – Vie: 8:00 am – 6:00 pm</p>
                  <p>Sáb: 9:00 am – 2:00 pm</p>
                  <p className="text-muted">Dom: Cerrado</p>
                </div>
              </div>

              <Button variant="primary" fullWidth size="lg" onClick={handleWhatsApp}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <MessageCircle size={20} /> Chatea con nosotros
              </Button>
            </div>

            {/* Formulario de contacto */}
            <div className="contacto-form-wrapper glass">
              <h3>Envíanos un mensaje</h3>
              <form className="contacto-form" onSubmit={(e) => { e.preventDefault(); alert('¡Mensaje enviado! Te contactaremos pronto.'); e.target.reset(); }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" required placeholder="Tu nombre completo" />
                  </div>
                  <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input type="email" required placeholder="tu@correo.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Asunto</label>
                  <select required defaultValue="">
                    <option value="" disabled>Selecciona un asunto</option>
                    <option>Consulta sobre un producto</option>
                    <option>Estado de mi pedido</option>
                    <option>Garantía o devolución</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Mensaje</label>
                  <textarea required rows="5" placeholder="¿En qué podemos ayudarte?" />
                </div>
                <Button type="submit" variant="primary" fullWidth size="lg">
                  Enviar Mensaje
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAPA ─────────────────────────────────────── */}
      <section className="nosotros-mapa">
        <div className="container">
          <h2 className="section-title text-center">¿Dónde estamos?</h2>
          <p className="contacto-subtitle text-center">Visítanos en nuestra sede en Bogotá, Chapinero.</p>
          <div className="mapa-wrapper glass">
            <iframe
              title="Ubicación Fixio Solutions — Bogotá"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.5959932039696!2d-74.06194832524783!3d4.665895741958768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a58acba24a3%3A0xd57e168b4db93dfb!2sEdificio%20centro%20profesional%20tempo!5e0!3m2!1ses!2sco!4v1774223616284!5m2!1ses!2sco"
              width="100%"
              height="420"
              style={{ border: 0, borderRadius: 'var(--radius-lg)', display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
