import { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import SEO from '../components/ui/SEO';
import { useProducts } from '../context/ProductContext';
import './Catalog.css';

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('featured');
  const [priceFilters, setPriceFilters] = useState([]);
  const { products, categories } = useProducts();
  
  const handlePriceToggle = (range) => {
    setPriceFilters(prev => 
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'Todos' ? true : p.category === activeCategory;
    
    let matchesPrice = true;
    if (priceFilters.length > 0) {
      matchesPrice = priceFilters.some(range => {
        if (range === 'under-50') return p.price < 50;
        if (range === '50-100') return p.price >= 50 && p.price <= 100;
        if (range === '100-200') return p.price > 100 && p.price <= 200;
        if (range === 'over-200') return p.price > 200;
        return false;
      });
    }

    return matchesCategory && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0; // featured
  });

  return (
    <div className="catalog-page animate-fade-in">
      <SEO title="Catálogo de Productos" description="Explora nuestra colección que hace tu vida diaria más fácil y práctica." url="/catalog" />
      <div className="catalog-header container">
        <h1 className="catalog-title">Todos los Productos</h1>
        <p className="catalog-subtitle">Explora nuestra colección que hace tu vida diaria más fácil y práctica.</p>
      </div>
      
      <div className="container catalog-layout">
        <aside className="catalog-sidebar">
          <div className="filter-group">
            <h3 className="filter-title">Categorías</h3>
            <ul className="category-list">
              {['Todos', ...categories].map(cat => (
                <li key={cat}>
                  <button 
                    className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="filter-group">
            <h3 className="filter-title">Rango de Precio</h3>
            <div className="price-filters" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label className="checkbox-label">
                <input type="checkbox" checked={priceFilters.includes('under-50')} onChange={() => handlePriceToggle('under-50')} /> Menos de $50
              </label>
              <label className="checkbox-label">
                <input type="checkbox" checked={priceFilters.includes('50-100')} onChange={() => handlePriceToggle('50-100')} /> $50 - $100
              </label>
              <label className="checkbox-label">
                <input type="checkbox" checked={priceFilters.includes('100-200')} onChange={() => handlePriceToggle('100-200')} /> $100 - $200
              </label>
              <label className="checkbox-label">
                <input type="checkbox" checked={priceFilters.includes('over-200')} onChange={() => handlePriceToggle('over-200')} /> Más de $200
              </label>
            </div>
          </div>
        </aside>
        
        <div className="catalog-main">
          <div className="catalog-controls">
            <div className="results-count">Mostrando {filteredProducts.length} resultados</div>
            <div className="sort-control glass" style={{ backgroundColor: 'var(--color-surface-1)' }}>
              <span>Ordenar por:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                <option value="featured">Destacados</option>
                <option value="price-low">Precio: Menor a Mayor</option>
                <option value="price-high">Precio: Mayor a Menor</option>
              </select>
              <ChevronDown size={16} />
            </div>
            <button className="mobile-filter-btn btn btn-outline btn-sm">
              <Filter size={16} /> Filtros
            </button>
          </div>
          
          <div className="catalog-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <h3>No se encontraron productos</h3>
              <p>Intenta ajustar tus filtros para encontrar el producto ideal.</p>
              <button className="btn btn-primary" onClick={() => { setActiveCategory('Todos'); setSortBy('featured'); setPriceFilters([]); }}>
                Limpiar Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
