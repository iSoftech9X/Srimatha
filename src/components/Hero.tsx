
import React from 'react';
import { ChefHat, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
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

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center py-10 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop")',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto text-white text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Welcome to <span className="text-orange-400">Srimatha</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
          Experience the finest culinary journey with our restaurant, food court, and premium catering services
        </p>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 px-4">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 flex items-center gap-4 hover:bg-opacity-20 transition-all duration-300">
            <ChefHat className="text-orange-400" size={32} />
            <div className="text-left">
              <h3 className="font-semibold text-lg">Fine Dining</h3>
              <p className="text-gray-200 text-sm">Premium restaurant experience</p>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 flex items-center gap-4 hover:bg-opacity-20 transition-all duration-300">
            <Users className="text-orange-400" size={32} />
            <div className="text-left">
              <h3 className="font-semibold text-lg">Food Court</h3>
              <p className="text-gray-200 text-sm">Variety for every taste</p>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 flex items-center gap-4 hover:bg-opacity-20 transition-all duration-300">
            <Calendar className="text-orange-400" size={32} />
            <div className="text-left">
              <h3 className="font-semibold text-lg">Catering</h3>
              <p className="text-gray-200 text-sm">Events made memorable</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handleRestaurantOrder}
            className="bg-[#501608] hover:bg-[#722010] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105"
          >
            Order Food Online
          </button>
          <button
            onClick={handleCateringOrder}
            className="border-2 border-white text-white hover:bg-white hover:text-gray-800 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300"
          >
            Book Catering Service
          </button>
        </div>

        {/* Quick Service Links */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-sm">
          <button
            onClick={handleRestaurantOrder}
            className="bg-red-600 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-full transition-all duration-300"
          >
            🍽️ Restaurant Menu
          </button>
          <button
            onClick={handleFoodCourtOrder}
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
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
// import React, { useState, useEffect } from 'react';
// import { ChefHat, Users, Calendar } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import VinayakaPopup from './VinayakaPopup';

// const Hero: React.FC = () => {
//   const [showPopup, setShowPopup] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const timer = setTimeout(() => setShowPopup(true), 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleRestaurantOrder = () => {
//     window.location.href = 'https://orders.srimatha.co.in';
//   };

//   const handleFoodCourtOrder = () => {
//     window.location.href = 'https://orders.srimatha.co.in';
//   };

//   const handleCateringOrder = () => {
//     navigate('/catering');
//   };

//   // Close popup handler
//   const handleClosePopup = () => {
//     setShowPopup(false);
//   };

//   // Claim offer handler that navigates to /cateringorders
//   const handleClaimOffer = () => {
//     navigate('/catering');
//     setShowPopup(false);
//   };

//   return (
//     <>
//       <section
//         id="home"
//         className="relative min-h-screen flex items-center py-10 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
//         style={{
//           backgroundImage:
//             'url("https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop")',
//         }}
//       >
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//         {/* Content */}
//         <div className="relative z-10 w-full max-w-7xl mx-auto text-white text-center">
//           <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
//             Welcome to <span className="text-orange-400">Srimatha</span>
//           </h1>
//           <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
//             Experience the finest culinary journey with our restaurant, food court, and premium catering services
//           </p>

//           {/* Service Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 px-4">
//             <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 flex items-center gap-4 hover:bg-opacity-20 transition-all duration-300">
//               <ChefHat className="text-orange-400" size={32} />
//               <div className="text-left">
//                 <h3 className="font-semibold text-lg">Fine Dining</h3>
//                 <p className="text-gray-200 text-sm">Premium restaurant experience</p>
//               </div>
//             </div>

//             <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 flex items-center gap-4 hover:bg-opacity-20 transition-all duration-300">
//               <Users className="text-orange-400" size={32} />
//               <div className="text-left">
//                 <h3 className="font-semibold text-lg">Food Court</h3>
//                 <p className="text-gray-200 text-sm">Variety for every taste</p>
//               </div>
//             </div>

//             <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 flex items-center gap-4 hover:bg-opacity-20 transition-all duration-300">
//               <Calendar className="text-orange-400" size={32} />
//               <div className="text-left">
//                 <h3 className="font-semibold text-lg">Catering</h3>
//                 <p className="text-gray-200 text-sm">Events made memorable</p>
//               </div>
//             </div>
//           </div>

//           {/* CTA Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
//             <button
//               onClick={handleRestaurantOrder}
//               className="bg-[#501608] hover:bg-[#722010] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105"
//             >
//               Order Food Online
//             </button>
//             <button
//               onClick={handleCateringOrder}
//               className="border-2 border-white text-white hover:bg-white hover:text-gray-800 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300"
//             >
//               Book Catering Service
//             </button>
//           </div>

//           {/* Quick Service Links */}
//           <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-sm">
//             <button
//               onClick={handleRestaurantOrder}
//               className="bg-red-600 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-full transition-all duration-300"
//             >
//               🍽️ Restaurant Menu
//             </button>
//             <button
//               onClick={handleFoodCourtOrder}
//               className="bg-yellow-600 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-full transition-all duration-300"
//             >
//               🍕 Food Court
//             </button>
//             <button
//               onClick={handleCateringOrder}
//               className="bg-green-600 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-full transition-all duration-300"
//             >
//               🎉 Event Catering
//             </button>
//           </div>
//         </div>

//         {/* Scroll Indicator */}
//         <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
//           <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
//             <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
//           </div>
//         </div>
//       </section>

//       {/* Vinayaka Chavithi Special Lunch Menu Offer Popup */}
//       <VinayakaPopup
//         show={showPopup}
//         onClose={handleClosePopup}
//         onClaim={handleClaimOffer}
//       />
//     </>
//   );
// };

// export default Hero;
