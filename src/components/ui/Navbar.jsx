import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, userType, logout } = useAuth();
  const { cartCount, cartTotal } = useCart();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-heading font-bold text-primary-500">
            FoodFusion
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {currentUser ? (
              <>
                {userType === 'customer' && (
                  <>
                    <Link to="/menu" className="text-neutral-700 hover:text-primary-500">
                      Browse Menu
                    </Link>
                    <Link to="/ai-recommend" className="text-neutral-700 hover:text-primary-500 flex items-center">
                      🤖 AI Picks
                    </Link>
                    <Link to="/my-orders" className="text-neutral-700 hover:text-primary-500">
                      My Orders
                    </Link>
                    <Link 
                      to="/cart" 
                      className="relative flex items-center text-neutral-700 hover:text-primary-500"
                    >
                      <FiShoppingCart className="text-xl" />
                      {cartCount > 0 && (
                        <>
                          <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {cartCount}
                          </span>
                          <span className="ml-2 text-sm font-medium">
                            ${cartTotal.toFixed(2)}
                          </span>
                        </>
                      )}
                    </Link>
                  </>
                )}
                
                {userType === 'vendor' && (
                  <Link to="/vendor/dashboard" className="text-neutral-700 hover:text-primary-500">
                    Dashboard
                  </Link>
                )}
                
                <div className="flex items-center space-x-2">
                  <FiUser className="text-neutral-700" />
                  <span className="text-neutral-700">
                    {currentUser.name || (userType === 'vendor' ? currentUser.vendorName : 'User')}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center text-neutral-700 hover:text-accent-500"
                >
                  <FiLogOut className="mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/customer/login" className="text-neutral-700 hover:text-primary-500">
                  Customer Login
                </Link>
                <Link to="/vendor/login" className="text-neutral-700 hover:text-primary-500">
                  Vendor Login
                </Link>
                <Link to="/menu" className="btn btn-primary">
                  Browse Menu
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-neutral-700 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-neutral-200">
            <div className="flex flex-col space-y-4 mt-4">
              {currentUser ? (
                <>
                  <div className="flex items-center space-x-2 py-2">
                    <FiUser className="text-neutral-700" />
                    <span className="text-neutral-700">
                      {currentUser.name || (userType === 'vendor' ? currentUser.vendorName : 'User')}
                    </span>
                  </div>
                  
                  {userType === 'customer' && (
                    <>
                      <Link to="/menu" className="text-neutral-700 py-2" onClick={() => setIsMenuOpen(false)}>
                        Browse Menu
                      </Link>
                      <Link to="/ai-recommend" className="text-neutral-700 py-2" onClick={() => setIsMenuOpen(false)}>
                        🤖 AI Picks
                      </Link>
                      <Link to="/my-orders" className="text-neutral-700 py-2" onClick={() => setIsMenuOpen(false)}>
                        My Orders
                      </Link>
                      <Link
                        to="/cart"
                        className="text-neutral-700 py-2 flex items-center justify-between"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <FiShoppingCart className="mr-2" />
                          Cart
                        </div>
                        {cartCount > 0 && (
                          <div className="flex items-center">
                            <span className="bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2">
                              {cartCount}
                            </span>
                            <span className="font-medium">${cartTotal.toFixed(2)}</span>
                          </div>
                        )}
                      </Link>
                    </>
                  )}
                  
                  {userType === 'vendor' && (
                    <Link to="/vendor/dashboard" className="text-neutral-700 py-2" onClick={() => setIsMenuOpen(false)}>
                      Dashboard
                    </Link>
                  )}
                  
                  <button onClick={handleLogout} className="flex items-center text-neutral-700 py-2">
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/customer/login" className="text-neutral-700 py-2" onClick={() => setIsMenuOpen(false)}>
                    Customer Login
                  </Link>
                  <Link to="/vendor/login" className="text-neutral-700 py-2" onClick={() => setIsMenuOpen(false)}>
                    Vendor Login
                  </Link>
                  <Link to="/menu" className="btn btn-primary mt-2" onClick={() => setIsMenuOpen(false)}>
                    Browse Menu
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
