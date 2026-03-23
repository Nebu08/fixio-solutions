import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Nosotros from './pages/Nosotros';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { BlogProvider } from './context/BlogContext';
import { OrderProvider } from './context/OrderContext';
import { PromoProvider } from './context/PromoContext';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <BlogProvider>
          <PromoProvider>
            <OrderProvider>
              <CartProvider>
                <Router>
            <div className="app-container">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogPost />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/nosotros" element={<Nosotros />} />
                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
              </Router>
            </CartProvider>
          </OrderProvider>
        </PromoProvider>
      </BlogProvider>
    </ProductProvider>
    </AuthProvider>
  );
}

export default App;
