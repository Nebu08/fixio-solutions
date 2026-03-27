import { createContext, useContext, useState, useEffect } from 'react';
import { createOrder as apiCreateOrder, getUserOrders, updateOrderStatus as apiUpdateOrderStatus } from '../services/api';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useAuth();

  // Load from backend
  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setOrders([]);
        setLoading(false);
        return;
      }
      try {
        const data = await getUserOrders(currentUser.id);
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentUser]);

  const addOrder = async (orderData) => {
    try {
      const response = await apiCreateOrder(orderData);
      const newOrder = response.order;
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      console.error('Error adding order:', err);
      throw err;
    }
  };

  const updateOrderStatus = async (orderId, newStatus, deliveryCode) => {
    try {
      const resp = await apiUpdateOrderStatus(orderId, newStatus, deliveryCode);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      return { success: true, data: resp };
    } catch (err) {
      console.error('Error updating order status:', err);
      return { success: false, error: err.message };
    }
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus
    }}>
      {!loading && children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
