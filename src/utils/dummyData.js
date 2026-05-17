// Mock data for food items
export const foodItems = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    price: 12.99,
    image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    vendorId: '101',
    vendorName: 'Pizza Palace',
    category: 'Italian',
  },
  {
    id: '2',
    name: 'Chicken Tikka Masala',
    description: 'Tender chicken in a rich and creamy tomato sauce with Indian spices',
    price: 14.99,
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    vendorId: '102',
    vendorName: 'Spice Garden',
    category: 'Indian',
  },
  {
    id: '3',
    name: 'Chicken Burger',
    description: 'Juicy beef patty with lettuce, tomato, cheese, and special sauce',
    price: 10.99,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    vendorId: '103',
    vendorName: 'Burger Joint',
    category: 'American',
  },
  {
    id: '4',
    name: 'Pad Thai',
    description: 'Stir-fried rice noodles with eggs, tofu, bean sprouts, and peanuts',
    price: 11.99,
    image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    vendorId: '104',
    vendorName: 'Thai Delight',
    category: 'Thai',
  },
  {
    id: '5',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with Caesar dressing, croutons, and parmesan',
    price: 8.99,
    image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    vendorId: '105',
    vendorName: 'Fresh Greens',
    category: 'Salads',
  },
  {
    id: '6',
    name: 'Sushi Combo',
    description: 'Assorted nigiri and maki rolls with wasabi, ginger, and soy sauce',
    price: 18.99,
    image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    vendorId: '106',
    vendorName: 'Sushi Master',
    category: 'Japanese',
  },
];

// Mock data for vendors
export const vendors = [
  {
    id: '101',
    name: 'Pizza Palace',
    email: 'info@pizzapalace.com',
    password: 'password123', // In a real app, this would be hashed
    location: '123 Main St, New York, NY',
    contact: '555-123-4567',
    image: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  },
  {
    id: '102',
    name: 'Spice Garden',
    email: 'info@spicegarden.com',
    password: 'password123',
    location: '456 Oak Ave, Chicago, IL',
    contact: '555-234-5678',
    image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  },
  {
    id: '103',
    name: 'Burger Joint',
    email: 'info@burgerjoint.com',
    password: 'password123',
    location: '789 Pine Rd, Los Angeles, CA',
    contact: '555-345-6789',
    image: 'https://images.pexels.com/photos/1556698/pexels-photo-1556698.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  },
];

// Get vendor menu items
export const getVendorMenuItems = (vendorId) => {
  return foodItems.filter(item => item.vendorId === vendorId);
};

// Get orders for a vendor
export const getVendorOrders = (vendorId) => {
  return mockOrders.filter(order => order.items.some(item => item.vendorId === vendorId));
};

// Mock orders
export const mockOrders = [
  {
    id: 'order-1',
    customerId: 'customer-1',
    customerName: 'John Doe',
    customerAddress: '123 Main St, Apt 4B, New York, NY 10001',
    items: [
      {
        ...foodItems[0],
        quantity: 2
      },
      {
        ...foodItems[2],
        quantity: 1
      }
    ],
    total: 36.97,
    status: 'Delivered',
    orderDate: '2023-06-15T14:30:00Z'
  },
  {
    id: 'order-2',
    customerId: 'customer-2',
    customerName: 'Jane Smith',
    customerAddress: '456 Elm St, Chicago, IL 60007',
    items: [
      {
        ...foodItems[1],
        quantity: 1
      },
      {
        ...foodItems[4],
        quantity: 1
      }
    ],
    total: 23.98,
    status: 'Processing',
    orderDate: '2023-06-16T18:45:00Z'
  }
];