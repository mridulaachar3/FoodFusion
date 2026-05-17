import { FiPlus, FiCheck, FiShoppingCart } from 'react-icons/fi';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';

function FoodItem({ item }) {
  const { addToCart, cartItems } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  
  // Get quantity of this item in cart
  const itemInCart = cartItems.find(cartItem => cartItem.id === item.id);
  const quantity = itemInCart?.quantity || 0;
  
  const handleAddToCart = () => {
    addToCart(item);
    setIsAdded(true);
    
    // Reset the "Added" indicator after 1.5 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="card hover:shadow-elevated transition-shadow duration-300 overflow-hidden">
      <div className="relative h-48 mb-4 overflow-hidden rounded-md">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium text-neutral-800">
          {item.category}
        </div>
        {quantity > 0 && (
          <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <FiShoppingCart className="mr-1" />
            {quantity}
          </div>
        )}
      </div>
      
      <div className="p-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold line-clamp-1">{item.name}</h3>
          <span className="text-primary-600 font-semibold">${Number(item.price).toFixed(2)}</span>
        </div>
        
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{item.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500">By {item.vendorName}</span>
          
          <button 
            onClick={handleAddToCart}
            className={`btn ${isAdded ? 'btn-secondary' : 'btn-primary'} px-3 py-1 text-sm`}
            disabled={isAdded}
          >
            {isAdded ? (
              <>
                <FiCheck className="mr-1" /> Added
              </>
            ) : (
              <>
                <FiPlus className="mr-1" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodItem;