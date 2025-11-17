import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Link2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SimulatedProduct } from '@/hooks/useProductSimulation';

interface ProductExtractorFormProps {
  onExtract: (url: string) => SimulatedProduct;
}

export const ProductExtractorForm = ({ onExtract }: ProductExtractorFormProps) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa una URL válida",
        variant: "destructive",
      });
      return;
    }

    const validStores = ['shein', 'amazon', 'aliexpress'];
    const isValid = validStores.some(store => url.toLowerCase().includes(store));

    if (!isValid) {
      toast({
        title: "Error",
        description: "La URL debe ser de Shein, Amazon o AliExpress",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      try {
        const product = onExtract(url);
        toast({
          title: "¡Éxito!",
          description: `Producto "${product.title}" extraído correctamente`,
        });
        setUrl('');
      } catch (error) {
        toast({
          title: "Error",
          description: "Hubo un problema al extraer el producto",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          Extractor de Productos
        </CardTitle>
        <CardDescription>
          Ingresa la URL de un producto de Shein, Amazon o AliExpress para extraer información
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-url">URL del Producto</Label>
            <Input
              id="product-url"
              type="url"
              placeholder="https://www.shein.com/product/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extrayendo...
              </>
            ) : (
              'Extraer Producto'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
