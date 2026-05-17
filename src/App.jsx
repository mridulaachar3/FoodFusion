import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import CustomerMenuPage from './pages/CustomerMenuPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import VendorDashboardPage from './pages/VendorDashboardPage';
import AIRecommenderPage from './pages/AIRecommenderPage';

// Auth Components
import CustomerLogin from './components/auth/CustomerLogin';
import CustomerRegister from './components/auth/CustomerRegister';
import VendorLogin from './components/auth/VendorLogin';
import VendorRegister from './components/auth/VendorRegister';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<CustomerMenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/ai-recommend" element={<AIRecommenderPage />} />

            {/* Auth Routes */}
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/register" element={<CustomerRegister />} />
            <Route path="/vendor/login" element={<VendorLogin />} />
            <Route path="/vendor/register" element={<VendorRegister />} />

            {/* Protected Customer Routes */}
            <Route path="/payment" element={
              <ProtectedRoute requiredUserType="customer">
                <PaymentPage />
              </ProtectedRoute>
            } />
            <Route path="/order-confirmation" element={
              <ProtectedRoute requiredUserType="customer">
                <OrderConfirmationPage />
              </ProtectedRoute>
            } />
            <Route path="/my-orders" element={
              <ProtectedRoute requiredUserType="customer">
                <OrderHistoryPage />
              </ProtectedRoute>
            } />

            {/* Protected Vendor Routes */}
            <Route path="/vendor/dashboard" element={
              <ProtectedRoute requiredUserType="vendor">
                <VendorDashboardPage />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
