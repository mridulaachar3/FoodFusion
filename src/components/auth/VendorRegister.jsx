import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock, FiMapPin, FiPhone, FiAlertCircle } from 'react-icons/fi';

function VendorRegister() {
  const [formData, setFormData] = useState({
    vendorName: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    contact: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    // Restaurant name validation
    if (!formData.vendorName.trim()) {
      setError('Restaurant name is required');
      return false;
    }
    
    // Email validation
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Password validation
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    // Location validation
    if (!formData.location.trim()) {
      setError('Restaurant location is required');
      return false;
    }
    
    // Contact validation
    if (!formData.contact.trim()) {
      setError('Contact number is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setError('');
      setLoading(true);

      await register(
        {
          name: formData.vendorName,
          email: formData.email,
          password: formData.password,
          address: formData.location, 
          contact: formData.contact,  
        },
        'vendor'
      );
      navigate('/vendor/dashboard');
    } catch (err) {
      console.error('Vendor registration error:', err);
      setError('Failed to register restaurant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">Register Your Restaurant</h1>
        <p className="text-neutral-600">Join our platform and start selling your delicious food!</p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-accent-50 border border-accent-200 text-accent-700 rounded-md flex items-start">
          <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="vendorName" className="block text-sm font-medium text-neutral-700 mb-1">
            Restaurant Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-neutral-500" />
            </div>
            <input
              id="vendorName"
              name="vendorName"
              type="text"
              value={formData.vendorName}
              onChange={handleChange}
              className="input pl-10"
              placeholder="Pizza Palace"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-neutral-500" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="input pl-10"
              placeholder="restaurant@example.com"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-neutral-500" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="input pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-neutral-500" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-1">
            Restaurant Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMapPin className="text-neutral-500" />
            </div>
            <textarea
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              rows={2}
              className="input pl-10"
              placeholder="123 Main St, New York, NY 10001"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-neutral-700 mb-1">
            Contact Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiPhone className="text-neutral-500" />
            </div>
            <input
              id="contact"
              name="contact"
              type="text"
              value={formData.contact}
              onChange={handleChange}
              className="input pl-10"
              placeholder="(555) 123-4567"
              required
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`btn btn-secondary w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Registering...' : 'Register Restaurant'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-neutral-600">
          Already registered?{' '}
          <Link to="/vendor/login" className="text-secondary-600 hover:text-secondary-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default VendorRegister;