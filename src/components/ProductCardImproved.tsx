import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VariantSelector } from '@/components/VariantSelector';
import { Trash2, ExternalLink, Package, Clock, DollarSign, ShoppingCart } from 'lucide-react';
import { SimulatedProduct } from '@/hooks/useProductSimulation';
import { OrderItem, ShippingAddress } from '@/hooks/useOrderManagement';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: SimulatedProduct;
  onDelete: (id: string) => void;
  onCreateOrder?: (items: OrderItem[], customerEmail: string, shippingAddress: ShippingAddress) => Promise<any>;
}

export const ProductCardImproved = ({ product, onDelete, onCreateOrder }: ProductCardProps) => {
  const { toast } = useToast();
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  
  const handleCreateOrder = async () => {
    if (!onCreateOrder) return;

    if (!selectedVariant && product.variants.length > 0) {
      toast({
        title: 'Selecciona una variante',
        description: 'Por favor selecciona una variante antes de crear la orden',
        variant: 'destructive',
      });
      return;
    }
    
    const order = await onCreateOrder(
      [{
        productId: product.id,
        productTitle: product.title,
        productImage: product.image,
        price: product.costBreakdown.total,
        quantity: 1,
        variant: selectedVariant,
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
      description: `Orden ${order.id} creada exitosamente${selectedVariant ? ` - Variante: ${selectedVariant}` : ''}`,
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

        {product.variants.length > 0 && (
          <VariantSelector
            variants={product.variants}
            label="Selecciona tu variante"
            onSelect={setSelectedVariant}
            selectedVariant={selectedVariant}
          />
        )}

        <div className="space-y-2">
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
              <span className="text-muted-foreground">Envío:</span>
              <span className="font-medium">${product.costBreakdown.shippingCost}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border font-bold">
              <span>Total:</span>
              <span className="text-primary">${product.costBreakdown.total}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {onCreateOrder && (
            <Button
              className="flex-1 gap-2"
              onClick={handleCreateOrder}
            >
              <ShoppingCart className="h-4 w-4" />
              Crear Orden
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            asChild
          >
            <a href={product.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
