/**
 * Fixio Solutions — Backend API
 * Express.js server para despliegue en Render.com (free tier)
 * Maneja: Autenticación, Mercado Pago, Productos, Órdenes, Banners, Blogs
 */

import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const app = express();
const PORT = process.env.PORT || 3001;
const SITE_URL = process.env.SITE_URL || 'http://localhost:5173';

// ─── MERCADO PAGO ────────────────────────────────────────────────────────────
const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 5000 }
});

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  SITE_URL,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error(`CORS bloqueado para: ${origin}`));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '2mb' }));

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ ok: true, service: 'Fixio Solutions API', version: '1.0.0' }));
app.get('/api', (req, res) => res.json({ ok: true, service: 'Fixio Solutions API', version: '1.0.0' }));

// ─── PAGOS — MERCADO PAGO ────────────────────────────────────────────────────
app.post('/api/payments/preference', async (req, res) => {
  try {
    const { customer, items, total, shippingType } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    if (!process.env.MP_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'Access Token de MercadoPago no configurado' });
    }

    const mpItems = items.map(item => ({
      id: String(item.id),
      title: item.name,
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.price),
      currency_id: 'COP',
      picture_url: item.image || undefined,
      category_id: 'electronics'
    }));

    const siteUrl = SITE_URL.replace(/\/$/, '');

    const preferenceData = {
      items: mpItems,
      payer: {
        name: customer?.name || '',
        email: customer?.email || '',
        phone: {
          area_code: '57',
          number: (customer?.phone || '').replace(/\D/g, '').slice(-7)
        }
      },
      back_urls: {
        success: `${siteUrl}/cart?payment=success`,
        failure: `${siteUrl}/cart?payment=failure`,
        pending: `${siteUrl}/cart?payment=pending`
      },
      auto_return: 'approved',
      statement_descriptor: 'Fixio Solutions',
      external_reference: `FIXIO-${Date.now()}`,
      shipments: shippingType === 'bogota-free'
        ? { mode: 'not_specified', cost: 0 }
        : { mode: 'not_specified' }
    };

    const preference = new Preference(mp);
    const result = await preference.create({ body: preferenceData });

    res.json({
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point
    });

  } catch (err) {
    console.error('[MP Error]', err?.message || err);
    res.status(500).json({
      error: 'Error al crear preferencia de pago',
      detail: err?.message
    });
  }
});

// ─── AUTH (MOCK — reemplazar con DB en producción real) ──────────────────────
const MOCK_ADMIN = {
  id: 'admin-001',
  name: 'Admin Fixio',
  email: process.env.ADMIN_EMAIL || 'admin@fixiosolutions.com',
  password: process.env.ADMIN_PASSWORD || 'admin123',
  role: 'admin'
};

// Registro de usuarios en memoria (se pierde al reiniciar el servidor)
const inMemoryUsers = [];

const makeToken = (user) => {
  // Simple JWT-like payload (base64). Para producción real usar jsonwebtoken + secret.
  const payload = { id: user.id, name: user.name, email: user.email, role: user.role || 'user' };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

const verifyToken = (authHeader) => {
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    return JSON.parse(Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf8'));
  } catch { return null; }
};

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const found = email === MOCK_ADMIN.email && password === MOCK_ADMIN.password
    ? MOCK_ADMIN
    : inMemoryUsers.find(u => u.email === email && u.password === password);

  if (!found) return res.status(401).json({ error: 'Credenciales incorrectas' });
  const { password: _, ...safe } = found;
  res.json({ user: safe, token: makeToken(safe) });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Datos incompletos' });
  if (inMemoryUsers.find(u => u.email === email) || email === MOCK_ADMIN.email) {
    return res.status(409).json({ error: 'El correo ya está registrado' });
  }
  const newUser = { id: `user-${Date.now()}`, name, email, password, role: 'user' };
  inMemoryUsers.push(newUser);
  const { password: _, ...safe } = newUser;
  res.json({ user: safe, token: makeToken(safe) });
});

app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'Token de Google requerido' });

  try {
    // Verificar con Google
    const googleRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );
    const data = await googleRes.json();
    if (!data.email) throw new Error('Token inválido');

    const user = {
      id: `google-${data.sub}`,
      name: data.name,
      email: data.email,
      picture: data.picture,
      role: data.email === MOCK_ADMIN.email ? 'admin' : 'user'
    };
    res.json({ user, token: makeToken(user) });
  } catch (err) {
    res.status(401).json({ error: 'Token de Google inválido', detail: err.message });
  }
});

// ─── ÓRDENES (MOCK) ──────────────────────────────────────────────────────────
const orders = [];

