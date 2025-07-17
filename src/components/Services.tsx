import React from 'react';
import { ChefHat, Users, Calendar, Utensils, Coffee, PartyPopper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import  Dinning from "../Images/aboutimg (1).webp"
// import foodcourtexperience from "../Images/food-court-experience.jpg"
import  catering from "../Images/catering.jpg"
import Cateringimg from "../Images/aboutimg.jpg";
const Services: React.FC = () => {
  const navigate = useNavigate();

  const handleRestaurantOrder = () => {
    window.location.href = 'https://srimatha.co.in/';
  };

  const handleFoodCourtOrder = () => {
    window.location.href = 'https://srimatha.co.in/';
  };

  const handleCateringOrder = () => {
    navigate('/catering');
  };

  const services = [
    {
      icon: ChefHat,
      title: 'Fine Dining Restaurant',
      description: 'Experience culinary excellence in our elegant dining space with carefully crafted dishes and impeccable service.',
      features: ['Premium Ambiance', 'Gourmet Menu', 'Wine Selection', 'Private Dining'],
      image: Dinning,
      action: handleRestaurantOrder,
      buttonText: 'Order from Restaurant',
      buttonColor: 'bg-red-600 hover:bg-red-700'
    },
    {
      icon: Users,
      title: 'Food Court Experience',
      description: 'Diverse culinary options under one roof, perfect for families and groups with varying tastes and preferences.',
      features: ['Multiple Cuisines', 'Quick Service', 'Family Friendly', 'Affordable Pricing'],
      image: Cateringimg,
      action: handleFoodCourtOrder,
      buttonText: 'Order from Food Court',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
    },
    {
      icon: Calendar,
      title: 'Catering Services',
      description: 'Make your special events unforgettable with our comprehensive catering services and event management.',
      features: ['Custom Menus', 'Event Planning', 'Full Service', 'Any Occasion'],
      image: catering,
      action: handleCateringOrder,
      buttonText: 'Book Catering Service',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    }
  ];

  const additionalServices = [
    { 
      icon: Utensils, 
      title: 'Corporate Catering', 
      description: 'Professional catering for business events and meetings',
      action: handleCateringOrder
    },
    { 
      icon: Coffee, 
      title: 'Breakfast & Brunch', 
      description: 'Start your day with our delicious morning selections',
      action: handleRestaurantOrder
    },
    { 
      icon: PartyPopper, 
      title: 'Party Packages', 
      description: 'Complete party solutions for birthdays and celebrations',
      action: handleCateringOrder
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our <span className="text-orange-600">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From intimate dining to grand celebrations, we provide exceptional culinary experiences tailored to your needs
          </p>
        </div>

        {/* Main Services */}
        <div className="space-y-16 mb-20">
          {services.map((service, index) => (
            <div key={index} className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:grid-flow-col-dense' : ''}`}>
              <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                <img
                  src={service.image}
                  alt={service.title}
                  className="rounded-lg shadow-xl w-full h-80 object-cover"
                />
              </div>
              
              <div className={index % 2 === 1 ? 'md:col-start-1' : ''}>
                <div className="flex items-center mb-4">
                  <service.icon className="text-orange-600 mr-4" size={40}  style={{color: '#501608'}} />
                  <h3 className="text-3xl font-bold text-gray-800">{service.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {service.description}
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={service.action}
                  className={`${service.buttonColor} text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300`}
                >
                  {service.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Additional Services</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <div 
                key={index} 
                className="text-center bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={service.action}
              >
                <service.icon className="mx-auto mb-4" style={{color: '#501608'}} size={48} />
                <h4 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h4>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <button 
                  onClick={service.action}
                  className="text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-300"style={{color: '#501608'}} 
                >
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className=" rounded-2xl p-8 md:p-12 text-white" style={{ backgroundColor: '#501608' }}>
            <h3 className="text-3xl font-bold mb-4">Ready to Experience Srimatha?</h3>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Whether you're craving a quick bite, planning a special dinner, or organizing a grand event, we're here to serve you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleRestaurantOrder}
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-colors duration-300"
              >
                Order Food Now
              </button>
              <button 
                onClick={handleCateringOrder}
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-full font-semibold transition-all duration-300"
              >
                Plan Your Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;