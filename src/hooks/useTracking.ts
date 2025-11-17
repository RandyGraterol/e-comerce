import { useState } from 'react';

export interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export interface TrackingInfo {
  orderId: string;
  trackingNumber: string;
  currentStatus: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered';
  estimatedDelivery: string;
  events: TrackingEvent[];
}

const generateTrackingEvents = (orderId: string, currentStatus: string): TrackingEvent[] => {
  const now = new Date();
  const events: TrackingEvent[] = [];

  events.push({
    status: 'Pedido Recibido',
    location: 'Sistema',
    timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Tu pedido ha sido recibido y está siendo procesado'
  });

  if (['processing', 'shipped', 'in_transit', 'delivered'].includes(currentStatus)) {
    events.push({
      status: 'En Preparación',
      location: 'Centro de Distribución - Brasil',
      timestamp: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'El pedido está siendo preparado para envío'
    });
  }

  if (['shipped', 'in_transit', 'delivered'].includes(currentStatus)) {
    events.push({
      status: 'Enviado',
      location: 'São Paulo, Brasil',
      timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'El paquete ha sido enviado y está en tránsito'
    });
  }

  if (['in_transit', 'delivered'].includes(currentStatus)) {
    events.push({
      status: 'En Tránsito Internacional',
      location: 'Aduana Brasil',
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'El paquete está cruzando la frontera'
    });
  }

  if (currentStatus === 'delivered') {
    events.push({
      status: 'Entregado',
      location: 'Caracas, Venezuela',
      timestamp: now.toISOString(),
      description: 'El paquete ha sido entregado exitosamente'
    });
  }

  return events.reverse();
};

export const useTracking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);

  const trackOrder = async (orderIdOrTracking: string): Promise<TrackingInfo | null> => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Get order from localStorage
    const stored = localStorage.getItem('customer_orders');
    if (stored) {
      const orders = JSON.parse(stored);
      const order = orders.find((o: any) =>
        o.id === orderIdOrTracking || o.trackingNumber === orderIdOrTracking
      );

      if (order) {
        const deliveryDate = new Date(order.estimatedDelivery);
        const info: TrackingInfo = {
          orderId: order.id,
          trackingNumber: order.trackingNumber || 'N/A',
          currentStatus: order.status,
          estimatedDelivery: deliveryDate.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          events: generateTrackingEvents(order.id, order.status)
        };

        setTrackingInfo(info);
        setIsLoading(false);
        return info;
      }
    }

    setIsLoading(false);
    return null;
  };

  return {
    isLoading,
    trackingInfo,
    trackOrder
  };
};
