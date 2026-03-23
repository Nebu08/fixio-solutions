/**
 * Payment Service - Fixio Solutions
 * Módulo de integración con MercadoPago.
 * El flujo actual es simulado. Al tener backend, solo se
 * conecta createPreference() a la API real.
 *
 * Flujo de integración real (cuando haya backend):
 * 1. Frontend llama createPreference(orderData) → backend crea preferencia en MP
 * 2. Backend retorna { preferenceId, initPoint } 
 * 3. Frontend carga el SDK de MP y renderiza el botón, o redirige a initPoint
 * 4. Usuario paga en MercadoPago
 * 5. MP notifica al backend vía webhook → backend actualiza estado del pedido
 * 6. Frontend polling o notificación en tiempo real del estado
 */

import { createPaymentPreference } from './api';

// ─── CONFIGURACIÓN ─────────────────────────────────────────────────────────

// TODO: cuando tengas backend, pon tu Public Key de MP aquí (no secret key)
const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY || null;
const MP_SDK_URL = 'https://sdk.mercadopago.com/js/v2';

// ─── SDK LOADER ────────────────────────────────────────────────────────────

let mpInstance = null;

/**
 * Carga el SDK de MercadoPago de forma lazy.
 * @returns {Promise<object>} Instancia de MercadoPago
 */
export const loadMercadoPago = () => {
  return new Promise((resolve, reject) => {
    if (mpInstance) return resolve(mpInstance);
    if (!MP_PUBLIC_KEY) {
      // Modo mock: sin SDK
      resolve({ isMock: true });
      return;
    }

    if (window.MercadoPago) {
      mpInstance = new window.MercadoPago(MP_PUBLIC_KEY);
      return resolve(mpInstance);
    }

    const script = document.createElement('script');
    script.src = MP_SDK_URL;
    script.onload = () => {
      mpInstance = new window.MercadoPago(MP_PUBLIC_KEY);
      resolve(mpInstance);
    };
    script.onerror = () => reject(new Error('No se pudo cargar el SDK de MercadoPago'));
    document.head.appendChild(script);
  });
};

// ─── MAIN FUNCTIONS ────────────────────────────────────────────────────────

/**
 * Inicia el flujo de pago con MercadoPago.
 * @param {object} orderData - Datos del pedido
 * @param {Function} onSuccess - Callback cuando el pago es exitoso (mock)
 * @param {Function} onPending - Callback cuando el pago queda pendiente
 * @param {Function} onError - Callback cuando hay un error
 * @returns {Promise<{preferenceId: string, isMock: boolean}>}
 */
export const initiatePayment = async (orderData, { onSuccess, onPending, onError } = {}) => {
  try {
    const preference = await createPaymentPreference(orderData);

    if (preference.isMock) {
      // Flujo simulado para desarrollo
      return {
        preferenceId: preference.preferenceId,
        isMock: true,
        simulate: async () => {
          // Simula 1.5s de "procesando pago"
          await new Promise(r => setTimeout(r, 1500));
          onSuccess?.({ status: 'approved', paymentId: `PAY-MOCK-${Date.now()}` });
        }
      };
    }

    // Flujo real: redirige al checkout de MercadoPago
    if (preference.initPoint) {
      window.location.href = preference.initPoint;
    }

    return preference;
  } catch (error) {
    onError?.(error);
    throw error;
  }
};

/**
 * Helper para formatear montos en COP.
 * @param {number} amount
 * @returns {string} Ej: "$150.000"
 */
export const formatCOP = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount);
};

/**
 * Helper para formatear montos en USD.
 * @param {number} amount
 */
export const formatUSD = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// ─── CONSTANTES DE ESTADO ──────────────────────────────────────────────────

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  IN_PROCESS: 'in_process',
  CANCELLED: 'cancelled'
};

export const SHIPPING_TYPES = {
  BOGOTA_FREE: 'bogota-free',
  CARRIER: 'carrier'
};
