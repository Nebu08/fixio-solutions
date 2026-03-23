import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Shield, Truck, RotateCcw, Star, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/ui/SEO';
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { products, addReview } = useProducts();
  const { currentUser } = useAuth();
  
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewImage, setReviewImage] = useState('');

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Producto no encontrado</h2>
        <Link to="/catalog"><Button variant="primary">Volver al Catálogo</Button></Link>
      </div>
    );
  }

  const isDiscounted = product.originalPrice && product.originalPrice > product.price;
  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    
    addReview(product.id, {
      user: currentUser.email.split('@')[0],
      rating: reviewRating,
      text: reviewText,
      image: reviewImage
    });
    
    setReviewText('');
    setReviewImage('');
    setReviewRating(5);
  };

  return (
    <div className="product-details-page animate-fade-in">
      <SEO title={product.name} description={product.description} url={`/product/${product.id}`} />
      <div className="container">
        <div className="breadcrumb">
          <Link to="/catalog" className="back-link">
            <ArrowLeft size={16} /> Volver al Catálogo
          </Link>
          <span className="separator">/</span>
          <span className="current-page">{product.category}</span>
        </div>

        <div className="product-details-grid" style={{ marginBottom: '4rem' }}>
          <div className="product-gallery">
            <div className="main-image-container glass" style={{ backgroundColor: 'var(--color-surface-2)' }}>
              <img src={product.image} alt={product.name} className="main-image" />
              {isDiscounted && <span className="discount-badge">Oferta</span>}
            </div>
          </div>
          
          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-meta">
              <div className="product-rating" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
                <span className="rating-value" style={{ fontWeight: '600' }}>{averageRating}</span>
                <span className="review-count" style={{ color: 'var(--color-text-secondary)', marginLeft: '0.25rem' }}>
                  ({reviews.length} reseñas)
                </span>
              </div>
              <span className="stock-status">En Stock (Listo para enviar)</span>
            </div>
            
            <div className="product-price-section">
              <span className="current-price">${product.price.toFixed(2)}</span>
              {isDiscounted && (
                <span className="original-price">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            
            <p className="product-description">{product.description || 'Sin descripción detallada.'}</p>
            
            {product.specs && product.specs.length > 0 && (
              <div className="product-specs">
                <h3>Especificaciones Clave</h3>
                <ul>
                  {product.specs.map((spec, i) => (
                    <li key={i}>{spec}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="product-actions-form">
              <div className="quantity-selector">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="qty-btn"
                  disabled={(product.stock || 0) === 0}
                >-</button>
                <input 
                  type="number" 
                  min="1" 
                  max={product.stock || 1}
                  value={(product.stock || 0) === 0 ? 0 : quantity} 
                  readOnly 
                  className="qty-input" 
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))} 
                  className="qty-btn"
                  disabled={(product.stock || 0) === 0 || quantity >= product.stock}
                >+</button>
              </div>
              
              <div className="action-buttons">
                {(product.stock || 0) === 0 ? (
                  <Button variant="secondary" size="lg" className="add-to-cart-btn-large" disabled>
                    Agotado
                  </Button>
                ) : (
                  <Button variant="primary" size="lg" className="add-to-cart-btn-large" onClick={() => addToCart(product, quantity)}>
                    <ShoppingCart size={20} /> Agregar al Carrito
                  </Button>
                )}
                <button className="wishlist-btn glass" aria-label="Añadir a Deseados" style={{ backgroundColor: 'var(--color-surface-1)' }}>
                  <Heart size={24} />
                </button>
              </div>
            </div>
            
            <div className="trust-badges">
              <div className="trust-badge">
                <Truck size={20} className="trust-icon" />
                <span>Envío gratuito en pedidos de más de $99</span>
              </div>
              <div className="trust-badge">
                <Shield size={20} className="trust-icon" />
                <span>Garantía Extendido de 2 Años</span>
              </div>
              <div className="trust-badge">
                <RotateCcw size={20} className="trust-icon" />
                <span>Garantía de Devolución de 30 Días</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* REVIEWS SECTION */}
        <div className="reviews-section glass" style={{ padding: '3rem', borderRadius: '16px', background: 'var(--color-surface-1)', border: '1px solid var(--color-border)', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Reseñas de Clientes</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '3rem' }}>
            {/* Reviews Summary */}
            <div>
              <div className="rating-summary" style={{ textAlign: 'center', padding: '2rem', background: 'var(--color-bg)', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '3rem', color: 'var(--color-primary)', margin: '0 0 0.5rem', lineHeight: '1' }}>{averageRating}</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={20} fill={star <= averageRating ? "var(--color-accent)" : "none"} color="var(--color-accent)" />
                  ))}
                </div>
                <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Basado en {reviews.length} reseñas</p>
              </div>
              
              <div style={{ marginTop: '2rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Escribe una Reseña</h4>
                {!currentUser ? (
                  <div style={{ padding: '1.5rem', background: 'var(--color-bg)', borderRadius: '8px', textAlign: 'center', border: '1px dashed var(--color-border)' }}>
                    <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Debes iniciar sesión para calificar.</p>
                    <Link to="/login"><Button variant="primary" style={{ width: '100%' }}>Iniciar Sesión</Button></Link>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Tu Calificación</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <button 
                            key={star} 
                            type="button"
                            onClick={() => setReviewRating(star)}
                            style={{ padding: 0 }}
                          >
                            <Star size={24} fill={star <= reviewRating ? "var(--color-accent)" : "none"} color="var(--color-accent)" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Foto (URL Opcional)</label>
                      <input
                        type="url"
                        value={reviewImage}
                        onChange={(e) => setReviewImage(e.target.value)}
                        placeholder="https://..."
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          borderRadius: '8px',
                          border: '1px solid var(--color-border)',
                          fontFamily: 'inherit',
                          background: 'var(--color-surface-1)'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Tu Comentario</label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="¿Qué te pareció el producto?"
                        required
                        rows="4"
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          borderRadius: '8px',
                          border: '1px solid var(--color-border)',
                          fontFamily: 'inherit',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                    <Button type="submit" variant="primary">Publicar Reseña</Button>
                  </form>
                )}
              </div>
            </div>
            
            {/* Reviews List */}
            <div className="reviews-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {reviews.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  Aún no hay reseñas para este producto. ¡Sé el primero en opinar!
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id} style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ 
                          width: '32px', height: '32px', borderRadius: '50%', 
                          background: 'var(--color-surface-2)', color: 'var(--color-primary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 'bold', fontSize: '0.9rem'
                        }}>
                          {review.user[0].toUpperCase()}
                        </div>
                        <strong style={{ fontSize: '0.95rem' }}>{review.user}</strong>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{review.date}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.15rem', marginBottom: '0.75rem' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} size={14} fill={star <= review.rating ? "var(--color-accent)" : "none"} color="var(--color-accent)" />
                      ))}
                    </div>
                    <p style={{ margin: 0, lineHeight: '1.5', color: 'var(--color-text-primary)' }}>{review.text}</p>
                    {review.image && (
                      <div style={{ marginTop: '1rem', width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                        <img src={review.image} alt="User review" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
