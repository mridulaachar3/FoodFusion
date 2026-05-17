import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart, FiTrash2, FiTag, FiCheck, FiX } from 'react-icons/fi';
import Layout from '../components/ui/Layout';
import CartItem from '../components/customer/CartItem';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PROMO_CODES = {
  'SAVE10':   { discount: 0.10, type: 'percent', label: '10% off' },
  'SAVE20':   { discount: 0.20, type: 'percent', label: '20% off' },
  'FREESHIP': { discount: 0,    type: 'shipping', label: 'Free delivery' },
};

function CartPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  const deliveryFee = appliedPromo?.type === 'shipping' ? 0 : 2.99;
  const salesTax = cartTotal * 0.085;
  const discount = appliedPromo?.type === 'percent' ? cartTotal * appliedPromo.discount : 0;
  const orderTotal = cartTotal - discount + deliveryFee + salesTax;

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo({ ...PROMO_CODES[code], code });
      setPromoError('');
      setPromoInput('');
    } else {
      setPromoError('Invalid promo code. Try SAVE10, SAVE20, or FREESHIP');
      setAppliedPromo(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError('');
    setPromoInput('');
  };

  const handleProceedToPayment = () => {
    if (!currentUser) {
      navigate('/customer/login');
      return;
    }
    navigate('/payment');
  };

  return (
    <Layout>
      <div className="bg-neutral-100 py-10">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-800 mb-4">Your Cart</h1>
            <Link to="/menu" className="text-primary-600 inline-flex items-center hover:underline">
              <FiArrowLeft className="mr-1" /> Continue Shopping
            </Link>
          </div>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-card p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold flex items-center">
                      <FiShoppingCart className="mr-2" /> Cart Items ({cartItems.length})
                    </h2>
                    <button onClick={clearCart} className="text-neutral-600 hover:text-accent-600 flex items-center">
                      <FiTrash2 className="mr-1" /> Clear Cart
                    </button>
                  </div>
                  <div className="divide-y divide-neutral-200">
                    {cartItems.map(item => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-card p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-1">
                      <FiTag /> Promo Code
                    </label>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2 text-green-700">
                          <FiCheck />
                          <span className="font-medium">{appliedPromo.code}</span>
                          <span className="text-sm">— {appliedPromo.label}</span>
                        </div>
                        <button onClick={handleRemovePromo} className="text-green-600 hover:text-red-500">
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={e => { setPromoInput(e.target.value); setPromoError(''); }}
                          onKeyDown={e => e.key === 'Enter' && handleApplyPromo()}
                          placeholder="Enter code..."
                          className="input flex-1 text-sm uppercase"
                        />
                        <button
                          onClick={handleApplyPromo}
                          className="btn btn-outline text-sm px-3"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                    {promoError && (
                      <p className="text-red-500 text-xs mt-1">{promoError}</p>
                    )}
                    {!appliedPromo && !promoError && (
                      <p className="text-neutral-400 text-xs mt-1">Try: SAVE10, SAVE20, FREESHIP</p>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Subtotal</span>
                      <span className="font-medium">${Number(cartTotal).toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({appliedPromo.label})</span>
                        <span className="font-medium">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Delivery Fee</span>
                      <span className={`font-medium ${appliedPromo?.type === 'shipping' ? 'text-green-600 line-through' : ''}`}>
                        {appliedPromo?.type === 'shipping' ? 'FREE' : `$${Number(deliveryFee).toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Sales Tax</span>
                      <span className="font-medium">${Number(salesTax).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-neutral-200 pt-3 flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-lg">${Number(orderTotal).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    disabled={cartItems.length === 0}
                    className={`btn btn-primary w-full ${cartItems.length === 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    Proceed to Payment
                  </button>

                  {!currentUser && (
                    <p className="mt-4 text-sm text-neutral-500 text-center">
                      Please <Link to="/customer/login" className="text-primary-600 hover:underline">login</Link> to proceed with payment
                    </p>
                  )}

                  <div className="mt-6 text-sm text-neutral-500">
                    <p>
                      By proceeding to payment, you agree to our{' '}
                      <Link to="#" className="text-primary-600 hover:underline">Terms of Service</Link>{' '}
                      and{' '}
                      <Link to="#" className="text-primary-600 hover:underline">Privacy Policy</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-card p-10 text-center">
              <div className="text-neutral-400 text-6xl mb-4">
                <FiShoppingCart className="mx-auto" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Your Cart is Empty</h2>
              <p className="text-neutral-600 mb-6">Looks like you haven't added any items to your cart yet</p>
              <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default CartPage;
