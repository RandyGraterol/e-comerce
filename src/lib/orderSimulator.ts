import { Order, OrderStatus, TrackingEvent } from '@/types/business';

/**
 * Mapeo de estados de orden con sus detalles
 */
export const ORDER_STATUS_MAP: Record<OrderStatus, {
  title: string;
  description: string;
  location: string;
}> = {
  created: {
    title: 'Orden Creada',
    description: 'Tu orden ha sido registrada en el sistema',
    location: 'Sistema'
  },
  pending_payment: {
    title: 'Pendiente de Pago',
    description: 'Esperando confirmación del pago',
    location: 'Sistema'
  },
  payment_confirmed: {
    title: 'Pago Confirmado',
    description: 'El pago ha sido procesado exitosamente',
    location: 'Sistema'
  },
  purchasing: {
    title: 'En Proceso de Compra',
    description: 'Estamos comprando el producto en la tienda',
    location: 'Tienda en línea'
  },
  purchased: {
    title: 'Compra Realizada',
    description: 'El producto ha sido comprado exitosamente',
    location: 'Tienda en línea'
  },
  transit_brazil: {
    title: 'En Tránsito a Brasil',
    description: 'El paquete está en camino a nuestro centro en Brasil',
    location: 'En tránsito internacional'
  },
  arrived_locker: {
    title: 'Llegada a Casillero',
    description: 'El paquete ha llegado a nuestro casillero en Brasil',
    location: 'São Paulo, Brasil'
  },
  brazil_customs: {
    title: 'En Aduana Brasileña',
    description: 'Procesamiento aduanal en Brasil',
    location: 'Aduana São Paulo, Brasil'
  },
  shipping_venezuela: {
    title: 'Envío a Venezuela',
    description: 'El paquete está siendo preparado para envío a Venezuela',
    location: 'São Paulo, Brasil'
  },
  in_transit: {
    title: 'En Tránsito a Venezuela',
    description: 'El paquete está en camino a Venezuela',
    location: 'En tránsito internacional'
  },
  arrived_venezuela: {
    title: 'Llegada a Venezuela',
    description: 'El paquete ha llegado a Venezuela',
    location: 'Caracas, Venezuela'
  },
  in_delivery: {
    title: 'En Reparto',
    description: 'El paquete está siendo entregado a tu dirección',
    location: 'En reparto local'
  },
  delivered: {
    title: 'Entregado',
    description: 'El paquete ha sido entregado exitosamente',
    location: 'Dirección de destino'
  },
  completed: {
    title: 'Completado',
    description: 'La orden ha sido completada',
    location: 'Sistema'
  }
};

/**
 * Genera eventos de tracking automáticos para una orden
 */
export function generateTrackingEvents(order: Order): TrackingEvent[] {
  const statusFlow: OrderStatus[] = [
    'created',
    'pending_payment',
    'payment_confirmed',
    'purchasing',
    'purchased',
    'transit_brazil',
    'arrived_locker',
    'brazil_customs',
    'shipping_venezuela',
    'in_transit',
    'arrived_venezuela',
    'in_delivery',
    'delivered',
    'completed'
  ];

  const currentStatusIndex = statusFlow.indexOf(order.status);
  const events: TrackingEvent[] = [];

  // Genera eventos hasta el estado actual
  for (let i = 0; i <= currentStatusIndex; i++) {
    const status = statusFlow[i];
    const statusInfo = ORDER_STATUS_MAP[status];
    
    // Calcula timestamp basado en el progreso
    const daysFromCreation = i * 2; // 2 días por estado aproximadamente
    const timestamp = new Date(
      new Date(order.createdAt).getTime() + daysFromCreation * 24 * 60 * 60 * 1000
    ).toISOString();

    events.push({
      id: `${order.id}_${status}`,
      status,
      title: statusInfo.title,
      description: statusInfo.description,
      location: statusInfo.location,
      timestamp
    });
  }

  return events.reverse(); // Más reciente primero
}

/**
 * Simula la progresión automática de estados de una orden
 */
export function simulateOrderProgress(order: Order): OrderStatus {
  const statusFlow: OrderStatus[] = [
    'created',
    'pending_payment',
    'payment_confirmed',
    'purchasing',
    'purchased',
    'transit_brazil',
    'arrived_locker',
    'brazil_customs',
    'shipping_venezuela',
    'in_transit',
    'arrived_venezuela',
    'in_delivery',
    'delivered',
    'completed'
  ];

  const currentIndex = statusFlow.indexOf(order.status);
  
  // Si no está en el último estado, avanza al siguiente
  if (currentIndex < statusFlow.length - 1) {
    return statusFlow[currentIndex + 1];
  }

  return order.status;
}

/**
 * Calcula tiempo estimado de entrega basado en el estado actual
 */
export function calculateEstimatedDelivery(status: OrderStatus): Date {
  const now = new Date();
  const daysToAdd: Record<OrderStatus, number> = {
    created: 30,
    pending_payment: 28,
    payment_confirmed: 25,
    purchasing: 22,
    purchased: 20,
    transit_brazil: 18,
    arrived_locker: 15,
    brazil_customs: 12,
    shipping_venezuela: 10,
    in_transit: 7,
    arrived_venezuela: 5,
    in_delivery: 2,
    delivered: 0,
    completed: 0
  };

  const days = daysToAdd[status] || 30;
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
}
