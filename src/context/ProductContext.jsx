import { createContext, useContext, useState, useEffect } from 'react';
import { getProducts as apiGetProducts, createSystemProduct, updateSystemProduct, deleteSystemProduct } from '../services/api';

const ProductContext = createContext();

export function useProducts() {
  return useContext(ProductContext);
}

const INITIAL_PRODUCTS = [
  { id: 'prod-1', name: 'Aspiradora Robot Inteligente', price: 299.99, originalPrice: 349.99, category: 'Hogar Práctico', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop', featured: true, description: 'Olvídate de limpiar el piso. Este robot inteligente limpia tu hogar mientras descansas o trabajas. Súper fácil de configurar con un solo botón.', specs: ['Control por App', 'Sistema Anticaídas', 'Autonomía 120min', 'Carga Automática'], stock: 15, reviews: [{ id: 'r1', user: 'carlos.m', rating: 5, text: 'Excelente producto, aspira super bien.', date: '2026-03-10' }, { id: 'r2', user: 'ana.g', rating: 4, text: 'Muy buena, aunque se traba a veces con alfombras altas.', date: '2026-03-12' }] },
  { id: 'prod-2', name: 'Purificador de Aire Nexus', price: 199.99, category: 'Salud', image: 'https://images.unsplash.com/photo-1585566367352-87fca54fa251?q=80&w=800&auto=format&fit=crop', featured: true, description: 'Mejora el aire de tu familia y elimina el 99% de polvo y bacterias. Práctico, silencioso y mejora enormemente la calidad de vida en casa.', specs: ['Filtro HEPA Verdadero', 'Modo Automático Nocturno', 'Cobertura 40m²', 'Sensor Iot'], stock: 8, reviews: [{ id: 'r3', user: 'luis.t', rating: 5, text: 'Es súper silencioso y el aire se siente diferente.', date: '2026-03-15' }] },
  { id: 'prod-3', name: 'Cámara de Seguridad WiFi Zenith', price: 89.50, originalPrice: 119.99, category: 'Seguridad', image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?q=80&w=800&auto=format&fit=crop', featured: true, description: 'Vigila tu hogar 24/7 con calidad 1080p, visión nocturna y detección de movimiento.', specs: ['1080p HD', 'Audio Bidireccional', 'Visión Nocturna', 'WiFi 2.4GHz'], stock: 20, reviews: [] },
  { id: 'prod-4', name: 'Alarma Inteligente Lumina', price: 59.00, category: 'Hogar Práctico', image: 'https://images.unsplash.com/photo-1555096462-c1c5eb4e4d64?q=80&w=800&auto=format&fit=crop', featured: true, description: 'Despierta naturalmente con luz gradual simulando el amanecer.', specs: ['Simulación Amanecer', 'Sonidos Naturales', 'Radio FM', 'Lampara de noche'], stock: 12, reviews: [] },
  { id: 'prod-5', name: 'Termostato Fácil de Usar', price: 89.99, category: 'Productividad', image: 'https://images.unsplash.com/photo-1584266103606-444fc2735741?q=80&w=800&auto=format&fit=crop', featured: false, description: 'Control de temperatura inteligente con programación de 7 días.', specs: ['Fácil de Instalar', 'Pantalla Táctil', 'Ahorro Energía'], stock: 5, reviews: [] },
  { id: 'prod-6', name: 'Cafetera Programable Elite', price: 79.99, originalPrice: 99.99, category: 'Hogar Práctico', image: 'https://images.unsplash.com/photo-1520106263884-bb9e03d3cdd1?q=80&w=800&auto=format&fit=crop', featured: false, description: 'Despierta siempre con el café recién hecho gracias a su programación automática.', specs: ['Filtro Reutilizable', '12 Tazas', 'Apagado Automático'], stock: 7, reviews: [] },
  { id: 'prod-7', name: 'Lámpara de Escritorio Pro', price: 49.00, category: 'Productividad', image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18a?q=80&w=800&auto=format&fit=crop', featured: false, description: 'Iluminación sin destellos y puerto USB de carga integrado.', specs: ['Luz Cálida y Fría', 'Puerto USB', 'Regulable'], stock: 14, reviews: [] },
  { id: 'prod-8', name: 'Humidificador Ultrasónico', price: 69.00, category: 'Salud', image: 'https://images.unsplash.com/photo-1621252178229-3738096f9a0d?q=80&w=800&auto=format&fit=crop', featured: false, description: 'Mantén el nivel de humedad ideal durante todo el invierno o en climas secos.', specs: ['Tanque de 4L', 'Luz LED', 'Aromaterapia'], stock: 0, reviews: [] }
];

const INITIAL_CATEGORIES = ['Hogar Práctico', 'Salud', 'Seguridad', 'Productividad', 'Útiles'];

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiGetProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback or handle error
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();

    // Categorías (mockeadas localmente para el frontend por ahora)
    const savedCategories = localStorage.getItem('fixio_categories');
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (e) {
        setCategories(INITIAL_CATEGORIES);
      }
    } else {
      setCategories(INITIAL_CATEGORIES);
    }
  }, []);

  const addProduct = async (product) => {
    try {
      const newProduct = await createSystemProduct(product);
      setProducts(prev => [newProduct, ...prev]);
    } catch (err) {
      console.error('Error creating product:', err);
      throw err;
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      // Evitamos sobrescribir con undefined eliminando los campos vacíos
      const parsedData = { ...updatedData };
      Object.keys(parsedData).forEach(key => parsedData[key] === undefined && delete parsedData[key]);
      
      const updatedProduct = await updateSystemProduct(id, parsedData);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteSystemProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  const addReview = (productId, review) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const currentReviews = p.reviews ? [...p.reviews] : [];
        return {
          ...p,
          reviews: [
            ...currentReviews,
            { ...review, id: `rev-${Date.now()}`, date: new Date().toISOString().split('T')[0] }
          ]
        };
      }
      return p;
    }));
  };

  const decreaseStock = (cartItems) => {
    setProducts(prev => prev.map(p => {
      const cartItem = cartItems.find(item => item.id === p.id);
      if (cartItem) {
        const newStock = Math.max(0, (p.stock || 0) - cartItem.quantity);
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  const addCategory = (name) => {
    if (!categories.includes(name)) {
      setCategories(prev => [...prev, name]);
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      categories,
      featuredProducts: products.filter(p => p.featured),
      addProduct,
      updateProduct,
      deleteProduct,
      addReview,
      addCategory,
      decreaseStock
    }}>
      {!loading && children}
    </ProductContext.Provider>
  );
}
