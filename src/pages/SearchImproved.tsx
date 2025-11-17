import { useState, useEffect } from 'react';
import { useSearchProducts } from '@/hooks/useSearchProducts';
import { useProductFilters } from '@/hooks/useProductFilters';
import { useOrderWithNotifications } from '@/hooks/useOrderWithNotifications';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProductFilters } from '@/components/ProductFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon, Star, ShoppingCart, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SearchImproved = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isSearching, results, searchProducts } = useSearchProducts();
  const { applyFilters, filters } = useProductFilters();
  const { createOrder } = useOrderWithNotifications();
  const { toast } = useToast();
  const [filteredResults, setFilteredResults] = useState(results);

  useEffect(() => {
    const filtered = applyFilters(results);
    setFilteredResults(filtered);
  }, [results, filters]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast({
        title: 'Error',
        description: 'Ingresa un término de búsqueda',
        variant: 'destructive',
      });
      return;
    }
    const store = filters.store;
    await searchProducts(searchQuery, store);
  };

  const handleAddToCart = async (product: any) => {
    const order = await createOrder(
      [{
        productId: product.id,
        productTitle: product.title,
        productImage: product.image,
        price: product.price,
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
      description: `Orden ${order.id} creada con notificación`,
    });
  };

  const getStoreBadgeColor = (store: string) => {
    const colors = {
      shein: 'bg-pink-500/20 text-pink-700 dark:text-pink-400',
      amazon: 'bg-orange-500/20 text-orange-700 dark:text-orange-400',
      aliexpress: 'bg-red-500/20 text-red-700 dark:text-red-400',
    };
    return colors[store as keyof typeof colors];
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Búsqueda Avanzada
          </h1>
          <p className="text-muted-foreground mt-1">
            Busca, filtra y compara productos de diferentes tiendas
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Buscar Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                type="text"
                placeholder="Busca productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isSearching}>
                <SearchIcon className="mr-2 h-4 w-4" />
                {isSearching ? 'Buscando...' : 'Buscar'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ProductFilters onFiltersChange={() => {}} />
          </div>

          <div className="lg:col-span-3">
            {filteredResults.length > 0 && (
              <div className="mb-4">
                <h2 className="text-2xl font-semibold">
                  Resultados ({filteredResults.length})
                </h2>
              </div>
            )}

            {filteredResults.length === 0 && !isSearching && (
              <Card>
                <CardContent className="py-16 text-center">
                  <Package className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                    {results.length === 0 ? 'Busca productos' : 'No se encontraron resultados'}
                  </h3>
                  <p className="text-muted-foreground">
                    {results.length === 0 
                      ? 'Ingresa un término de búsqueda para comenzar'
                      : 'Intenta ajustar los filtros o buscar otro producto'
                    }
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredResults.map((product) => (
                <Card key={product.id} className="border-primary/20 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold line-clamp-2">{product.title}</h3>
                          <Badge className={getStoreBadgeColor(product.store)}>
                            {product.store}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({product.reviews.toLocaleString()} reseñas)
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-primary">
                              ${product.price}
                            </span>
                            <span className="text-sm text-muted-foreground ml-1">
                              {product.currency}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            className="gap-2"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Comprar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SearchImproved;
