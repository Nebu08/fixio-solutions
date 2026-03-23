/**
 * API Service - Fixio Solutions
 * Capa de abstracción para comunicación con el backend.
 * Actualmente retorna datos mock. Al conectar el backend,
 * solo se cambia la BASE_URL y se eliminan los mocks.
 */

// En producción: VITE_API_URL apunta al backend en Render.com
// En desarrollo: usa localhost:3001
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');

const headers = () => {
  const token = localStorage.getItem('fixio_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'Error en la solicitud');
  }
  return res.json();
};

// ─── AUTH ──────────────────────────────────────────────────────────────────

/**
 * Verifica un token de Google con el backend.
 * @param {string} credential - JWT de Google Identity Services
 * @returns {Promise<{user: object, token: string}>}
 */
export const verifyGoogleToken = async (credential) => {
  return fetch(`${BASE_URL}/auth/google`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ credential })
  }).then(handleResponse);
};

/**
 * Login con email/password en el backend.
 * @param {string} email
 * @param {string} password
 */
export const loginWithEmail = async (email, password) => {
  return fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password })
  }).then(handleResponse);
};

/**
 * Registro con email/password en el backend.
 */
export const registerWithEmail = async (userData) => {
  return fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(userData)
  }).then(handleResponse);
};

// ─── ORDERS ────────────────────────────────────────────────────────────────

/**
 * Crea una orden en el backend.
 * @param {object} orderData
 * @returns {Promise<{order: object}>}
 */
export const createOrder = async (orderData) => {
  return fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(orderData)
  }).then(handleResponse);
};

/**
 * Obtiene las órdenes de un usuario.
 * @param {string} userId
 */
export const getUserOrders = async (userId) => {
  return fetch(`${BASE_URL}/orders`, {
    method: 'GET',
    headers: headers()
  }).then(handleResponse);
};

export const updateOrderStatus = async (orderId, status) => {
  return fetch(`${BASE_URL}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ status })
  }).then(handleResponse);
};

// ─── PAYMENTS ──────────────────────────────────────────────────────────────

/**
 * Crea una preferencia de pago en MercadoPago vía backend.
 * @param {object} orderData
 * @returns {Promise<{preferenceId: string, initPoint: string}>}
 */
export const createPaymentPreference = async (orderData) => {
  return fetch(`${BASE_URL}/payments/preference`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(orderData)
  }).then(handleResponse);
};

/**
 * Verifica el estado de un pago (webhook o polling).
 * @param {string} paymentId
 */
export const getPaymentStatus = async (paymentId) => {
  // TODO: llamada real al backend
  return { status: 'pending', paymentId };
};

// ─── PRODUCTS ──────────────────────────────────────────────────────────────

/**
 * Obtiene el catálogo de productos desde el backend.
 */
export const getProducts = async () => {
  return fetch(`${BASE_URL}/products`, {
    method: 'GET',
    headers: headers()
  }).then(handleResponse);
};

/**
 * Sincroniza el stock de productos con el backend.
 * @param {Array<{id: string, quantity: number}>} items
 */
export const updateProductStock = async (items) => {
  // TODO: llamada real al backend
  return { success: true, isMock: true };
};

// --- ADMIN PRODUCTS ---
export const createSystemProduct = async (productData) => {
  return fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(productData)
  }).then(handleResponse);
};

export const updateSystemProduct = async (id, productData) => {
  return fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(productData)
  }).then(handleResponse);
};

export const deleteSystemProduct = async (id) => {
  return fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: headers()
  }).then(handleResponse);
};

// ─── BANNERS ───────────────────────────────────────────────────────────────
export const getBanners = async () => {
  return fetch(`${BASE_URL}/banners`).then(handleResponse);
};
export const createBanner = async (data) => {
  return fetch(`${BASE_URL}/banners`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);
};
export const updateBanner = async (id, data) => {
  return fetch(`${BASE_URL}/banners/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);
};
export const deleteBanner = async (id) => {
  return fetch(`${BASE_URL}/banners/${id}`, { method: 'DELETE', headers: headers() }).then(handleResponse);
};

// ─── BLOGS ─────────────────────────────────────────────────────────────────
export const getBlogs = async () => {
  return fetch(`${BASE_URL}/blogs`).then(handleResponse);
};
export const getBlogById = async (id) => {
  return fetch(`${BASE_URL}/blogs/${id}`).then(handleResponse);
};
export const createBlog = async (data) => {
  return fetch(`${BASE_URL}/blogs`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);
};
export const updateBlog = async (id, data) => {
  return fetch(`${BASE_URL}/blogs/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);
};
export const deleteBlog = async (id) => {
  return fetch(`${BASE_URL}/blogs/${id}`, { method: 'DELETE', headers: headers() }).then(handleResponse);
};

// --- BLOG COMMENTS ---
export const getBlogComments = async (blogId) => {
  return fetch(`${BASE_URL}/blogs/${blogId}/comments`).then(handleResponse);
};
export const createBlogComment = async (blogId, content) => {
  return fetch(`${BASE_URL}/blogs/${blogId}/comments`, { method: 'POST', headers: headers(), body: JSON.stringify({ content }) }).then(handleResponse);
};
