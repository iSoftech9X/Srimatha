import React, { useState } from 'react';
import { Star } from 'lucide-react';

const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('appetizers');

  const categories = [
    { id: 'appetizers', name: 'Appetizers' },
    { id: 'main-course', name: 'Main Course' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'beverages', name: 'Beverages' }
  ];

  const menuItems = {
    appetizers: [
      {
        name: 'Crispy Calamari',
        description: 'Fresh squid rings with tangy marinara sauce',
        price: '₹450',
        image: 'https://images.pexels.com/photos/725996/pexels-photo-725996.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        popular: true
      },
      {
        name: 'Stuffed Mushrooms',
        description: 'Button mushrooms stuffed with herbs and cheese',
        price: '₹380',
        image: 'https://images.pexels.com/photos/8879576/pexels-photo-8879576.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
      },
      {
        name: 'Paneer Tikka',
        description: 'Marinated cottage cheese grilled to perfection',
        price: '₹420',
        image: 'https://images.pexels.com/photos/5864474/pexels-photo-5864474.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        popular: true
      }
    ],
    'main-course': [
      {
        name: 'Butter Chicken',
        description: 'Tender chicken in rich tomato and cream sauce',
        price: '₹650',
        image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        popular: true
      },
      {
        name: 'Grilled Salmon',
        description: 'Atlantic salmon with lemon herb butter',
        price: '₹850',
        image: 'https://images.pexels.com/photos/3622479/pexels-photo-3622479.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
      },
      {
        name: 'Vegetable Biryani',
        description: 'Aromatic basmati rice with mixed vegetables',
        price: '₹480',
        image: 'https://images.pexels.com/photos/15953175/pexels-photo-15953175.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        popular: true
      }
    ],
    desserts: [
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center',
        price: '₹320',
        image: 'https://images.pexels.com/photos/8844893/pexels-photo-8844893.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        popular: true
      },
      {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee and mascarpone',
        price: '₹380',
        image: 'https://images.pexels.com/photos/6078387/pexels-photo-6078387.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
      },
      {
        name: 'Gulab Jamun',
        description: 'Traditional Indian sweet in sugar syrup',
        price: '₹180',
        image: 'https://images.pexels.com/photos/4725030/pexels-photo-4725030.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
      }
    ],
    beverages: [
      {
        name: 'Fresh Lime Soda',
        description: 'Refreshing lime with sparkling water',
        price: '₹120',
        image: 'https://images.pexels.com/photos/7869266/pexels-photo-7869266.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
      },
      {
        name: 'Mango Lassi',
        description: 'Traditional yogurt drink with fresh mango',
        price: '₹180',
        image: 'https://images.pexels.com/photos/19764735/pexels-photo-19764735.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        popular: true
      },
      {
        name: 'Masala Chai',
        description: 'Spiced tea blend with milk and aromatic spices',
        price: '₹80',
        image: 'https://images.pexels.com/photos/7283289/pexels-photo-7283289.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
      }
    ]
  };

  return (
    <section id="menu" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our <span className="text-orange-600">Menu</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our carefully curated selection of dishes, crafted with the finest ingredients and traditional techniques
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems[activeCategory as keyof typeof menuItems].map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                {item.popular && (
                  <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star size={14} fill="currentColor" />
                    Popular
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                  <span className="text-xl font-bold text-orange-600">{item.price}</span>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-full font-semibold transition-colors duration-300">
                  Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Want to See Our Full Menu?</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Download our complete menu or visit us to explore our seasonal specials and chef's recommendations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300">
                Download Menu
              </button>
              <button className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300">
                Make Reservation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;