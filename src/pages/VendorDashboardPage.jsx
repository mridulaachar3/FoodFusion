import { useState, useEffect } from 'react';
import { FiPlus, FiPackage, FiBarChart2, FiDollarSign, FiTruck, FiTrendingUp } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Layout from '../components/ui/Layout';
import MenuItemForm from '../components/vendor/MenuItemForm';
import MenuItemsList from '../components/vendor/MenuItemsList';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  placed:     { label: 'Order Placed', color: 'text-blue-500',   bg: 'bg-blue-50',   next: 'preparing',  nextLabel: 'Start Preparing' },
  preparing:  { label: 'Preparing',    color: 'text-yellow-500', bg: 'bg-yellow-50', next: 'on_the_way', nextLabel: 'Mark On the Way' },
  on_the_way: { label: 'On the Way',   color: 'text-orange-500', bg: 'bg-orange-50', next: 'delivered',  nextLabel: 'Mark Delivered' },
  delivered:  { label: 'Delivered',    color: 'text-green-500',  bg: 'bg-green-50',  next: null,         nextLabel: null },
};

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

function VendorDashboardPage() {
  const { currentUser } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState('menu');

  useEffect(() => {
    if (!currentUser) return;
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`/api/vendors/${currentUser.id}/menu-items`);
        if (!response.ok) throw new Error('Failed to fetch menu items');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders/vendor/${currentUser.id}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchMenuItems();
    fetchOrders();
  }, [currentUser]);

  const handleAddItem = async (newItem) => {
    try {
      const response = await fetch(`/api/vendors/${currentUser.id}/menu-items`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) throw new Error('Failed to add menu item');
      const data = await response.json();
      setMenuItems([...menuItems, data]);
      setShowForm(false);
    } catch (error) { alert('Failed to add menu item. Please try again.'); }
  };

  const handleUpdateItem = async (updatedItem) => {
    try {
      const response = await fetch(`/api/vendors/${currentUser.id}/menu-items/${updatedItem.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });
      if (!response.ok) throw new Error('Failed to update menu item');
      const data = await response.json();
      setMenuItems(menuItems.map(item => item.id === updatedItem.id ? data : item));
      setEditingItem(null);
      setShowForm(false);
    } catch (error) { alert('Failed to update menu item. Please try again.'); }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`/api/vendors/${currentUser.id}/menu-items/${itemId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete menu item');
      setMenuItems(menuItems.filter(item => item.id !== itemId));
    } catch (error) { alert('Failed to delete menu item. Please try again.'); }
  };

  const handleEditItem = (item) => { setEditingItem(item); setShowForm(true); };
  const handleFormSubmit = (itemData) => {
    if (editingItem) {
      handleUpdateItem({ ...itemData, id: editingItem.id, vendorId: currentUser.id });
    } else { handleAddItem(itemData); }
  };
  const handleCancelForm = () => { setShowForm(false); setEditingItem(null); };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) { alert('Failed to update order status.'); }
  };

  // Analytics
  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => {
      const items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
      return sum + items.reduce((s, i) => s + i.price * i.quantity, 0);
    }, 0);

  const itemSalesMap = {};
  orders.forEach(o => {
    const items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
    items.forEach(i => { itemSalesMap[i.name] = (itemSalesMap[i.name] || 0) + i.quantity; });
  });
  const topItemsData = Object.entries(itemSalesMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count).slice(0, 6);

  const popularItem = topItemsData.length > 0 ? topItemsData[0].name : (menuItems.length > 0 ? menuItems[0].name : 'N/A');

  const statusCounts = { placed: 0, preparing: 0, on_the_way: 0, delivered: 0 };
  orders.forEach(o => { if (statusCounts[o.status] !== undefined) statusCounts[o.status]++; });
  const pieData = Object.entries(statusCounts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name: STATUS_CONFIG[name]?.label || name, value }));

  const revenueByDay = {};
  orders.filter(o => o.status === 'delivered').forEach(o => {
    const day = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    revenueByDay[day] = (revenueByDay[day] || 0) + total;
  });
  const revenueData = Object.entries(revenueByDay).map(([date, revenue]) => ({ date, revenue }));

  return (
    <Layout>
      <div className="bg-neutral-100 py-8">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-800">{currentUser?.name || 'Restaurant'} Dashboard</h1>
            <p className="text-neutral-600 mt-1">Manage your restaurant and menu</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-card p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-neutral-600">Menu Items</h3>
                <div className="p-2 bg-primary-100 text-primary-600 rounded-md"><FiPackage /></div>
              </div>
              <p className="text-2xl font-bold">{menuItems.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-card p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-neutral-600">Total Orders</h3>
                <div className="p-2 bg-secondary-100 text-secondary-600 rounded-md"><FiBarChart2 /></div>
              </div>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-card p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-neutral-600">Total Revenue</h3>
                <div className="p-2 bg-green-50 text-green-500 rounded-md"><FiDollarSign /></div>
              </div>
              <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-card p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-neutral-600">Popular Item</h3>
                <div className="p-2 bg-accent-100 text-accent-600 rounded-md"><FiTruck /></div>
              </div>
              <p className="text-lg font-semibold truncate">{popularItem}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-neutral-200">
            <div className="flex space-x-6">
              <button className={`py-3 px-1 font-medium relative ${activeTab === 'menu' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-neutral-600 hover:text-neutral-800'}`} onClick={() => setActiveTab('menu')}>
                Menu Management
              </button>
              <button className={`py-3 px-1 font-medium relative ${activeTab === 'orders' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-neutral-600 hover:text-neutral-800'}`} onClick={() => setActiveTab('orders')}>
                Orders {orders.filter(o => o.status !== 'delivered').length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{orders.filter(o => o.status !== 'delivered').length}</span>
                )}
              </button>
              <button className={`py-3 px-1 font-medium relative flex items-center gap-1 ${activeTab === 'analytics' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-neutral-600 hover:text-neutral-800'}`} onClick={() => setActiveTab('analytics')}>
                <FiTrendingUp /> Analytics
              </button>
            </div>
          </div>

          {/* Menu Tab */}
          {activeTab === 'menu' && (
            <div>
              {!showForm && (
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Your Menu Items</h2>
                  <button onClick={() => setShowForm(true)} className="btn btn-secondary"><FiPlus className="mr-1" /> Add New Item</button>
                </div>
              )}
              {showForm ? (
                <div className="bg-white rounded-lg shadow-card p-6 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                    <button onClick={handleCancelForm} className="text-neutral-600 hover:text-neutral-800">Cancel</button>
                  </div>
                  <MenuItemForm onSubmit={handleFormSubmit} initialData={editingItem} />
                </div>
              ) : (
                <div>
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-neutral-600">Loading menu items...</p>
                    </div>
                  ) : (
                    <MenuItemsList items={menuItems} onEdit={handleEditItem} onDelete={handleDeleteItem} />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Incoming Orders</h2>
              {ordersLoading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-neutral-600">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-card">
                  <FiPackage className="mx-auto text-neutral-400 text-5xl mb-4" />
                  <p className="text-xl font-medium text-neutral-700 mb-2">No Orders Yet</p>
                  <p className="text-neutral-500">Orders will appear here when customers place them</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => {
                    const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.placed;
                    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
                    return (
                      <div key={order.id} className="bg-white rounded-lg shadow-card p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div>
                            <p className="font-semibold">Order #{order.id}</p>
                            <p className="text-sm text-neutral-500">Customer: {order.customerName}</p>
                            <p className="text-sm text-neutral-400">{new Date(order.created_at).toLocaleString()}</p>
                          </div>
                          <div className={`flex items-center mt-2 md:mt-0 px-3 py-1 rounded-full ${status.bg}`}>
                            <span className={`font-medium text-sm ${status.color}`}>{status.label}</span>
                          </div>
                        </div>
                        <div className="border-t border-neutral-100 pt-4 mb-4">
                          {items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm mb-1">
                              <span>{item.name} × {item.quantity}</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between font-semibold border-t border-neutral-100 pt-2 mt-2">
                            <span>Total</span><span>${total.toFixed(2)}</span>
                          </div>
                        </div>
                        {status.next && (
                          <button onClick={() => handleUpdateOrderStatus(order.id, status.next)} className="btn btn-primary text-sm">
                            {status.nextLabel}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Analytics Overview</h2>
              {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-card">
                  <FiTrendingUp className="mx-auto text-neutral-400 text-5xl mb-4" />
                  <p className="text-xl font-medium text-neutral-700 mb-2">No Data Yet</p>
                  <p className="text-neutral-500">Analytics will appear once you receive orders</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Revenue Over Time */}
                  {revenueData.length > 0 && (
                    <div className="bg-white rounded-lg shadow-card p-6">
                      <h3 className="text-lg font-semibold mb-4">💰 Revenue Over Time</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']} />
                          <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top Selling Items */}
                    {topItemsData.length > 0 && (
                      <div className="bg-white rounded-lg shadow-card p-6">
                        <h3 className="text-lg font-semibold mb-4">🏆 Top Selling Items</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={topItemsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(value) => [value, 'Units Sold']} />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                              {topItemsData.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* Orders by Status Pie */}
                    {pieData.length > 0 && (
                      <div className="bg-white rounded-lg shadow-card p-6">
                        <h3 className="text-lg font-semibold mb-4">📊 Orders by Status</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                              {pieData.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-card p-4 text-center">
                      <p className="text-neutral-500 text-sm mb-1">Delivered Orders</p>
                      <p className="text-3xl font-bold text-green-500">{orders.filter(o => o.status === 'delivered').length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-card p-4 text-center">
                      <p className="text-neutral-500 text-sm mb-1">Pending Orders</p>
                      <p className="text-3xl font-bold text-orange-500">{orders.filter(o => o.status !== 'delivered').length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-card p-4 text-center">
                      <p className="text-neutral-500 text-sm mb-1">Avg Order Value</p>
                      <p className="text-3xl font-bold text-blue-500">
                        ${orders.length > 0 ? (totalRevenue / Math.max(orders.filter(o => o.status === 'delivered').length, 1)).toFixed(2) : '0.00'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default VendorDashboardPage;
