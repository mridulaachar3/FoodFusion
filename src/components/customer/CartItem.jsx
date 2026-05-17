import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  
  const decreaseQuantity = () => {
    updateQuantity(item.id, item.quantity - 1);
  };
  
  const increaseQuantity = () => {
    updateQuantity(item.id, item.quantity + 1);
  };
  
  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-neutral-200">
      <div className="w-full sm:w-24 h-24 flex-shrink-0 rounded-md overflow-hidden mb-3 sm:mb-0">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-grow px-4">
        <h3 className="font-medium text-lg">{item.name}</h3>
        <p className="text-neutral-500 text-sm">{item.vendorName}</p>
        <p className="text-primary-600 font-semibold mt-1">${Number(item.price).toFixed(2)}</p>
      </div>
      
      <div className="flex items-center mt-3 sm:mt-0">
        <div className="flex items-center border border-neutral-300 rounded-md">
          <button 
            onClick={decreaseQuantity}
            className="px-2 py-1 text-neutral-700 hover:bg-neutral-100"
            aria-label="Decrease quantity"
          >
            <FiMinus size={16} />
          </button>
          
          <span className="px-3 py-1 text-center min-w-[40px]">
            {item.quantity}
          </span>
          
          <button 
            onClick={increaseQuantity}
            className="px-2 py-1 text-neutral-700 hover:bg-neutral-100"
            aria-label="Increase quantity"
          >
            <FiPlus size={16} />
          </button>
        </div>
        
        <button 
          onClick={handleRemove}
          className="ml-3 text-neutral-500 hover:text-accent-500"
          aria-label="Remove item"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
      
      <div className="text-right font-semibold text-lg mt-3 sm:mt-0 ml-0 sm:ml-4 w-full sm:w-24">
        ${(Number(item.price) * item.quantity).toFixed(2)}
      </div>
    </div>
  );
}

export default CartItem;