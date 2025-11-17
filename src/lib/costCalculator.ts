import { CostBreakdown, RevenueBreakdown } from '@/types/business';

// Fórmulas de cálculo de costos

export const SERVICE_FEE_RATE = 0.12; // 12% del precio del producto
export const AFFILIATE_COMMISSION_RATE = 0.08; // 8% promedio
export const SHIPPING_BASE_RATE = 25; // USD base
export const SHIPPING_PER_KG = 8; // USD por kg
export const CUSTOMS_THRESHOLD = 50; // USD
export const CUSTOMS_RATE = 0.20; // 20% sobre el valor

/**
 * Calcula el costo de envío basado en el peso
 */
export function calculateShippingCost(weightKg: number): number {
  return SHIPPING_BASE_RATE + (weightKg * SHIPPING_PER_KG);
}

/**
 * Calcula los gastos aduanales basados en el valor del producto
 */
export function calculateCustomsFees(productPrice: number): number {
  if (productPrice <= CUSTOMS_THRESHOLD) {
    return 0;
  }
  return (productPrice - CUSTOMS_THRESHOLD) * CUSTOMS_RATE;
}

/**
 * Calcula el desglose completo de costos para el cliente
 */
export function calculateCostBreakdown(
  productPrice: number,
  weightKg: number = 1
): CostBreakdown {
  const serviceFee = productPrice * SERVICE_FEE_RATE;
  const shippingCost = calculateShippingCost(weightKg);
  const customsFees = calculateCustomsFees(productPrice);
  const affiliateCommission = productPrice * AFFILIATE_COMMISSION_RATE;
  
  const total = productPrice + serviceFee + shippingCost + customsFees;

  return {
    productPrice,
    serviceFee,
    shippingCost,
    customsFees,
    affiliateCommission,
    total
  };
}

/**
 * Calcula el desglose de ingresos para el negocio
 */
export function calculateRevenueBreakdown(
  costBreakdown: CostBreakdown,
  actualShippingCost: number = 15 // Costo real de envío
): RevenueBreakdown {
  const affiliateCommission = costBreakdown.affiliateCommission;
  const serviceFee = costBreakdown.serviceFee;
  const shippingMargin = costBreakdown.shippingCost - actualShippingCost;
  const totalProfit = affiliateCommission + serviceFee + shippingMargin;

  return {
    affiliateCommission,
    serviceFee,
    shippingMargin,
    totalProfit
  };
}
