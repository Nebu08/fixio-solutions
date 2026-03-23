import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Trash2, ArrowRight, ArrowLeft, LogIn, UserPlus, MapPin, CheckCircle, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { initiatePayment } from '../services/payment';
import Button from '../components/ui/Button';
import { X } from 'lucide-react';
import './Cart.css';

const isBogota = (city) => {
  if (!city) return false;
  return city.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 'bogota';
};

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { decreaseStock } = useProducts();
  const { addOrder } = useOrders();
  const { currentUser, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentState, setPaymentState] = useState('idle'); // idle | processing | success | failure | pending
  const [completedOrder, setCompletedOrder] = useState(null);

  // Manejar retorno desde MercadoPago (back_urls)
  useEffect(() => {
    const mpPayment = searchParams.get('payment');
    if (mpPayment === 'success') {
      setPaymentState('success');
      setCompletedOrder({ id: `MP-${Date.now()}` });
      // Limpiar el carrito al volver exitosamente de MP
      clearCart();
      // Limpiar query params de la URL sin recargar
      navigate('/cart', { replace: true });
    } else if (mpPayment === 'failure') {
      setPaymentState('failure');
      navigate('/cart', { replace: true });
    } else if (mpPayment === 'pending') {
      setPaymentState('pending');
      navigate('/cart', { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [customerData, setCustomerData] = useState({
    name: '', email: '', phone: '', address: '', city: ''
  });

  useEffect(() => {
    if (currentUser) {
      setCustomerData(prev => ({
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        address: currentUser.address || prev.address,
        city: prev.city
      }));
    }
  }, [currentUser]);

  // Lógica de envío: Bogotá = gratis, otra ciudad = transportadora
  const cityIsBogota = isBogota(customerData.city);
  const shippingType = customerData.city
    ? (cityIsBogota ? 'bogota-free' : 'carrier')
    : null;

  // Sin impuestos — precios ya los incluyen
  const total = cartTotal;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setPaymentState('processing');

    const order = {
      customer: customerData,
      items: cart,
      subtotal: cartTotal.toFixed(2),
      total: total.toFixed(2),
      shippingType,
      shippingCity: customerData.city,
      userId: currentUser?.id || null,
      paymentMethod: 'mercadopago'
    };

    // Iniciar flujo de pago (simulado actualmente)
    try {
      const payment = await initiatePayment(order, {
        onSuccess: async (paymentResult) => {
          try {
            const newOrder = await addOrder({ ...order, paymentId: paymentResult.paymentId, status: 'Recibido' });
            // remove locally, backend already discounted it
            clearCart();
            setCompletedOrder(newOrder);
            setPaymentState('success');

          // También notificar por WhatsApp
          const adminPhone = '573116860336';
          let msg = `🛒 Nuevo Pedido Fixio! (${newOrder.id})\n\n`;
          msg += `Cliente: ${customerData.name}\nTel: ${customerData.phone}\nCiudad: ${customerData.city}\n\n`;
          cart.forEach(item => {
            msg += `• ${item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}\n`;
          });
          msg += `\nTotal: $${total.toFixed(2)}\nEnvío: ${cityIsBogota ? 'Gratis (Bogotá)' : 'Por transportadora'}\n`;
          msg += `\nDirección: ${customerData.address}`;
          const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`;
          setTimeout(() => window.open(waUrl, '_blank'), 800);
          } catch (err) {
            console.error(err);
            setPaymentState('idle');
            alert('Error al procesar la orden en nuestro sistema. Contáctanos.');
          }
        },
        onError: (err) => {
          setPaymentState('idle');
          alert('Error al procesar el pago. Intenta de nuevo.');
        }
      });

      // Si es mock, lanzar la simulación
      if (payment?.isMock && payment?.simulate) {
        await payment.simulate();
      }
    } catch (err) {
      setPaymentState('idle');
    }
  };

  // Pantalla de pago fallido
  if (paymentState === 'failure') {
    return (
      <div className="cart-page empty container animate-fade-in">
        <div className="order-success-card glass" style={{ backgroundColor: 'var(--color-surface-1)' }}>
          <div className="order-success-icon" style={{ color: '#e53e3e' }}>
            <X size={52} />
          </div>
          <h2>Pago no completado</h2>
          <p>Hubo un problema al procesar tu pago. Puedes intentarlo de nuevo.</p>
          <div className="order-success-actions">
            <Button variant="primary" onClick={() => setPaymentState('idle')}>Intentar de nuevo</Button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de pago pendiente
  if (paymentState === 'pending') {
    return (
      <div className="cart-page empty container animate-fade-in">
        <div className="order-success-card glass" style={{ backgroundColor: 'var(--color-surface-1)' }}>
          <div className="order-success-icon" style={{ color: '#d69e2e' }}>
            <Loader size={52} />
          </div>
          <h2>Pago en proceso</h2>
          <p>Tu pago está siendo procesado. Te notificaremos cuando se confirme.</p>
          <div className="order-success-actions">
            <Button variant="secondary" onClick={() => navigate('/catalog')}>Ir al catálogo</Button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && paymentState !== 'success') {
    return (
      <div className="cart-page empty container animate-fade-in">
        <div className="empty-cart-message glass" style={{ backgroundColor: 'var(--color-surface-1)' }}>
          <h2>Tu carrito está vacío</h2>
          <p>Aún no has agregado productos a tu carrito.</p>
          <Link to="/catalog">
            <Button variant="primary" size="lg">Ir al Catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Pantalla de éxito post-pago
  if (paymentState === 'success' && completedOrder) {
    return (
      <div className="cart-page empty container animate-fade-in">
        <div className="order-success-card glass" style={{ backgroundColor: 'var(--color-surface-1)' }}>
          <div className="order-success-icon">
            <CheckCircle size={52} />
          </div>
          <h2>¡Pedido Recibido!</h2>
          <p className="order-success-id">Orden <strong>{completedOrder.id}</strong></p>
          <p>Gracias por tu compra. Te contactaremos pronto para confirmar los detalles.</p>
          {shippingType === 'carrier' && (
            <p className="order-shipping-note">
              📦 Tu pedido se enviará por <strong>transportadora</strong>. Nuestro equipo te informará el costo y tiempo estimado.
            </p>
          )}
          {shippingType === 'bogota-free' && (
            <p className="order-shipping-note">
              🛵 Entrega <strong>gratis en Bogotá</strong>. Coordinaremos la fecha contigo.
            </p>
          )}
          <div className="order-success-actions">
            <Button variant="primary" onClick={() => navigate('/catalog')}>Seguir Comprando</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container animate-fade-in">
      <h1 className="page-title">Carrito de Compras</h1>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items-container glass" style={{ backgroundColor: 'var(--color-surface-1)' }}>
          <div className="cart-table-header">
            <div className="col-product">Producto</div>
            <div className="col-price">Precio</div>
            <div className="col-qty">Cantidad</div>
            <div className="col-total">Total</div>
            <div className="col-action"></div>
          </div>

          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="col-product item-info">
                  <img src={item.image} alt={item.name} className="item-image" style={{ backgroundColor: 'var(--color-surface-2)' }} />
                  <div>
                    <h3 className="item-name">
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </h3>
                    <p className="item-category">{item.category}</p>
                  </div>
                </div>
                <div className="col-price item-price">${item.price.toFixed(2)}</div>
                <div className="col-qty item-qty">
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="col-total item-total">${(item.price * item.quantity).toFixed(2)}</div>
                <div className="col-action">
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)} aria-label="Eliminar">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <Link to="/catalog" className="continue-shopping">
              <ArrowLeft size={16} /> Continuar Comprando
            </Link>
          </div>
        </div>

        {/* Resumen */}
        <div className="cart-summary glass" style={{ backgroundColor: 'var(--color-surface-1)' }}>
          <h2>Resumen del Pedido</h2>

          <div className="summary-row">
            <span>{cart.length} {cart.length === 1 ? 'producto' : 'productos'}</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>IVA incluido en precios</span>
            <span>✓</span>
          </div>

          {/* Fila de envío dinámica */}
          <div className="summary-row shipping-row">
            <span><MapPin size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />Envío</span>
            <span className={`shipping-status ${shippingType}`}>
              {!customerData.city && <em className="shipping-pending">Ingresa ciudad al pagar</em>}
              {shippingType === 'bogota-free' && <strong className="shipping-free">¡Gratis en Bogotá!</strong>}
              {shippingType === 'carrier' && <span className="shipping-carrier">Por transportadora</span>}
            </span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row total-row">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {isLoggedIn ? (
            <Button variant="primary" fullWidth size="lg" className="checkout-btn" onClick={() => setIsCheckingOut(true)}>
              Proceder al Pago <ArrowRight size={18} />
            </Button>
          ) : (
            <div className="checkout-auth-prompt">
              <p>Inicia sesión para completar tu compra</p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Button variant="primary" fullWidth size="lg"
                  onClick={() => navigate('/login', { state: { from: '/cart' } })}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <LogIn size={18} /> Iniciar Sesión
                </Button>
                <Button variant="secondary" fullWidth size="lg"
                  onClick={() => navigate('/register', { state: { from: '/cart' } })}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <UserPlus size={18} /> Crear Cuenta
                </Button>
              </div>
            </div>
          )}

          <div className="secure-checkout">
            <p>Pago Seguro · SSL · MercadoPago</p>
          </div>
        </div>
      </div>

      {/* Modal de Checkout */}
      {isCheckingOut && (
        <div className="cart-modal-overlay">
          <div className="cart-modal-content glass animate-slide-up">
            <div className="cart-modal-header">
              <h2>Detalles de Entrega</h2>
              <button className="close-btn" onClick={() => setIsCheckingOut(false)} disabled={paymentState === 'processing'}>
                <X size={24} />
              </button>
            </div>

            <form className="cart-checkout-form" onSubmit={handleCheckoutSubmit}>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input type="text" required value={customerData.name}
                  onChange={e => setCustomerData({ ...customerData, name: e.target.value })}
                  placeholder="Juan Pérez" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Correo Electrónico</label>
                  <input type="email" required value={customerData.email}
                    onChange={e => setCustomerData({ ...customerData, email: e.target.value })}
                    placeholder="juan@email.com" />
                </div>
                <div className="form-group">
                  <label>Teléfono (WhatsApp)</label>
                  <input type="tel" required value={customerData.phone}
                    onChange={e => setCustomerData({ ...customerData, phone: e.target.value })}
                    placeholder="+57 310 123 4567" />
                </div>
              </div>

              {/* Ciudad — determina el tipo de envío */}
              <div className="form-group">
                <label>Ciudad de Entrega</label>
                <input type="text" required value={customerData.city}
                  onChange={e => setCustomerData({ ...customerData, city: e.target.value })}
                  placeholder="Bogotá, Medellín, Cali..." />
                {customerData.city && (
                  <p className="field-hint">
                    {cityIsBogota
                      ? '🛵 ¡Envío gratis en Bogotá!'
                      : '📦 Envío por transportadora — te informaremos costo y tiempo.'}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>Dirección de Entrega</label>
                <textarea required rows="2"
                  value={customerData.address}
                  onChange={e => setCustomerData({ ...customerData, address: e.target.value })}
                  placeholder="Calle, Número, Barrio..." />
              </div>

              <div className="cart-modal-footer">
                <div className="checkout-summary-mini">
                  <span>Total a pagar:</span>
                  <strong>${total.toFixed(2)}</strong>
                </div>
                {shippingType === 'carrier' && (
                  <p className="checkout-shipping-note">
                    + Costo de transportadora (te contactaremos)
                  </p>
                )}
                {shippingType === 'bogota-free' && (
                  <p className="checkout-shipping-note free">
                    🎉 Envío incluido (Bogotá)
                  </p>
                )}

                <div className="checkout-mp-banner">
                  <img src="https://http2.mlstatic.com/frontend-assets/mp-melidata/logos/mercadópago-colorful.svg"
                    alt="MercadoPago"
                    onError={(e) => { e.target.style.display = 'none'; }}
                    style={{ height: '22px' }} />
                  <span>Pago seguro con MercadoPago</span>
                </div>

                <div className="checkout-actions">
                  <Button type="button" variant="secondary" onClick={() => setIsCheckingOut(false)} disabled={paymentState === 'processing'}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" disabled={paymentState === 'processing'}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {paymentState === 'processing' ? (
                      <><Loader size={16} className="spin" /> Procesando...</>
                    ) : (
                      <>Confirmar y Pagar</>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
