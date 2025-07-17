// import React, { useState } from 'react';
// import { Menu, X, Phone, MapPin, User, LogOut } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import logo from '../Images/logo.png';
// const Header: React.FC = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const { user, isAuthenticated, logout } = useAuth();

//   const handleRestaurantOrder = () => {
//     window.location.href = 'https://srimatha.co.in/';
//   };

//   const handleFoodCourtOrder = () => {
//     window.location.href = 'https://srimatha.co.in/';
//   };

//   const handleCateringOrder = () => {
//     navigate('/catering');
//   };

//   const handleAuthAction = () => {
//     if (isAuthenticated) {
//       logout();
//     } else {
//       (window as any).openAuthModal?.('login');
//     }
//   };

//   return (
//     <>
//       {/* Top Contact Bar */}
//       <div className="hidden md:block bg-orange-600 text-white py-2">
//         <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
//           <div className="flex items-center gap-6">
//             <div className="flex items-center gap-2">
//               <Phone size={14} />
//               <span>040-4859 5886/7</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <MapPin size={14} />
//               <span>Secunderabad-500 003</span>
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <span>24/7 Catering Service Available</span>
//             <button
//               onClick={() => navigate('/admin')}
//               className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
//             >
//               Admin
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Header */}
//       <header className="bg-white shadow-lg sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex justify-between items-center py-4">
//             {/* Logo */}
//             {/* <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
//               <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-3">
//                 <span className="text-white font-bold text-xl">S</span>
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800">Srimatha</h1>
//               </div>
//             </div> */}
// <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
//   <img
//     src={logo}
//     alt="Srimatha Logo"
//     className="w-16 h-16 object-contain mr-3"
//   />
//   <div>
//     <h1 className="text-2xl font-bold text-gray-800">Srimatha</h1>
//   </div>
// </div>

//             {/* Centered Services Only */}
//             <div className="flex-1 flex justify-center">
//               <div className="flex items-center gap-8">
//                 <span className="flex items-center gap-1">
//                   <span className="w-2 h-2 rounded-full bg-red-500"></span>
//                   <span className="text-gray-700 font-medium">Restaurant</span>
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
//                   <span className="text-gray-700 font-medium">Food Court</span>
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <span className="w-2 h-2 rounded-full bg-green-500"></span>
//                   <span className="text-gray-700 font-medium">Catering</span>
//                 </span>
//               </div>
//             </div>

//             {/* User Auth */}
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={handleAuthAction}
//                 className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors duration-200 font-medium"
//               >
//                 {isAuthenticated ? (
//                   <>
//                     <LogOut size={16} />
//                     Logout
//                   </>
//                 ) : (
//                   <>
//                     <User size={16} />
//                     Login
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>
//     </>
//   );
// };

// export default Header;
import React, { useState } from 'react';
import { Menu, X, Phone, MapPin, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../Images/finallogo.png';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleRestaurantOrder = () => {
    window.location.href = 'https://srimatha.co.in/';
  };

  const handleFoodCourtOrder = () => {
    window.location.href = 'https://srimatha.co.in/';
  };

  const handleCateringOrder = () => {
    navigate('/catering');
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      (window as any).openAuthModal?.('login');
    }
  };

  return (
    <>
      {/* Top Contact Bar */}
      <div className="hidden md:block bg-orange-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span>040-4859 5886/7</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>Secunderabad-500 003</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span>24/7 Catering Service Available</span>
            <button
              onClick={() => navigate('/admin')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className=" shadow-lg sticky top-0 z-50" style={{ backgroundColor: '#501608' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/')}
            >
              <img
                src={logo}
                alt="Srimatha Logo"
                className="w-auto h-24 object-contain mr-2"
              />
              {/* <h1 className="text-2xl font-bold text-gray-800">Srimatha</h1> */}
            </div>

            {/* Hamburger for small screens */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Center Nav for desktop */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex items-center gap-8">
                <button
                  onClick={handleRestaurantOrder}
                  className="flex items-center gap-1 hover:text-orange-600 transition"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="text-white-700 font-medium" style={{color: 'white'}}>Restaurant</span>
                </button>
                <button
                  onClick={handleFoodCourtOrder}
                  className="flex items-center gap-1 hover:text-orange-600 transition"
                >
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  <span className="text-white-700 font-medium"style={{color: 'white'}}>Food Court</span>
                </button>
                <button
                  onClick={handleCateringOrder}
                  className="flex items-center gap-1 hover:text-orange-600 transition"
                >
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className=" font-medium" style={{color: 'white'}}>Catering</span>
                </button>
              </div>
            </div>

            {/* Auth Button */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={handleAuthAction}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors duration-200 font-medium"
              >
                {isAuthenticated ? (
                  <>
                    <LogOut size={16} />
                    Logout
                  </>
                ) : (
                  <>
                    <User size={16} />
                    Login
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden px-4 pb-4">
            <div className="flex flex-col gap-4">
              <button
                onClick={handleRestaurantOrder}
                className="flex items-center gap-2 text-gray-700 hover:text-orange-600" style={{color: 'white'}}
              >
                <span className="w-2 h-2 rounded-full bg-red-500" ></span>
                Restaurant
              </button>
              <button
                onClick={handleFoodCourtOrder}
                className="flex items-center gap-2 text-gray-700 hover:text-orange-600" style={{color: 'white'}}
              >
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                Food Court
              </button>
              <button
                onClick={handleCateringOrder}
                className="flex items-center gap-2 text-gray-700 hover:text-orange-600" style={{color: 'white'}}
              >
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Catering
              </button>
              <button
                onClick={handleAuthAction}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors duration-200 font-medium"
              >
                {isAuthenticated ? (
                  <>
                    <LogOut size={16} />
                    Logout
                  </>
                ) : (
                  <>
                    <User size={16} />
                    Login
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
