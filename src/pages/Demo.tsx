import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProductCatalog } from '@/hooks/useProductCatalog';
import { useUrlExtraction } from '@/hooks/useUrlExtraction';
import { useOrderTracking } from '@/hooks/useOrderTracking';
import { Search, Link as LinkIcon, Package, TrendingUp, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function Demo() {
  const [searchQuery, setSearchQuery] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const { products, searchProducts, loading: catalogLoading } = useProductCatalog();
  const { extractProduct, loading: extractLoading } = useUrlExtraction();
  const { orders, progressOrder } = useOrderTracking();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Ingresa un término de búsqueda');
      return;
    }
    searchProducts(searchQuery);
  };

  const handleExtractUrl = async () => {
    if (!urlInput.trim()) {
      toast.error('Ingresa una URL válida');
      return;
    }
    
    const product = await extractProduct(urlInput);
    if (product) {
      toast.success('Producto extraído exitosamente!');
    }
  };

  const handleProgressOrder = (orderId: string) => {
    progressOrder(orderId);
    toast.success('Estado de orden actualizado!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Demo de Simulación</h1>
          <p className="text-muted-foreground">
            Prueba todas las funcionalidades de la lógica de negocio
          </p>
        </div>

        <Tabs defaultValue="catalog" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="catalog">
              <Search className="h-4 w-4 mr-2" />
              Catálogo API
            </TabsTrigger>
            <TabsTrigger value="url">
              <LinkIcon className="h-4 w-4 mr-2" />
              Extracción URL
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="h-4 w-4 mr-2" />
              Tracking Órdenes
            </TabsTrigger>
          </TabsList>

          {/* Búsqueda en Catálogo */}
          <TabsContent value="catalog" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Búsqueda en Catálogos (Método API)</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Simula búsquedas en catálogos predefinidos de Shein, Amazon y AliExpress
              </p>
              
              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={catalogLoading}>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{product.title}</h3>
                          <Badge>{product.store}</Badge>
                        </div>
                        <p className="text-2xl font-bold text-primary mb-2">
                          ${product.price}
                        </p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Comisión servicio (12%):</span>
                            <span>${product.costBreakdown.serviceFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Envío:</span>
                            <span>${product.costBreakdown.shippingCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Aduanas:</span>
                            <span>${product.costBreakdown.customsFees.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold border-t pt-1">
                            <span>Total cliente:</span>
                            <span className="text-primary">${product.costBreakdown.total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-green-600 text-xs mt-2 border-t pt-1">
                            <span>Ganancia total:</span>
                            <span>${product.revenueBreakdown.totalProfit.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {products.length === 0 && !catalogLoading && (
                <p className="text-center text-muted-foreground py-8">
                  Realiza una búsqueda para ver productos
                </p>
              )}
            </Card>
          </TabsContent>

          {/* Extracción por URL */}
          <TabsContent value="url" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Extracción de Producto por URL</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Pega una URL de Shein, Amazon o AliExpress para extraer automáticamente los datos del producto
              </p>
              
              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="https://www.shein.com/product..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <Button onClick={handleExtractUrl} disabled={extractLoading}>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Extraer
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-primary/5">
                  <Search className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">1. Detección</h3>
                  <p className="text-sm text-muted-foreground">
                    Detecta la tienda basado en patrones de URL
                  </p>
                </Card>
                <Card className="p-4 bg-primary/5">
                  <Package className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">2. Extracción</h3>
                  <p className="text-sm text-muted-foreground">
                    Extrae título, precio, imagen y variantes
                  </p>
                </Card>
                <Card className="p-4 bg-primary/5">
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">3. Cálculos</h3>
                  <p className="text-sm text-muted-foreground">
                    Calcula costos, comisiones y ganancias
                  </p>
                </Card>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">URLs de ejemplo:</h3>
                <div className="space-y-2 text-sm">
                  <code className="block bg-background p-2 rounded">https://www.shein.com/producto-ejemplo</code>
                  <code className="block bg-background p-2 rounded">https://www.amazon.com/producto-ejemplo</code>
                  <code className="block bg-background p-2 rounded">https://www.aliexpress.com/producto-ejemplo</code>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tracking de Órdenes */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Sistema de Tracking Completo</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Flujo completo: Creada → Pendiente pago → Confirmada → Comprando → Comprada → 
                Tránsito Brasil → Casillero → Aduana → Envío VE → Tránsito → Llegada VE → Reparto → Entregada
              </p>

              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{order.trackingNumber}</h3>
                        <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                      </div>
                      <Badge variant="secondary">{order.status}</Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.trackingEvents.slice(0, 3).map((event) => (
                        <div key={event.id} className="flex items-start gap-3 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium">{event.title}</p>
                            <p className="text-muted-foreground text-xs">
                              {event.location} - {new Date(event.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleProgressOrder(order.id)}
                      >
                        Avanzar Estado
                      </Button>
                      <Button size="sm" variant="ghost">
                        Ver Detalles
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
