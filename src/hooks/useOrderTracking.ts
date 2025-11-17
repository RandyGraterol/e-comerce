import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/types/business';
import { generateTrackingEvents, simulateOrderProgress } from '@/lib/orderSimulator';

/**
 * Hook para gestionar el tracking de órdenes
 */
export function useOrderTracking() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar órdenes del localStorage
  const loadOrders = () => {
    const saved = localStorage.getItem('customer_orders');
    if (saved) {
      try {
        const parsedOrders: Order[] = JSON.parse(saved);
        setOrders(parsedOrders);
      } catch (err) {
        console.error('Error loading orders:', err);
      }
    }
  };

  // Obtener una orden por número de tracking
  const getOrderByTracking = (trackingNumber: string): Order | null => {
    return orders.find(o => o.trackingNumber === trackingNumber) || null;
  };

  // Obtener orden por ID
  const getOrderById = (orderId: string): Order | null => {
    return orders.find(o => o.id === orderId) || null;
  };

  // Actualizar estado de una orden
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = {
          ...order,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
        // Regenerar eventos de tracking
        updatedOrder.trackingEvents = generateTrackingEvents(updatedOrder);
        return updatedOrder;
      }
      return order;
    });

    setOrders(updatedOrders);
    localStorage.setItem('customer_orders', JSON.stringify(updatedOrders));
  };

  // Simular progreso automático de una orden
  const progressOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const nextStatus = simulateOrderProgress(order);
    if (nextStatus !== order.status) {
      updateOrderStatus(orderId, nextStatus);
    }
  };

  // Crear una nueva orden
  const createOrder = (orderData: Omit<Order, 'id' | 'trackingNumber' | 'trackingEvents' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
      trackingNumber: `TR${Date.now().toString().substring(3)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackingEvents: []
    };

    // Generar eventos iniciales
    newOrder.trackingEvents = generateTrackingEvents(newOrder);

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('customer_orders', JSON.stringify(updatedOrders));

    return newOrder;
  };

  // Cargar al montar
  useEffect(() => {
    loadOrders();
  }, []);

  return {
    orders,
    loading,
    getOrderByTracking,
    getOrderById,
    updateOrderStatus,
    progressOrder,
    createOrder,
    refreshOrders: loadOrders
  };
}
