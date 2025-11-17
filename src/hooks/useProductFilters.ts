import { useState } from 'react';

export interface ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  store?: 'shein' | 'amazon' | 'aliexpress';
  inStock?: boolean;
  minRating?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'reviews';
}

export interface FilterableProduct {
  id: string;
  title: string;
  price: number;
  store: 'shein' | 'amazon' | 'aliexpress';
  rating: number;
  reviews: number;
  inStock: boolean;
}

export const useProductFilters = () => {
  const [filters, setFilters] = useState<ProductFilters>({});

  const updateFilter = <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const applyFilters = <T extends FilterableProduct>(products: T[]): T[] => {
    let filtered = [...products];

    // Filtro de precio
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice!);
    }

    // Filtro de tienda
    if (filters.store) {
      filtered = filtered.filter(p => p.store === filters.store);
    }

    // Filtro de disponibilidad
    if (filters.inStock !== undefined) {
      filtered = filtered.filter(p => p.inStock === filters.inStock);
    }

    // Filtro de rating
    if (filters.minRating !== undefined) {
      filtered = filtered.filter(p => p.rating >= filters.minRating!);
    }

    // Ordenamiento
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'reviews':
          filtered.sort((a, b) => b.reviews - a.reviews);
          break;
      }
    }

    return filtered;
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => {
      const value = filters[key as keyof ProductFilters];
      return value !== undefined && value !== null;
    }).length;
  };

  return {
    filters,
    updateFilter,
    clearFilters,
    applyFilters,
    getActiveFiltersCount,
  };
};
