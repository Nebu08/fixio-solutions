import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('fixio-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart');
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('fixio-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    if ((product.stock || 0) <= 0) return; // Ignore if out of stock
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => {
          if (item.id === product.id) {
            const newQ = item.quantity + quantity;
            return { ...item, quantity: Math.min(newQ, product.stock || 0) };
          }
          return item;
        });
      }
      const initialQ = Math.min(quantity, product.stock || 0);
      return [...prev, { ...product, quantity: initialQ }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: Math.min(newQuantity, item.stock || 0) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
