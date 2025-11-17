import { useOrderManagement, Order } from './useOrderManagement';
import { useNotifications } from './useNotifications';

const getStatusText = (status: Order['status']) => {
  const texts = {
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    in_transit: 'En Tránsito',
    delivered: 'Entregado'
  };
  return texts[status];
};

export const useOrderWithNotifications = () => {
  const orderManagement = useOrderManagement();
  const { addNotification } = useNotifications();

  const createOrderWithNotification = async (...args: Parameters<typeof orderManagement.createOrder>) => {
    const order = await orderManagement.createOrder(...args);
    
    addNotification(
      'order_status',
      'Nueva Orden Creada',
      `Tu orden ${order.id} ha sido creada exitosamente. Tracking: ${order.trackingNumber}`,
      { orderId: order.id, status: order.status }
    );

    return order;
  };

  const updateOrderStatusWithNotification = (orderId: string, status: Order['status']) => {
    const order = orderManagement.getOrder(orderId);
    if (order) {
      orderManagement.updateOrderStatus(orderId, status);
      
      addNotification(
        'order_status',
        'Cambio de Estado',
        `Tu orden ${orderId} ahora está ${getStatusText(status)}`,
        { orderId, status }
      );
    }
  };

  return {
    ...orderManagement,
    createOrder: createOrderWithNotification,
    updateOrderStatus: updateOrderStatusWithNotification,
  };
};