app.post('/api/orders', (req, res) => {
  const order = { ...req.body, id: `ORD-${Date.now()}`, createdAt: new Date().toISOString() };
  orders.push(order);
  res.status(201).json(order);
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.patch('/api/orders/:id/status', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
  order.status = req.body.status;
  res.json(order);
});

// ─── PRODUCTOS (MOCK — datos de ejemplo) ─────────────────────────────────────
let products = [
  { id: '1', name: 'Smart Speaker IA', price: 149900, category: 'Audio', stock: 20, image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400', description: 'Altavoz inteligente con asistente de voz integrado.' },
  { id: '2', name: 'Cámara IP 4K WiFi', price: 189900, category: 'Seguridad', stock: 15, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', description: 'Cámara de seguridad 4K con visión nocturna y detección de movimiento.' },
  { id: '3', name: 'Reloj Smartwatch Pro', price: 299900, category: 'Wearables', stock: 10, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', description: 'Smartwatch con monitor cardíaco, GPS y resistencia al agua.' },
  { id: '4', name: 'Auriculares Inalámbricos NC', price: 259900, category: 'Audio', stock: 25, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', description: 'Auriculares con cancelación activa de ruido y 30h de batería.' },
  { id: '5', name: 'Hub USB-C 8 en 1', price: 89900, category: 'Accesorios', stock: 50, image: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400', description: 'Hub multifuncional con HDMI 4K, USB 3.0, SD Card y carga rápida.' }
];

app.get('/api/products', (req, res) => res.json(products));

app.post('/api/products', (req, res) => {
  const p = { ...req.body, id: String(Date.now()) };
  products.push(p);
  res.status(201).json(p);
});

app.put('/api/products/:id', (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  products[idx] = { ...products[idx], ...req.body, id: req.params.id };
  res.json(products[idx]);
});

app.delete('/api/products/:id', (req, res) => {
  products = products.filter(p => p.id !== req.params.id);
  res.json({ ok: true });
});

// ─── BANNERS (MOCK) ──────────────────────────────────────────────────────────
let banners = [
  { id: '1', title: 'Tecnología para tu hogar', subtitle: 'Los mejores gadgets al mejor precio', image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200', cta: 'Ver catálogo', link: '/catalog', active: true }
];

app.get('/api/banners', (req, res) => res.json(banners));
app.post('/api/banners', (req, res) => { const b = { ...req.body, id: String(Date.now()) }; banners.push(b); res.status(201).json(b); });
app.put('/api/banners/:id', (req, res) => { const idx = banners.findIndex(b => b.id === req.params.id); if (idx === -1) return res.status(404).json({ error: 'Banner no encontrado' }); banners[idx] = { ...req.body, id: req.params.id }; res.json(banners[idx]); });
app.delete('/api/banners/:id', (req, res) => { banners = banners.filter(b => b.id !== req.params.id); res.json({ ok: true }); });

// ─── BLOGS (MOCK) ────────────────────────────────────────────────────────────
let blogs = [];
let comments = {};

app.get('/api/blogs', (req, res) => res.json(blogs));
app.get('/api/blogs/:id', (req, res) => { const b = blogs.find(b => b.id === req.params.id); b ? res.json(b) : res.status(404).json({ error: 'Blog no encontrado' }); });
app.post('/api/blogs', (req, res) => { const b = { ...req.body, id: String(Date.now()), createdAt: new Date().toISOString() }; blogs.push(b); res.status(201).json(b); });
app.put('/api/blogs/:id', (req, res) => { const idx = blogs.findIndex(b => b.id === req.params.id); if (idx === -1) return res.status(404).json({ error: 'Blog no encontrado' }); blogs[idx] = { ...req.body, id: req.params.id }; res.json(blogs[idx]); });
app.delete('/api/blogs/:id', (req, res) => { blogs = blogs.filter(b => b.id !== req.params.id); res.json({ ok: true }); });

app.get('/api/blogs/:id/comments', (req, res) => res.json(comments[req.params.id] || []));
app.post('/api/blogs/:id/comments', (req, res) => {
  const c = { ...req.body, id: String(Date.now()), createdAt: new Date().toISOString() };
  comments[req.params.id] = [...(comments[req.params.id] || []), c];
  res.status(201).json(c);
});

// ─── START ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Fixio Solutions API corriendo en puerto ${PORT}`);
  console.log(`🌐 Frontend permitido: ${SITE_URL}`);
  console.log(`💳 MercadoPago: ${process.env.MP_ACCESS_TOKEN ? '✅ Configurado' : '⚠️ MP_ACCESS_TOKEN no configurado'}`);
});
