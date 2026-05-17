import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-800 text-white pt-10 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-primary-400 mb-4">FoodFusion</h3>
            <p className="text-neutral-400 mb-4">
              Connecting food lovers with their favorite restaurants for a seamless delivery experience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors" aria-label="Instagram">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors" aria-label="Twitter">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors" aria-label="Facebook">
                <FiFacebook size={20} />
              </a>
            </div>
          </div>
          
          {/* For Customers */}
          <div>
            <h4 className="text-lg font-semibold mb-4">For Customers</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/menu" className="text-neutral-400 hover:text-white transition-colors">
                  Browse Menu
                </Link>
              </li>
              <li>
                <Link to="/customer/register" className="text-neutral-400 hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/customer/login" className="text-neutral-400 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          
          {/* For Vendors */}
          <div>
            <h4 className="text-lg font-semibold mb-4">For Vendors</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/vendor/register" className="text-neutral-400 hover:text-white transition-colors">
                  Become a Partner
                </Link>
              </li>
              <li>
                <Link to="/vendor/login" className="text-neutral-400 hover:text-white transition-colors">
                  Vendor Login
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-neutral-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-neutral-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-6 text-center text-neutral-500">
          <p>&copy; {currentYear} FoodFusion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;