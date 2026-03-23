import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { usePromos } from '../context/PromoContext';
import { useBlog } from '../context/BlogContext';
import { PackageSearch, ShoppingCart, Image as ImageIcon, FileText, Plus, Edit2, Trash2, X } from 'lucide-react';
import Button from '../components/ui/Button';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders' | 'banners' | 'blogs'
  
  // Contexts
  const { products, addProduct, updateProduct, deleteProduct, categories } = useProducts();
  const { orders, updateOrderStatus } = useOrders();
  const { promos, addPromo, updatePromo, deletePromo } = usePromos();
  const { posts, addPost, updatePost, deletePost } = useBlog();

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Forms state
  const [productForm, setProductForm] = useState({
    name: '', price: '', originalPrice: '', category: categories[0] || '',
    stock: '', description: '', image: '', featured: false
  });

  const [bannerForm, setBannerForm] = useState({
    image: '', title: '', subtitle: '', link: '', cta_text: ''
  });

  const [blogForm, setBlogForm] = useState({
    title: '', excerpt: '', content: '', image: '', author: 'Admin'
  });

  // --- Handlers: Products ---
  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name, price: product.price, 
        originalPrice: product.originalPrice || '', 
        category: product.category, stock: product.stock, 
        description: product.description || '', 
        image: product.image || '', featured: product.featured || false
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '', price: '', originalPrice: '', category: categories[0] || '',
        stock: '', description: '', image: '', featured: false
      });
    }
    setIsProductModalOpen(true);
  };
  const closeProductModal = () => setIsProductModalOpen(false);
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) await updateProduct(editingProduct.id, productForm);
      else await addProduct(productForm);
      closeProductModal();
    } catch (error) { alert('Error: ' + error.message); }
  };
  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Borrar este producto?')) await deleteProduct(id);
  };

  // --- Handlers: Orders ---
  const handleStatusChange = async (orderId, status) => {
    const res = await updateOrderStatus(orderId, status);
    if (!res.success) alert('Error: ' + res.error);
  };

  // --- Handlers: Banners ---
  const openBannerModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setBannerForm({
        image: banner.image, title: banner.title || '', subtitle: banner.subtitle || '',
        link: banner.link || '', cta_text: banner.cta_text || ''
      });
    } else {
      setEditingBanner(null);
      setBannerForm({ image: '', title: '', subtitle: '', link: '', cta_text: '' });
    }
    setIsBannerModalOpen(true);
  };
  const closeBannerModal = () => setIsBannerModalOpen(false);
  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBanner) await updatePromo(editingBanner.id, bannerForm);
      else await addPromo(bannerForm);
      closeBannerModal();
    } catch (err) { alert('Error: ' + err.message); }
  };
  const handleDeleteBanner = async (id) => {
    if (window.confirm('¿Borrar banner?')) await deletePromo(id);
  };

  // --- Handlers: Blogs ---
  const openBlogModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setBlogForm({
        title: blog.title, excerpt: blog.excerpt || '', content: blog.content,
        image: blog.image || '', author: blog.author || 'Admin'
      });
    } else {
      setEditingBlog(null);
      setBlogForm({ title: '', excerpt: '', content: '', image: '', author: 'Admin' });
    }
    setIsBlogModalOpen(true);
  };
  const closeBlogModal = () => setIsBlogModalOpen(false);
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBlog) await updatePost(editingBlog.id, blogForm);
      else await addPost(blogForm);
      closeBlogModal();
    } catch (err) { alert('Error: ' + err.message); }
  };
  const handleDeleteBlog = async (id) => {
    if (window.confirm('¿Borrar artículo?')) await deletePost(id);
  };

  const handleFormChange = (setter) => (e) => {
    const { name, value, type, checked } = e.target;
    setter(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div className="admin-dashboard animate-fade-in">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <p>Gestiona catálogo, órdenes, banners hero y artículos del blog.</p>
      </div>

      <div className="admin-tabs">
        <button className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
          <PackageSearch size={20} /> Inventario
        </button>
        <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          <ShoppingCart size={20} /> Órdenes
        </button>
        <button className={`tab-btn ${activeTab === 'banners' ? 'active' : ''}`} onClick={() => setActiveTab('banners')}>
          <ImageIcon size={20} /> Banners
        </button>
        <button className={`tab-btn ${activeTab === 'blogs' ? 'active' : ''}`} onClick={() => setActiveTab('blogs')}>
          <FileText size={20} /> Blog
        </button>
      </div>

      <div className="admin-content glass">
        {/* TAB: INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="inventory-section">
            <div className="section-header">
              <h2>Catálogo de Productos</h2>
              <Button variant="primary" onClick={() => openProductModal()}>
                <Plus size={18} style={{ marginRight: '0.5rem' }} /> Nuevos Audífonos
              </Button>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                    <th>Precio</th>
                    <th>Destacado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="col-id">{p.id.split('-')[1] || p.id}</td>
                      <td>
                        <div className="product-cell">
                          <img src={p.image || 'https://via.placeholder.com/40'} alt={p.name} />
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td>{p.category}</td>
                      <td className={`stock ${p.stock <= 5 ? 'low' : ''}`}>{p.stock} u.</td>
                      <td>${p.price.toFixed(2)}</td>
                      <td>{p.featured ? 'Sí' : 'No'}</td>
                      <td className="actions-cell">
                        <button className="action-btn edit" onClick={() => openProductModal(p)}><Edit2 size={16} /></button>
                        <button className="action-btn delete" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan="7" className="empty-state">No hay productos.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: ORDERS */}
        {activeTab === 'orders' && (
          <div className="orders-section">
            <div className="section-header"><h2>Órdenes Recientes</h2></div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Orden ID</th>
                    <th>Cliente</th>
                    <th>Ciudad</th>
                    <th>Total</th>
                    <th>Fecha</th>
                    <th>Estado de Envío</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td className="col-id">{o.id}</td>
                      <td>
                        <div className="customer-cell">
                          <strong>{o.customer.name}</strong>
                          <small>{o.customer.email}</small>
                        </div>
                      </td>
                      <td>{o.shippingCity}</td>
                      <td>${o.total.toFixed(2)}</td>
                      <td>{new Date(o.date).toLocaleDateString()}</td>
                      <td>
                        <select 
                          className={`status-select status-${o.status.toLowerCase().replace(' ', '-')}`}
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        >
                          <option value="Recibido">Recibido</option>
                          <option value="En camino">En camino</option>
                          <option value="Entregado">Entregado</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan="6" className="empty-state">No hay órdenes.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: BANNERS */}
        {activeTab === 'banners' && (
          <div className="banners-section">
            <div className="section-header">
              <h2>Carrusel Principal</h2>
              <Button variant="primary" onClick={() => openBannerModal()}>
                <Plus size={18} style={{ marginRight: '0.5rem' }} /> Nuevo Banner
              </Button>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Título</th>
                    <th>Subtítulo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {promos.map(b => (
                    <tr key={b.id}>
                      <td className="col-id">{b.id.split('-')[1] || b.id}</td>
                      <td>
                        <img src={b.image} alt="Banner" style={{ width: '120px', height: 'auto', borderRadius: '0.5rem' }} />
                      </td>
                      <td>{b.title || '-'}</td>
                      <td>{b.subtitle || '-'}</td>
                      <td className="actions-cell">
                        <button className="action-btn edit" onClick={() => openBannerModal(b)}><Edit2 size={16} /></button>
                        <button className="action-btn delete" onClick={() => handleDeleteBanner(b.id)}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                  {promos.length === 0 && (
                    <tr><td colSpan="5" className="empty-state">No hay banners publicados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: BLOGS */}
        {activeTab === 'blogs' && (
          <div className="blogs-section">
            <div className="section-header">
              <h2>Artículos del Blog</h2>
              <Button variant="primary" onClick={() => openBlogModal()}>
                <Plus size={18} style={{ marginRight: '0.5rem' }} /> Nuevo Artículo
              </Button>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Artículo</th>
                    <th>Autor/Fecha</th>
                    <th>Comentarios</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id}>
                      <td className="col-id">{post.id.split('-')[1] || post.id}</td>
                      <td>
                        <div className="product-cell">
                          {post.image && <img src={post.image} alt={post.title} />}
                          <span>{post.title}</span>
                        </div>
                      </td>
                      <td>
                        <div className="customer-cell">
                          <strong>{post.author}</strong>
                          <small>{new Date(post.date).toLocaleDateString()}</small>
                        </div>
                      </td>
                      <td>{post.comments ? post.comments.length : 0} comments</td>
                      <td className="actions-cell">
                        <button className="action-btn edit" onClick={() => openBlogModal(post)}><Edit2 size={16} /></button>
                        <button className="action-btn delete" onClick={() => handleDeleteBlog(post.id)}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr><td colSpan="5" className="empty-state">No hay artículos publicados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      {isProductModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header">
              <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button className="close-btn" onClick={closeProductModal}><X size={24} /></button>
            </div>
            <form className="admin-form" onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label>Nombre del Producto *</label>
                <input type="text" name="name" value={productForm.name} onChange={handleFormChange(setProductForm)} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Precio de Venta ($) *</label>
                  <input type="number" step="0.01" name="price" value={productForm.price} onChange={handleFormChange(setProductForm)} required />
                </div>
                <div className="form-group">
                  <label>Precio Original Tachado ($)</label>
                  <input type="number" step="0.01" name="originalPrice" value={productForm.originalPrice} onChange={handleFormChange(setProductForm)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Categoría *</label>
                  <select name="category" value={productForm.category} onChange={handleFormChange(setProductForm)} required>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="Otra">Otra...</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input type="number" name="stock" value={productForm.stock} onChange={handleFormChange(setProductForm)} required min="0" />
                </div>
              </div>
              <div className="form-group">
                <label>URL de Imagen</label>
                <input type="url" name="image" value={productForm.image} onChange={handleFormChange(setProductForm)} placeholder="https://ejemplo.com/imagen.jpg" />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea name="description" rows="3" value={productForm.description} onChange={handleFormChange(setProductForm)}></textarea>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" name="featured" checked={productForm.featured} onChange={handleFormChange(setProductForm)} /> Destacar en portada
                </label>
              </div>
              <div className="modal-actions">
                <Button variant="outline" type="button" onClick={closeProductModal}>Cancelar</Button>
                <Button variant="primary" type="submit">Guardar</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBannerModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header">
              <h2>{editingBanner ? 'Editar Banner' : 'Nuevo Banner'}</h2>
              <button className="close-btn" onClick={closeBannerModal}><X size={24} /></button>
            </div>
            <form className="admin-form" onSubmit={handleBannerSubmit}>
              <div className="form-group">
                <label>URL de Imagen *</label>
                <input type="url" name="image" value={bannerForm.image} onChange={handleFormChange(setBannerForm)} required placeholder="https://ejemplo.com/banner.jpg" />
              </div>
              <div className="form-group">
                <label>Título (OPCIONAL)</label>
                <input type="text" name="title" value={bannerForm.title} onChange={handleFormChange(setBannerForm)} />
              </div>
              <div className="form-group">
                <label>Subtítulo (OPCIONAL)</label>
                <input type="text" name="subtitle" value={bannerForm.subtitle} onChange={handleFormChange(setBannerForm)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Enlace del botón (e.g. /catalog)</label>
                  <input type="text" name="link" value={bannerForm.link} onChange={handleFormChange(setBannerForm)} />
                </div>
                <div className="form-group">
                  <label>Texto del botón</label>
                  <input type="text" name="cta_text" value={bannerForm.cta_text} onChange={handleFormChange(setBannerForm)} />
                </div>
              </div>
              <div className="modal-actions">
                <Button variant="outline" type="button" onClick={closeBannerModal}>Cancelar</Button>
                <Button variant="primary" type="submit">Guardar</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBlogModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header">
              <h2>{editingBlog ? 'Editar Artículo' : 'Nuevo Artículo'}</h2>
              <button className="close-btn" onClick={closeBlogModal}><X size={24} /></button>
            </div>
            <form className="admin-form" onSubmit={handleBlogSubmit}>
              <div className="form-group">
                <label>Título *</label>
                <input type="text" name="title" value={blogForm.title} onChange={handleFormChange(setBlogForm)} required />
              </div>
              <div className="form-group">
                <label>URL de Imagen Principal</label>
                <input type="url" name="image" value={blogForm.image} onChange={handleFormChange(setBlogForm)} />
              </div>
              <div className="form-group">
                <label>Resumen Corto</label>
                <textarea name="excerpt" rows="2" value={blogForm.excerpt} onChange={handleFormChange(setBlogForm)}></textarea>
              </div>
              <div className="form-group">
                <label>Contenido del Artículo (Admite HTML) *</label>
                <textarea name="content" rows="6" value={blogForm.content} onChange={handleFormChange(setBlogForm)} required></textarea>
              </div>
              <div className="form-group">
                <label>Autor</label>
                <input type="text" name="author" value={blogForm.author} onChange={handleFormChange(setBlogForm)} />
              </div>
              <div className="modal-actions">
                <Button variant="outline" type="button" onClick={closeBlogModal}>Cancelar</Button>
                <Button variant="primary" type="submit">Guardar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
