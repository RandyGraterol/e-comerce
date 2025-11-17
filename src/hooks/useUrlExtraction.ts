import { useState } from 'react';
import { ProductData, Store } from '@/types/business';
import { detectStore, extractProductFromUrl, generateAffiliateLink } from '@/lib/storeDetector';
import { calculateCostBreakdown, calculateRevenueBreakdown } from '@/lib/costCalculator';

/**
 * Hook para simular la extracción de productos desde URL
 */
export function useUrlExtraction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractProduct = async (url: string): Promise<ProductData | null> => {
    setLoading(true);
    setError(null);

    try {
      // Detectar tienda
      const store = detectStore(url);
      
      if (!store) {
        throw new Error('No se pudo detectar la tienda. Verifica que la URL sea válida.');
      }

      // Simular delay de extracción
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Extraer datos del producto
      const productData = extractProductFromUrl(url);
      
      if (!productData) {
        throw new Error('No se pudo extraer información del producto');
      }

      // Generar ID único
      const productId = `ext_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      // Calcular peso aproximado basado en la tienda
      const estimatedWeight = store === 'shein' ? 0.5 : store === 'amazon' ? 0.3 : 0.8;
      
      // Calcular costos
      const costBreakdown = calculateCostBreakdown(productData.price, estimatedWeight);
      const revenueBreakdown = calculateRevenueBreakdown(costBreakdown);

      // Construir objeto de producto completo
      const product: ProductData = {
        id: productId,
        url,
        store,
        integrationMethod: 'url_extract',
        title: productData.title,
        price: productData.price,
        currency: 'USD',
        image: productData.image,
        description: productData.description,
        variants: productData.variants,
        weight: estimatedWeight,
        shippingTime: store === 'shein' ? '15-25 días' : store === 'amazon' ? '10-20 días' : '20-30 días',
        affiliateLink: generateAffiliateLink(store, productId),
        costBreakdown,
        revenueBreakdown,
        createdAt: new Date().toISOString()
      };

      // Guardar en localStorage
      const saved = localStorage.getItem('simulated_products');
      const products: ProductData[] = saved ? JSON.parse(saved) : [];
      products.unshift(product); // Agregar al inicio
      localStorage.setItem('simulated_products', JSON.stringify(products));

      return product;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al extraer producto';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    extractProduct,
    loading,
    error
  };
}
