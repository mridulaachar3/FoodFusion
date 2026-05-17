import { useState } from 'react';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

function MenuItem({ item, onEdit, onDelete }) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  
  const handleDeleteClick = () => {
    if (isConfirmingDelete) {
      onDelete(item.id);
      setIsConfirmingDelete(false);
    } else {
      setIsConfirmingDelete(true);
    }
  };
  
  const cancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      <div className="relative h-44">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium">
          {item.category}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-primary-600 font-semibold">${Number(item.price).toFixed(2)}</p>
        </div>
        
        <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{item.description}</p>
        
        <div className="flex justify-between items-center mt-4">
          {isConfirmingDelete ? (
            <div className="flex space-x-2">
              <button
                onClick={handleDeleteClick}
                className="px-3 py-1 bg-accent-500 text-white text-sm rounded-md"
              >
                Confirm
              </button>
              <button
                onClick={cancelDelete}
                className="px-3 py-1 bg-neutral-200 text-neutral-700 text-sm rounded-md"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(item)}
                className="p-1.5 bg-secondary-100 text-secondary-700 rounded-md hover:bg-secondary-200"
                aria-label="Edit item"
              >
                <FiEdit2 size={16} />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-1.5 bg-accent-100 text-accent-700 rounded-md hover:bg-accent-200"
                aria-label="Delete item"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          )}
          
          <button
            className="text-sm flex items-center text-neutral-600 hover:text-primary-600"
          >
            <FiEye size={14} className="mr-1" />
            Preview
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItem;