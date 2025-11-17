import { useProductFilters } from '@/hooks/useProductFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Filter, X } from 'lucide-react';

interface ProductFiltersProps {
  onFiltersChange: (filters: ReturnType<typeof useProductFilters>['filters']) => void;
}

export const ProductFilters = ({ onFiltersChange }: ProductFiltersProps) => {
  const { filters, updateFilter, clearFilters, getActiveFiltersCount } = useProductFilters();

  const handleFilterChange = <K extends keyof typeof filters>(
    key: K,
    value: typeof filters[K]
  ) => {
    updateFilter(key, value);
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    clearFilters();
    onFiltersChange({});
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">{getActiveFiltersCount()}</Badge>
            )}
          </CardTitle>
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Rango de Precio (USD)</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tienda</Label>
          <Select
            value={filters.store || 'all'}
            onValueChange={(value) => handleFilterChange('store', value === 'all' ? undefined : value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las tiendas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las tiendas</SelectItem>
              <SelectItem value="shein">Shein</SelectItem>
              <SelectItem value="amazon">Amazon</SelectItem>
              <SelectItem value="aliexpress">AliExpress</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Calificación Mínima</Label>
          <div className="space-y-2">
            <Slider
              value={[filters.minRating || 0]}
              onValueChange={([value]) => handleFilterChange('minRating', value === 0 ? undefined : value)}
              max={5}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span className="font-medium text-foreground">
                {filters.minRating ? `${filters.minRating}+` : 'Todas'}
              </span>
              <span>5</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Ordenar por</Label>
          <Select
            value={filters.sortBy || 'default'}
            onValueChange={(value) => handleFilterChange('sortBy', value === 'default' ? undefined : value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Predeterminado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Predeterminado</SelectItem>
              <SelectItem value="price_asc">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="price_desc">Precio: Mayor a Menor</SelectItem>
              <SelectItem value="rating">Mejor Calificación</SelectItem>
              <SelectItem value="reviews">Más Reseñas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
