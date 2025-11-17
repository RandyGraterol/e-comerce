import { Store } from '@/types/business';

/**
 * Detecta la tienda basándose en patrones de URL
 */
export function detectStore(url: string): Store | null {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('shein.com') || urlLower.includes('shein')) {
    return 'shein';
  }
  
  if (urlLower.includes('amazon.com') || urlLower.includes('amazon')) {
    return 'amazon';
  }
  
  if (urlLower.includes('aliexpress.com') || urlLower.includes('aliexpress')) {
    return 'aliexpress';
  }
  
  return null;
}

/**
 * Genera datos de producto realistas basados en la URL
 */
export function extractProductFromUrl(url: string): {
  title: string;
  price: number;
  image: string;
  description: string;
  variants: string[];
} | null {
  const store = detectStore(url);
  
  if (!store) return null;

  // Simulación de extracción de meta tags
  const mockData = {
    shein: {
      title: 'Vestido Floral de Verano - Estilo Casual',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
      description: 'Hermoso vestido floral perfecto para el verano. Material ligero y cómodo con diseño moderno.',
      variants: ['S', 'M', 'L', 'XL']
    },
    amazon: {
      title: 'Smartwatch Deportivo con GPS',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      description: 'Reloj inteligente con monitor de frecuencia cardíaca, GPS integrado y resistencia al agua.',
      variants: ['Negro', 'Azul', 'Rosa']
    },
    aliexpress: {
      title: 'Lámpara LED Inteligente RGB',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400',
      description: 'Lámpara LED con control remoto, múltiples colores y compatible con asistentes de voz.',
      variants: ['Blanco', 'Negro']
    }
  };

  return mockData[store];
}

/**
 * Genera un link de afiliado simulado
 */
export function generateAffiliateLink(store: Store, productId: string): string {
  const affiliateIds = {
    shein: 'aff_sh_' + Math.random().toString(36).substring(7),
    amazon: 'tag=casillero-20',
    aliexpress: 'aff_trace_key=' + Math.random().toString(36).substring(7)
  };

  const baseUrls = {
    shein: 'https://affiliate.shein.com/track',
    amazon: 'https://www.amazon.com',
    aliexpress: 'https://s.click.aliexpress.com'
  };

  return `${baseUrls[store]}/${productId}?${affiliateIds[store]}`;
}
