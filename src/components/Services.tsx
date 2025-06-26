import React from 'react';
import { ChefHat, Users, Calendar, Utensils, Coffee, PartyPopper } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: ChefHat,
      title: 'Fine Dining Restaurant',
      description: 'Experience culinary excellence in our elegant dining space with carefully crafted dishes and impeccable service.',
      features: ['Premium Ambiance', 'Gourmet Menu', 'Wine Selection', 'Private Dining'],
      image: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
    },
    {
      icon: Users,
      title: 'Food Court Experience',
      description: 'Diverse culinary options under one roof, perfect for families and groups with varying tastes and preferences.',
      features: ['Multiple Cuisines', 'Quick Service', 'Family Friendly', 'Affordable Pricing'],
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
    },
    {
      icon: Calendar,
      title: 'Premium Catering',
      description: 'Make your special events unforgettable with our comprehensive catering services and event management.',
      features: ['Custom Menus', 'Event Planning', 'Full Service', 'Any Occasion'],
      image: 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
    }
  ];

  const additionalServices = [
    { icon: Utensils, title: 'Corporate Catering', description: 'Professional catering for business events and meetings' },
    { icon: Coffee, title: 'Breakfast & Brunch', description: 'Start your day with our delicious morning selections' },
    { icon: PartyPopper, title: 'Party Packages', description: 'Complete party solutions for birthdays and celebrations' }
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
                  <service.icon className="text-orange-600 mr-4" size={40} />
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
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300">
                  Learn More
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
              <div key={index} className="text-center bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <service.icon className="mx-auto text-orange-600 mb-4" size={48} />
                <h4 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h4>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;