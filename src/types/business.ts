// Tipos para la simulación de la lógica de negocio

export type Store = 'shein' | 'amazon' | 'aliexpress';

export type IntegrationMethod = 'api' | 'affiliate' | 'manual' | 'url_extract';

export type OrderStatus = 
  | 'created'           // Orden creada
  | 'pending_payment'   // Pendiente de pago
  | 'payment_confirmed' // Pago confirmado
  | 'purchasing'        // En proceso de compra
  | 'purchased'         // Compra realizada
  | 'transit_brazil'    // En tránsito a Brasil
  | 'arrived_locker'    // Llegada a casillero
  | 'brazil_customs'    // En aduana brasileña
  | 'shipping_venezuela'// Envío a Venezuela
  | 'in_transit'        // En tránsito
  | 'arrived_venezuela' // Llegada a Venezuela
  | 'in_delivery'       // En reparto
  | 'delivered'         // Entregado
  | 'completed';        // Completado

export interface CostBreakdown {
  productPrice: number;      // Precio original del producto
  serviceFee: number;        // Comisión del servicio (12%)
  shippingCost: number;      // Costo de envío Brasil-Venezuela
  customsFees: number;       // Gastos aduanales
  affiliateCommission: number; // Comisión de afiliado (8%)
  total: number;             // Total a pagar por el cliente
}

export interface RevenueBreakdown {
  affiliateCommission: number; // Lo que recibimos del programa de afiliados
  serviceFee: number;         // Nuestra comisión del servicio
  shippingMargin: number;     // Margen en el envío
  totalProfit: number;        // Ganancia total
}

export interface ProductData {
  id: string;
  url: string;
  store: Store;
  integrationMethod: IntegrationMethod;
  title: string;
  price: number;
  currency: string;
  image: string;
  description: string;
  variants: string[];
  weight?: number; // En kg
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  shippingTime: string;
  affiliateLink?: string;
  costBreakdown: CostBreakdown;
  revenueBreakdown: RevenueBreakdown;
  createdAt: string;
}

export interface TrackingEvent {
  id: string;
  status: OrderStatus;
  title: string;
  description: string;
  location: string;
  timestamp: string;
}

export interface Order {
  id: string;
  productId: string;
  customerId: string;
  customerEmail: string;
  status: OrderStatus;
  trackingNumber: string;
  trackingEvents: TrackingEvent[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  costBreakdown: CostBreakdown;
  revenueBreakdown: RevenueBreakdown;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
}

// Catálogos predefinidos por tienda para simulación de APIs
export interface StoreCatalog {
  store: Store;
  categories: string[];
  products: ProductData[];
}
