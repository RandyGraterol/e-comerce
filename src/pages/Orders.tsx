import { useOrderManagement, Order } from '@/hooks/useOrderManagement';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Orders = () => {
  const { orders, updateOrderStatus, deleteOrder, clearAllOrders } = useOrderManagement();
  const { toast } = useToast();

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
      processing: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
      shipped: 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
      in_transit: 'bg-primary/20 text-primary',
      delivered: 'bg-green-500/20 text-green-700 dark:text-green-400'
    };
    return colors[status];
  };

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

  const handleStatusChange = (orderId: string, currentStatus: Order['status']) => {
    const statusFlow: Order['status'][] = ['pending', 'processing', 'shipped', 'in_transit', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    
    if (currentIndex < statusFlow.length - 1) {
      const nextStatus = statusFlow[currentIndex + 1];
      updateOrderStatus(orderId, nextStatus);
      toast({
        title: 'Estado actualizado',
        description: `Orden cambiada a: ${getStatusText(nextStatus)}`,
      });
    }
  };

  const handleDelete = (orderId: string) => {
    deleteOrder(orderId);
    toast({
      title: 'Orden eliminada',
      description: 'La orden ha sido eliminada correctamente',
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Gestión de Órdenes
            </h1>
            <p className="text-muted-foreground mt-1">
              Administra y actualiza el estado de las órdenes
            </p>
          </div>
          {orders.length > 0 && (
            <Button variant="outline" onClick={clearAllOrders}>
              <Trash2 className="mr-2 h-4 w-4" />
              Limpiar Todo
            </Button>
          )}
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                No hay órdenes
              </h3>
              <p className="text-muted-foreground">
                Las órdenes creadas aparecerán aquí
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <Card key={order.id} className="border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(order.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Información del Cliente</h4>
                      <p className="text-sm text-muted-foreground">
                        Email: {order.customerEmail}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.fullName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Detalles de la Orden</h4>
                      <p className="text-sm text-muted-foreground">
                        Tracking: {order.trackingNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total: {order.currency} {order.totalAmount}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Items: {order.items.length}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Productos</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                        >
                          <img
                            src={item.productImage}
                            alt={item.productTitle}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.productTitle}</p>
                            <p className="text-xs text-muted-foreground">
                              Cantidad: {item.quantity} × ${item.price}
                            </p>
                          </div>
                          <Badge variant="outline">{item.store}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.status !== 'delivered' && (
                    <Button
                      onClick={() => handleStatusChange(order.id, order.status)}
                      className="w-full"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Avanzar Estado
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Orders;
