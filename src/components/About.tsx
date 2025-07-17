import React from 'react';
import { Award, Clock, Heart, Star } from 'lucide-react';
import aboutimg from "../Images/aboutimg.jpg"

const About: React.FC = () => {
  const stats = [
    { icon: Award, number: '15+', label: 'Years Experience' },
    { icon: Heart, number: '50K+', label: 'Happy Customers' },
    { icon: Star, number: '4.8', label: 'Average Rating' },
    { icon: Clock, number: '24/7', label: 'Catering Service' }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            About <span className="text-orange-600">Srimath</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A culinary legacy built on passion, quality, and the art of bringing people together through exceptional food experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img
              src={aboutimg}
              alt="Chef preparing food"
              className="rounded-lg shadow-xl w-full h-96 object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h3>
            <p className="text-gray-600 leading-relaxed">
              Founded with a vision to create extraordinary culinary experiences, Srimath has grown from a humble beginning to become a trusted name in the food industry. Our journey spans over 15 years of dedication to authentic flavors, innovative recipes, and exceptional service.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you're dining in our elegant restaurant, enjoying the variety at our food court, or celebrating with our catering services, we ensure every meal is a memorable experience crafted with love and precision.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-medium">Authentic Recipes</span>
              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-medium">Fresh Ingredients</span>
              <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium">Expert Chefs</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <stat.icon className="mx-auto text-orange-600 mb-4" size={40} />
              <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;