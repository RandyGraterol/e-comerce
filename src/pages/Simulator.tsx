import { useProductSimulation } from '@/hooks/useProductSimulation';
import { useOrderWithNotifications } from '@/hooks/useOrderWithNotifications';
import { ProductExtractorForm } from '@/components/ProductExtractorForm';
import { ProductCardImproved } from '@/components/ProductCardImproved';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag } from 'lucide-react';

const Simulator = () => {
  const { products, simulateExtraction, deleteProduct, clearAll } = useProductSimulation();
  const { createOrder } = useOrderWithNotifications();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Extracción por URL
          </h1>
          <p className="text-muted-foreground mt-1">
            Extrae información de productos desde URLs de tiendas internacionales
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProductExtractorForm onExtract={simulateExtraction} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                Productos Extraídos
                {products.length > 0 && (
                  <span className="ml-2 text-lg text-muted-foreground">({products.length})</span>
                )}
              </h2>
              {products.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpiar Todo
                </Button>
              )}
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16 rounded-lg border-2 border-dashed border-muted-foreground/20">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  No hay productos extraídos
                </h3>
                <p className="text-muted-foreground">
                  Ingresa una URL de producto para comenzar la extracción
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <ProductCardImproved
                    key={product.id}
                    product={product}
                    onDelete={deleteProduct}
                    onCreateOrder={createOrder}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Simulator;
