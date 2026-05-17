import { useEffect, useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext'; 
import Layout from '../components/ui/Layout';

function OrderConfirmationPage() {
  const location = useLocation();
  const [countdown, setCountdown] = useState(30);
  const { currentUser } = useAuth(); 
  
  // Redirect if accessed directly without an order
  if (!location.state?.orderId) {
    return <Navigate to="/" replace />;
  }
  
  const { orderId } = location.state;
  
  useEffect(() => {
    // Countdown timer for estimated delivery
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // decrease by 1 every minute
    
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      <div className="bg-neutral-100 py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-card p-8">
            <div className="text-center mb-8">
              <div className="text-success-500 text-5xl mb-4">
                <FiCheckCircle className="mx-auto" />
              </div>
              <h1 className="text-3xl font-bold text-neutral-800 mb-2">Order Confirmed!</h1>
              <p className="text-neutral-600">
                Thank you for your order. Your food is being prepared.
              </p>
            </div>
            
            <div className="bg-neutral-50 p-6 rounded-lg mb-8">
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <h2 className="text-sm font-medium text-neutral-500">ORDER NUMBER</h2>
                  <p className="text-lg font-bold">{orderId}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <h2 className="text-sm font-medium text-neutral-500">ESTIMATED DELIVERY</h2>
                  <p className="text-lg font-bold flex items-center">
                    <FiClock className="mr-2 text-primary-500" />
                    {countdown} minutes
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-neutral-200">
                <h2 className="text-sm font-medium text-neutral-500 mb-2">DELIVERY ADDRESS</h2>
                <p className="flex items-start">
                  <FiMapPin className="mr-2 mt-1 text-primary-500 flex-shrink-0" />
                  <span>{currentUser?.address || "No address found"}</span>
                </p>
              </div>
            </div>
            
            <div className="relative py-8 mb-8">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-neutral-200 z-0"></div>
              <div className="relative z-10 flex justify-between">
                <div className="bg-primary-500 text-white w-10 h-10 rounded-full flex items-center justify-center">
                  1
                </div>
                <div className="bg-primary-500 text-white w-10 h-10 rounded-full flex items-center justify-center">
                  2
                </div>
                <div className="bg-neutral-300 text-white w-10 h-10 rounded-full flex items-center justify-center">
                  3
                </div>
                <div className="bg-neutral-300 text-white w-10 h-10 rounded-full flex items-center justify-center">
                  4
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <div className="text-center w-20 -ml-5">
                  <p className="font-medium text-neutral-800">Confirmed</p>
                </div>
                <div className="text-center w-20 -ml-5">
                  <p className="font-medium text-neutral-800">Preparing</p>
                </div>
                <div className="text-center w-20 -ml-5">
                  <p className="font-medium text-neutral-500">On the way</p>
                </div>
                <div className="text-center w-20 -ml-5">
                  <p className="font-medium text-neutral-500">Delivered</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/menu" className="btn btn-primary inline-flex items-center">
                Order More Food <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OrderConfirmationPage;