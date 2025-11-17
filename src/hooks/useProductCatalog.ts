import { useState, useEffect } from 'react';
import { ProductData, Store } from '@/types/business';
import { searchInCatalogs, getProductsByCategory, STORE_CATALOGS } from '@/lib/storeCatalogs';

/**
 * Hook para gestionar el catálogo de productos simulado
 */
export function useProductCatalog() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar productos en catálogos
  const searchProducts = async (query: string, store?: Store) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const results = searchInCatalogs(query, store);
      setProducts(results);
    } catch (err) {
      setError('Error al buscar productos');
    } finally {
      setLoading(false);
    }
  };

  // Obtener productos por categoría
  const getByCategory = async (store: Store, category: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const results = getProductsByCategory(store, category);
      setProducts(results);
    } catch (err) {
      setError('Error al obtener productos por categoría');
    } finally {
      setLoading(false);
    }
  };

  // Obtener todas las categorías disponibles
  const getAllCategories = () => {
    const categoriesMap = new Map<string, string[]>();
    
    STORE_CATALOGS.forEach(catalog => {
      categoriesMap.set(catalog.store, catalog.categories);
    });
    
    return categoriesMap;
  };

  // Cargar productos guardados en localStorage
  useEffect(() => {
    const saved = localStorage.getItem('simulated_products');
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (err) {
        console.error('Error loading saved products:', err);
      }
    }
  }, []);

  return {
    products,
    loading,
    error,
    searchProducts,
    getByCategory,
    getAllCategories
  };
}
