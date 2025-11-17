import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ExternalLink, Package, Clock, DollarSign, ShoppingCart } from 'lucide-react';
import { SimulatedProduct } from '@/hooks/useProductSimulation';
import { OrderItem, ShippingAddress } from '@/hooks/useOrderManagement';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: SimulatedProduct;
  onDelete: (id: string) => void;
  onCreateOrder?: (items: OrderItem[], customerEmail: string, shippingAddress: ShippingAddress) => Promise<any>;
}

export const ProductCard = ({ product, onDelete, onCreateOrder }: ProductCardProps) => {
  const { toast } = useToast();
  
  const handleCreateOrder = async () => {
    if (!onCreateOrder) return;
    
    const order = await onCreateOrder(
      [{
        productId: product.id,
        productTitle: product.title,
        productImage: product.image,
        price: product.costBreakdown.total,
        quantity: 1,
        store: product.store
      }],
      'cliente@ejemplo.com',
      {
        fullName: 'Cliente Ejemplo',
        phone: '+58 412 1234567',
        address: 'Calle Principal',
        city: 'Caracas',
        state: 'Miranda',
        postalCode: '1060',
        country: 'Venezuela'
      }
    );

    toast({
      title: '¡Orden creada!',
      description: `Orden ${order.id} creada exitosamente`,
    });
  };
  
  const getStoreBadgeVariant = (store: string) => {
    switch (store) {
      case 'shein':
        return 'default';
      case 'amazon':
        return 'secondary';
      case 'aliexpress':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
          <Badge variant={getStoreBadgeVariant(product.store)}>
            {product.store.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Variantes:</span>
            <span className="font-medium">{product.variants.join(', ')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Envío:</span>
            <span className="font-medium">{product.shippingTime}</span>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4 space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="font-semibold">Desglose de Costos</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Precio del producto:</span>
              <span className="font-medium">${product.costBreakdown.productPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tarifa de servicio:</span>
              <span className="font-medium">${product.costBreakdown.serviceFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Costo de envío:</span>
              <span className="font-medium">${product.costBreakdown.shippingCost}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span className="text-primary">${product.costBreakdown.total}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {onCreateOrder && (
            <Button onClick={handleCreateOrder} className="w-full">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Crear Orden
            </Button>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(product.affiliateLink, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Link
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(product.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
