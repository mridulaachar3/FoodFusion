import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Layout from '../components/ui/Layout';

function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-500 to-primary-600 text-white py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Delicious Food<br />Delivered to Your Door
              </h1>
              <p className="text-lg md:text-xl text-primary-50 opacity-90">
                Discover local restaurants and order your favorite meals with just a few clicks.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Link to="/menu" className="btn bg-white text-primary-600 hover:bg-primary-50">
                  Browse as Customer
                </Link>
                <Link to="/vendor/login" className="btn bg-primary-600 border border-white text-white hover:bg-primary-700">
                  Login as Vendor <FiArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <img 
                src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" 
                alt="Delicious Food" 
                className="rounded-lg shadow-lg object-cover object-center w-full h-[400px]"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                    30
                  </div>
                  <div>
                    <p className="text-neutral-800 font-semibold">Fast Delivery</p>
                    <p className="text-neutral-500 text-sm">Minutes or less</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white rounded-tl-[50px] rounded-tr-[50px]"></div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">How It Works</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              We connect hungry customers with the best local restaurants for a seamless food delivery experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Browse Restaurants</h3>
              <p className="text-neutral-600">
                Explore menus from the best local restaurants and find your favorite dishes
              </p>
            </div>
            
            <div className="bg-neutral-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-secondary-100 text-secondary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Add to Cart</h3>
              <p className="text-neutral-600">
                Select your items, customize as needed, and add them to your cart
              </p>
            </div>
            
            <div className="bg-neutral-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
              <p className="text-neutral-600">
                Our delivery partners will bring your order right to your door
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl py-12 px-6 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Are You a Restaurant Owner?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our platform to reach more customers and grow your business
            </p>
            <Link to="/vendor/register" className="btn bg-white text-secondary-600 hover:bg-secondary-50">
              Register Your Restaurant
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default HomePage;