import { useState } from 'react';
import { FiUpload } from 'react-icons/fi';

function MenuItemForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    category: initialData?.category || '',
    image: initialData?.image || '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Food item name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    // Image URL validation (simple check)
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else if (!formData.image.startsWith('http')) {
      newErrors.image = 'Please enter a valid URL starting with http:// or https://';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a copy of formData with price converted to number
      const processedData = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      // If editing an existing item, pass the id
      if (initialData?.id) {
        processedData.id = initialData.id;
      }
      
      await onSubmit(processedData);
      
      // Clear form if it's not editing mode
      if (!initialData) {
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          image: '',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Display error message to user
      setErrors(prev => ({
        ...prev,
        form: 'Failed to save menu item. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <div className="bg-accent-50 text-accent-700 p-3 rounded-md">{errors.form}</div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
          Food Item Name*
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`input ${errors.name ? 'border-accent-500 ring-1 ring-accent-500' : ''}`}
          placeholder="e.g., Margherita Pizza"
        />
        {errors.name && <p className="mt-1 text-sm text-accent-500">{errors.name}</p>}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
          Description*
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={`input ${errors.description ? 'border-accent-500 ring-1 ring-accent-500' : ''}`}
          placeholder="Describe your food item..."
        />
        {errors.description && <p className="mt-1 text-sm text-accent-500">{errors.description}</p>}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-1">
            Price ($)*
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`input ${errors.price ? 'border-accent-500 ring-1 ring-accent-500' : ''}`}
            placeholder="9.99"
          />
          {errors.price && <p className="mt-1 text-sm text-accent-500">{errors.price}</p>}
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">
            Category*
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`input ${errors.category ? 'border-accent-500 ring-1 ring-accent-500' : ''}`}
            placeholder="e.g., Italian, Dessert, Beverages"
          />
          {errors.category && <p className="mt-1 text-sm text-accent-500">{errors.category}</p>}
        </div>
      </div>
      
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-neutral-700 mb-1">
          Image URL*
        </label>
        <div className="flex">
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className={`input rounded-r-none ${errors.image ? 'border-accent-500 ring-1 ring-accent-500' : ''}`}
            placeholder="https://example.com/image.jpg"
          />
          <div className="bg-neutral-100 border border-l-0 border-neutral-300 rounded-r-md flex items-center px-3">
            <FiUpload className="text-neutral-600" />
          </div>
        </div>
        {errors.image && <p className="mt-1 text-sm text-accent-500">{errors.image}</p>}
        
        {formData.image && (
          <div className="mt-2">
            <p className="text-sm text-neutral-500 mb-1">Preview:</p>
            <div className="w-full h-40 bg-neutral-100 rounded-md overflow-hidden">
              <img 
                src={formData.image} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.pexels.com/photos/4226869/pexels-photo-4226869.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';
                  setErrors(prev => ({
                    ...prev,
                    image: 'Invalid image URL. Please provide a valid image URL.'
                  }));
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Item' : 'Add Menu Item'}
        </button>
      </div>
    </form>
  );
}

export default MenuItemForm;