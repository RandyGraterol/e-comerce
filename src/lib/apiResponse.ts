/**
 * Utilidades para manejar respuestas y errores de manera estándar
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  timestamp: string;
  error?: {
    code: string;
    details?: string;
  };
}

/**
 * Crea una respuesta exitosa estándar
 */
export function createSuccessResponse<T>(data: T, message: string = 'Operación exitosa'): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  };
}

/**
 * Crea una respuesta de error estándar
 */
export function createErrorResponse(
  message: string, 
  code: string = 'ERROR', 
  details?: string
): ApiResponse {
  return {
    success: false,
    message,
    timestamp: new Date().toISOString(),
    error: {
      code,
      details
    }
  };
}

/**
 * Códigos de error predefinidos
 */
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  LOCKER_NOT_AVAILABLE: 'LOCKER_NOT_AVAILABLE',
  LOCKER_NOT_FOUND: 'LOCKER_NOT_FOUND',
  INVALID_URL: 'INVALID_URL',
  EXTRACTION_FAILED: 'EXTRACTION_FAILED',
  STORE_NOT_SUPPORTED: 'STORE_NOT_SUPPORTED',
  INVALID_STATUS: 'INVALID_STATUS',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
} as const;

/**
 * Mensajes de error predefinidos
 */
export const ErrorMessages = {
  [ErrorCodes.VALIDATION_ERROR]: 'Error de validación en los datos proporcionados',
  [ErrorCodes.PRODUCT_NOT_FOUND]: 'Producto no encontrado',
  [ErrorCodes.ORDER_NOT_FOUND]: 'Orden no encontrada',
  [ErrorCodes.LOCKER_NOT_AVAILABLE]: 'Casillero no disponible',
  [ErrorCodes.LOCKER_NOT_FOUND]: 'Casillero no encontrado',
  [ErrorCodes.INVALID_URL]: 'URL inválida o no soportada',
  [ErrorCodes.EXTRACTION_FAILED]: 'No se pudo extraer información del producto',
  [ErrorCodes.STORE_NOT_SUPPORTED]: 'Tienda no soportada',
  [ErrorCodes.INVALID_STATUS]: 'Estado de orden inválido',
  [ErrorCodes.INTERNAL_ERROR]: 'Error interno del sistema'
} as const;

/**
 * Valida si un objeto tiene las propiedades requeridas
 */
export function validateRequired<T extends object>(
  obj: T, 
  requiredFields: (keyof T)[]
): { valid: boolean; missing?: string[] } {
  const missing = requiredFields.filter(field => !obj[field]);
  
  if (missing.length > 0) {
    return { valid: false, missing: missing.map(String) };
  }
  
  return { valid: true };
}

/**
 * Simula delay de respuesta de API
 */
export async function simulateApiDelay(min: number = 300, max: number = 800): Promise<void> {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}
