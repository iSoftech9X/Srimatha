import React from 'react';
import { ChefHat, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  // Direct navigation to external site for restaurant/food court
  const handleRestaurantOrder = () => {
    window.location.href = 'https://srimatha.co.in/';
  };

  const handleCateringOrder = () => {
    // Keep catering booking as is, or update if needed
    navigate('/catering');
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Delicious food spread"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Welcome to <span className="text-orange-400">Srimatha</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
          Experience the finest culinary journey with our restaurant, food court, and premium catering services
        </p>
        
        {/* Service Cards */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 flex items-center gap-4 hover:bg-opacity-20 transition-all duration-300">
            <ChefHat className="text-orange-400" size={32} />
            <div className="text-left">
              <h3 className="font-semibold text-lg">Fine Dining</h3>
              <p className="text-gray-200">Premium restaurant experience</p>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 flex items-center gap-4 hover:bg-opacity-20 transition-all duration-300">
            <Users className="text-orange-400" size={32} />
            <div className="text-left">
              <h3 className="font-semibold text-lg">Food Court</h3>
              <p className="text-gray-200">Variety for every taste</p>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 flex items-center gap-4 hover:bg-opacity-20 transition-all duration-300">
            <Calendar className="text-orange-400" size={32} />
            <div className="text-left">
              <h3 className="font-semibold text-lg">Catering</h3>
              <p className="text-gray-200">Events made memorable</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleRestaurantOrder}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
          >
            Order Food Online
          </button>
          <button 
            onClick={handleCateringOrder}
            className="border-2 border-white text-white hover:bg-white hover:text-gray-800 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300"
          >
            Book Catering Service
          </button>
        </div>

        {/* Quick Service Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
          <button 
            onClick={handleRestaurantOrder}
            className="bg-red-600 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-full transition-all duration-300"
          >
            🍽️ Restaurant Menu
          </button>
          <button 
            onClick={handleRestaurantOrder}
            className="bg-yellow-600 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-full transition-all duration-300"
          >
            🍕 Food Court
          </button>
          <button 
            onClick={handleCateringOrder}
            className="bg-green-600 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-full transition-all duration-300"
          >
            🎉 Event Catering
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;