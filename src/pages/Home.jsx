import { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Zap, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import SEO from '../components/ui/SEO';
import { useProducts } from '../context/ProductContext';
import { usePromos } from '../context/PromoContext';
import './Home.css';

export default function Home() {
  const { featuredProducts } = useProducts();
  const { promos } = usePromos();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!promos || promos.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promos]);
  return (
    <div className="home-page animate-fade-in">
      <SEO title="Inicio" description="Todo para un hogar inteligente con tecnología accesible. Compra online y disfruta ofertas exclusivas." url="/" />
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>
      
      <section className="hero" style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ position: 'relative', width: '100%' }}>
          {promos && promos.map((promo, idx) => (
            <div 
              key={promo.id}
              className="hero-content" 
              style={{
                position: idx === 0 ? 'relative' : 'absolute',
                top: 0, left: 0, width: '100%',
                opacity: currentSlide === idx ? 1 : 0,
                visibility: currentSlide === idx ? 'visible' : 'hidden',
                transition: 'opacity 0.8s ease-in-out, visibility 0.8s ease-in-out',
                zIndex: currentSlide === idx ? 10 : 0
              }}
            >
              <div className="hero-text">
                <span className="badge glass">{promo.badge}</span>
                <h1 className="hero-title">
                  {promo.title} <span className="text-gradient">{promo.titleHighlight}</span>
                </h1>
                <p className="hero-subtitle">{promo.subtitle}</p>
                <div className="hero-actions">
                  <Link to={promo.link || '/catalog'}>
                    <Button size="lg" variant="primary">
                      {promo.cta || 'Ver Ofertas'} <ArrowRight size={20} />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hero-image-wrapper">
                <img 
                  src={promo.image} 
                  alt={promo.title} 
                  className="hero-image"
                />
              </div>
            </div>
          ))}

          {/* Carousel Controls */}
          <div style={{ position: 'absolute', bottom: '-3rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.75rem', zIndex: 20 }}>
            {promos && promos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: '12px', height: '12px', borderRadius: '50%',
                  background: currentSlide === idx ? 'var(--color-primary)' : 'var(--color-border)',
                  border: 'none', cursor: 'pointer', transition: 'background 0.3s'
                }}
                aria-label={`Ir a la promoción ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="about-services container" style={{ marginTop: '5rem', marginBottom: '3rem' }}>
        <div className="glass" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>Nuestra Filosofía Fixio</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto' }}>
            En <strong style={{color: 'var(--color-primary)'}}>Fixio Solutions</strong>, creemos que la tecnología de vanguardia no debe ser complicada. Nuestro compromiso es democratizar el acceso a un hogar inteligente, poniendo a disposición de las personas herramientas cotidianas que ahorren tiempo, brinden tranquilidad y mejoren la calidad de vida de tu familia. Descubre un catálogo cuidadosamente seleccionado con productos probados, garantizados y sobre todo: fáciles de usar desde el primer minuto.
          </p>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container features-grid">
          <div className="feature-card glass">
            <div className="feature-icon"><Zap size={24} /></div>
            <h3>Uso Práctico</h3>
            <p>Diseños orientados a facilitar tus tareas diarias.</p>
          </div>
          <div className="feature-card glass">
            <div className="feature-icon"><ShieldCheck size={24} /></div>
            <h3>Fácil de Usar</h3>
            <p>Implementación instantánea y amigable para todos.</p>
          </div>
          <div className="feature-card glass">
            <div className="feature-icon"><Truck size={24} /></div>
            <h3>Envíos a todo el País</h3>
            <p>Hasta la puerta de tu hogar en toda Colombia.</p>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Soluciones Destacadas</h2>
            <Link to="/catalog" className="view-all-link">
              Ver todos los productos <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="product-grid">
            {featuredProducts.length > 0 ? featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            )) : <p className="text-muted text-center" style={{gridColumn: "1/-1"}}>No hay productos destacados por el momento.</p>}
          </div>
        </div>
      </section>
      
      <section className="banner-section container">
        <div className="banner glass">
          <div className="banner-content">
            <h2>Únete a la Familia Fixio</h2>
            <p>Suscríbete para recibir consejos sobre cómo mejorar la calidad de vida en tu hogar y ofertas exclusivas en tecnología fácil de usar.</p>
            <form className="banner-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Ingresa tu dirección de correo" required />
              <Button type="submit" variant="primary">Suscribirse</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
