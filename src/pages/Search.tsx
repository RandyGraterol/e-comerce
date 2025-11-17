import { useState } from 'react';
import { useSearchProducts } from '@/hooks/useSearchProducts';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search as SearchIcon, Star, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const { isSearching, results, searchProducts } = useSearchProducts();
  const { createOrder } = useOrderManagement();
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const store = selectedStore === 'all' ? undefined : selectedStore as 'shein' | 'amazon' | 'aliexpress';
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
      description: `Orden ${order.id} creada exitosamente`,
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Búsqueda en Catálogos
          </h1>
          <p className="text-muted-foreground mt-1">
            Busca productos en diferentes tiendas internacionales
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Buscar Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Busca productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Todas las tiendas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las tiendas</SelectItem>
                    <SelectItem value="shein">Shein</SelectItem>
                    <SelectItem value="amazon">Amazon</SelectItem>
                    <SelectItem value="aliexpress">AliExpress</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" disabled={isSearching}>
                  <SearchIcon className="mr-2 h-4 w-4" />
                  {isSearching ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Resultados ({results.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((product) => (
                <Card key={product.id} className="overflow-hidden border-primary/20">
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 right-2" variant="secondary">
                      {product.store}
                    </Badge>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-semibold line-clamp-2 min-h-[3rem]">
                      {product.title}
                    </h3>
                    
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          ${product.price}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.inStock ? 'En stock' : 'Agotado'}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Crear Orden
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!isSearching && results.length === 0 && searchQuery && (
          <div className="text-center py-16 rounded-lg border-2 border-dashed border-muted-foreground/20">
            <SearchIcon className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-muted-foreground">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Search;
