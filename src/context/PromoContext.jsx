import { createContext, useContext, useState, useEffect } from 'react';
import { getBanners } from '../services/api';

const PromoContext = createContext();

const DEFAULT_PROMOTIONS = [
  {
    id: 'promo-1',
    title: "Mes del Hogar Inteligente",
    subtitle: "Revoluciona tu rutina diaria con tecnología pensada para ti",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1200&auto=format&fit=crop",
    link: "/catalog",
    cta: "Explorar Ofertas"
  },
  {
    id: 'promo-2',
    title: "Respira Tranquilidad",
    subtitle: "Nuevos purificadores de aire Nexus con sensores IOT. La salud de tu familia es prioridad.",
    image: "https://images.unsplash.com/photo-1518612180806-03fbd8eeb5bb?q=80&w=1200&auto=format&fit=crop",
    link: "/product/prod-2",
    cta: "Ver Detalles"
  },
  {
    id: 'promo-3',
    title: "15% de Descuento",
    subtitle: "Obtén tecnología inteligente para la productividad en casa. Exclusivo esta semana.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    link: "/catalog",
    cta: "Comprar Ahora"
  }
];
export function PromoProvider({ children }) {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const data = await getBanners();
        setPromos(data);
      } catch (err) {
        console.error('Error fetching promos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPromos();
  }, []);

  const addPromo = (promoData) => {
    const newPromo = {
      ...promoData,
      id: `promo-${Date.now()}`
    };
    setPromos(prev => [...prev, newPromo]);
  };

  const updatePromo = async (id, updatedData) => {
    // This frontend proxy update will be moved to Admin Dashboard
    setPromos(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deletePromo = (id) => {
    setPromos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <PromoContext.Provider value={{
      promos,
      addPromo,
      updatePromo,
      deletePromo
    }}>
      {!loading && children}
    </PromoContext.Provider>
  );
}

export const usePromos = () => useContext(PromoContext);
