import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiClock, FiCheckCircle, FiTruck } from 'react-icons/fi';
import Layout from '../components/ui/Layout';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  placed:      { label: 'Order Placed',   icon: FiClock,        color: 'text-blue-500',   bg: 'bg-blue-50' },
  preparing:   { label: 'Preparing',      icon: FiPackage,      color: 'text-yellow-500', bg: 'bg-yellow-50' },
  on_the_way:  { label: 'On the Way',     icon: FiTruck,        color: 'text-orange-500', bg: 'bg-orange-50' },
  delivered:   { label: 'Delivered',      icon: FiCheckCircle,  color: 'text-green-500',  bg: 'bg-green-50' },
};

function OrderHistoryPage() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders/user/${currentUser.id}`);
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentUser]);

  return (
    <Layout>
      <div className="bg-neutral-100 py-10">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">My Orders</h1>
            <p className="text-neutral-600">Track and view your order history</p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-neutral-600">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-card p-10 text-center">
              <FiPackage className="mx-auto text-neutral-400 text-6xl mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No Orders Yet</h2>
              <p className="text-neutral-600 mb-6">You haven't placed any orders yet</p>
              <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => {
                const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.placed;
                const StatusIcon = status.icon;
                const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

                return (
                  <div key={order.id} className="bg-white rounded-lg shadow-card p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-neutral-500">Order #{order.id}</p>
                        <p className="text-sm text-neutral-400">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className={`flex items-center mt-2 md:mt-0 px-3 py-1 rounded-full ${status.bg}`}>
                        <StatusIcon className={`mr-2 ${status.color}`} />
                        <span className={`font-medium text-sm ${status.color}`}>{status.label}</span>
                      </div>
                    </div>

                    <div className="border-t border-neutral-100 pt-4">
                      <div className="space-y-1 mb-4">
                        {items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-neutral-700">{item.name} × {item.quantity}</span>
                            <span className="text-neutral-600">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between font-semibold border-t border-neutral-100 pt-3">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default OrderHistoryPage;
