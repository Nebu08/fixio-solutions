import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { ParticleButton } from './particle-button';
import { GlowingEffect } from './glowing-effect';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { id, name, price, category, image, originalPrice, reviews = [] } = product;
  const isDiscounted = originalPrice && originalPrice > price;
  const { addToCart } = useCart();
  
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;
  
  return (
    <div className="product-card glass relative" style={{ backgroundColor: 'var(--color-surface-1)' }}>
      <GlowingEffect spread={40} glow={true} disabled={false} inactiveZone={0.01} borderWidth={3} className="z-0" />
      
      <div className="product-image-container relative z-10" style={{ backgroundColor: 'var(--color-surface-2)' }}>
        <Link to={`/product/${id}`}>
          <img src={image || 'https://via.placeholder.com/300x300/C8E4F9/333333?text=Producto'} alt={name} className="product-image" />
        </Link>
        <ParticleButton asChild>
          <button className="favorite-btn" aria-label="Añadir a favoritos">
            <Heart size={18} />
          </button>
        </ParticleButton>
        {isDiscounted && (
          <span className="discount-badge">Oferta</span>
        )}
      </div>
      
      <div className="product-info relative z-10 flex-grow">
        <span className="product-category">{category}</span>
        <Link to={`/product/${id}`}>
          <h3 className="product-title">{name}</h3>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
          <Star size={14} fill={avgRating > 0 ? "var(--color-accent)" : "none"} color="var(--color-accent)" />
          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{avgRating > 0 ? avgRating : '-'}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>({reviews.length})</span>
        </div>
        
        <div className="product-price-row">
          <div className="product-price-wrap">
            <span className="product-price">${price.toFixed(2)}</span>
            {isDiscounted && (
              <span className="product-original-price">${originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
        
        {(product.stock || 0) === 0 ? (
          <Button variant="secondary" fullWidth className="add-to-cart-btn" disabled>
            Agotado
          </Button>
        ) : (
          <ParticleButton asChild>
            <Button 
              variant="primary" 
              fullWidth 
              className="add-to-cart-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product, 1);
              }}
            >
              <ShoppingCart size={16} />
              Al Carrito
            </Button>
          </ParticleButton>
        )}
      </div>
    </div>
  );
}
