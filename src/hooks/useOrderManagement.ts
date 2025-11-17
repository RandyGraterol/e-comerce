import { useState, useEffect } from 'react';

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  quantity: number;
  variant?: string;
  store: 'shein' | 'amazon' | 'aliexpress';
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customerEmail: string;
  shippingAddress: ShippingAddress;
  status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered';
  totalAmount: number;
  currency: string;
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
}

const ORDERS_STORAGE_KEY = 'customer_orders';

export const useOrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (stored) {
      setOrders(JSON.parse(stored));
    }
  }, []);

  const saveOrders = (newOrders: Order[]) => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(newOrders));
    setOrders(newOrders);
  };

  const createOrder = async (
    items: OrderItem[],
    customerEmail: string,
    shippingAddress: ShippingAddress
  ): Promise<Order> => {
    setIsCreating(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const serviceFee = totalAmount * 0.12;
    const shippingCost = 25;
    const finalTotal = totalAmount + serviceFee + shippingCost;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 15) + 15);

    const order: Order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      items,
      customerEmail,
      shippingAddress,
      status: 'pending',
      totalAmount: parseFloat(finalTotal.toFixed(2)),
      currency: 'USD',
      createdAt: new Date().toISOString(),
      estimatedDelivery: deliveryDate.toISOString(),
      trackingNumber: `TR${Date.now().toString().slice(-10)}`
    };

    const newOrders = [order, ...orders];
    saveOrders(newOrders);
    setIsCreating(false);

    return order;
  };

  const getOrder = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const newOrders = orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    saveOrders(newOrders);
  };

  const deleteOrder = (orderId: string) => {
    const newOrders = orders.filter(order => order.id !== orderId);
    saveOrders(newOrders);
  };

  const clearAllOrders = () => {
    localStorage.removeItem(ORDERS_STORAGE_KEY);
    setOrders([]);
  };

  return {
    orders,
    isCreating,
    createOrder,
    getOrder,
    updateOrderStatus,
    deleteOrder,
    clearAllOrders
  };
};
