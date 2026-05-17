import { useState, useEffect } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import Layout from '../components/ui/Layout';
import FoodList from '../components/customer/FoodList';

function CustomerMenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/menu');
        if (!response.ok) throw new Error('Failed to fetch menu items');
        const data = await response.json();
        setItems(data);

        // ✅ Fix: Extract unique categories from actual API data
        const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort items
  const getFilteredItems = () => {
    let filtered = [...items];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => {
        const name = item.name?.toLowerCase() || '';
        const description = item.description?.toLowerCase() || '';
        // ✅ Fix: Safe access to vendorName (now returned from backend JOIN)
        const vendorName = item.vendorName?.toLowerCase() || '';
        const term = searchTerm.toLowerCase();
        return name.includes(term) || description.includes(term) || vendorName.includes(term);
      });
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Sort items
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  };

  const filteredItems = getFilteredItems();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('');
  };

  return (
    <Layout>
      <div className="bg-neutral-100 py-10">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">Browse Menu</h1>
            <p className="text-neutral-600">Explore delicious food from our partnered restaurants</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-card p-4 mb-8">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
              <div className="flex flex-1 items-center relative">
                <FiSearch className="absolute left-3 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search for food, restaurant..."
                  className="input !pl-10 w-full"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>

              <div className="flex md:ml-4 space-x-2">
                <button
                  onClick={toggleFilters}
                  className="btn btn-outline flex items-center"
                >
                  <FiFilter className="mr-2" />
                  Filters
                </button>

                {(searchTerm || selectedCategory || sortBy) && (
                  <button
                    onClick={clearFilters}
                    className="btn btn-outline text-accent-500"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Expanded filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    className="input"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="sortBy" className="block text-sm font-medium text-neutral-700 mb-1">
                    Sort By
                  </label>
                  <select
                    id="sortBy"
                    className="input"
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    <option value="">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div>
            {loading ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-neutral-600">Loading menu items...</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-neutral-600">
                    Showing <span className="font-medium">{filteredItems.length}</span> results
                  </p>
                </div>

                <FoodList items={filteredItems} />

                {filteredItems.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-lg shadow-card">
                    <p className="text-xl font-medium text-neutral-700 mb-2">No items found</p>
                    <p className="text-neutral-500">Try adjusting your filters or search term</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CustomerMenuPage;
