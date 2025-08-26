
import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MapPin, User, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../Images/finallogo.png';
import getProfile from '../services/api';
import UserProfileModal from "../components/UserProfile";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zipcode: string;
  address_country: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  data?: {
    user: {
      email: string;
      phone: string;
      address_street: string;
      address_city: string;
      address_state: string;
      address_zipcode: string;
      address_country: string;
      role: string;
      created_at: string;
    };
  };
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated && isProfileOpen) {
      fetchProfile();
    }
  }, [isAuthenticated, isProfileOpen]);

  const fetchProfile = async () => {
    try {
      const response = await getProfile.get('/auth/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleRestaurantOrder = () => window.location.href = 'https://orders.srimatha.co.in';
  const handleFoodCourtOrder = () => window.location.href = 'https://orders.srimatha.co.in';
  const handleCateringOrder = () => navigate('/catering');

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
    } else {
      (window as any).openAuthModal?.('login');
    }
  };

  return (
    <>
      {/* Top Bar */}
      

      {/* Header */}
      <header className="shadow-lg sticky top-0 z-50 bg-[#501608]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-0">
            {/* Logo - Fixed width */}
            <div onClick={() => navigate('/')} className="cursor-pointer w-1/4">
              <img src={logo} alt="Srimatha Logo" className="h-24 object-contain" />
            </div>

            {/* Desktop Navigation - Fixed width and centered */}
            <div className="hidden md:flex w-2/4 justify-center">
              <nav className="flex gap-8 items-center text-white">
                <button onClick={handleRestaurantOrder} className="flex items-center gap-1 hover:text-orange-300">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className='text-white-800 font-bold ml-2 mr-4'>Restaurant</span>
                  
                </button>
                <button onClick={handleFoodCourtOrder} className="flex items-center gap-1 hover:text-orange-300">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                   <span className='text-white-800 font-bold ml-2  mr-4'> Food Court</span>
                 
                </button>
                <button onClick={handleCateringOrder} className="flex items-center gap-1 hover:text-orange-300">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className='text-white-800 font-bold  ml-2 mr-4'> Catering</span>
             
                </button>
              </nav>
            </div>

            {/* Auth + Profile - Fixed width */}
            <div className="flex md:w-1/4 justify-end items-center gap-4 relative">
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>

              {/* Desktop Auth */}
              <div className="hidden md:flex items-center gap-4">
                {isAuthenticated && (
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 text-white hover:text-orange-300"
                  >
                    <User size={20} />
                    {profile?.name || 'Profile'}
                    {isProfileOpen }
                  </button>
                )}
                <button
                  onClick={handleAuthAction}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700"
                >
                  {isAuthenticated ? <><LogOut size={16} /> Logout</> : <><User size={16} /> Login</>}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden px-4 pb-4">
              <div className="flex flex-col gap-4 text-white">
                <button onClick={handleRestaurantOrder} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> Restaurant
                </button>
                <button onClick={handleFoodCourtOrder} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Food Court
                </button>
                <button onClick={handleCateringOrder} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Catering
                </button>
                {isAuthenticated && (
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2">
                    <User size={16} /> Profile
                  </button>
                )}
                <button
                  onClick={handleAuthAction}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700"
                >
                  {isAuthenticated ? <><LogOut size={16} /> Logout</> : <><User size={16} /> Login</>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Modal */}
        {isProfileOpen && profile && (
          <UserProfileModal
            profile={profile}
            onClose={() => setIsProfileOpen(false)}
          />
        )}
      </header>
    </>
  );
};

export default Header;