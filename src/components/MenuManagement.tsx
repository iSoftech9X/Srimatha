import React, { useState } from 'react';
import { Search, Edit, ToggleLeft, ToggleRight, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MenuManagement: React.FC = () => {
  const { menuItems, updateMenuItem } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'appetizers', name: 'Appetizers' },
    { id: 'main-course', name: 'Main Course' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'beverages', name: 'Beverages' }
  ];

  const toggleAvailability = (itemId: string, currentStatus: boolean) => {
    updateMenuItem(itemId, { available: !currentStatus });
  };

  const togglePopular = (itemId: string, currentStatus: boolean) => {
    updateMenuItem(itemId, { popular: !currentStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Menu Management</h2>
          <p className="text-gray-600">Manage your restaurant menu items</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              {item.popular && (
                <div className="absolute top-2 left-2 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Star size={12} fill="currentColor" />
                  Popular
                </div>
              )}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {item.available ? 'Available' : 'Unavailable'}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <span className="text-lg font-bold text-orange-600">₹{item.price}</span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              
              <div className="mb-3">
                <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
                  {item.category.replace('-', ' ')}
                </span>
              </div>

              {item.allergens && item.allergens.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Allergens:</p>
                  <div className="flex flex-wrap gap-1">
                    {item.allergens.map((allergen, index) => (
                      <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleAvailability(item.id, item.available)}
                    className="flex items-center space-x-1 text-sm"
                  >
                    {item.available ? (
                      <ToggleRight className="text-green-600" size={20} />
                    ) : (
                      <ToggleLeft className="text-gray-400" size={20} />
                    )}
                    <span className="text-gray-600">Available</span>
                  </button>
                  
                  <button
                    onClick={() => togglePopular(item.id, item.popular)}
                    className="flex items-center space-x-1 text-sm"
                  >
                    {item.popular ? (
                      <Star className="text-orange-600" size={16} fill="currentColor" />
                    ) : (
                      <Star className="text-gray-400" size={16} />
                    )}
                    <span className="text-gray-600">Popular</span>
                  </button>
                </div>
                
                <button className="text-orange-600 hover:text-orange-800">
                  <Edit size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement;