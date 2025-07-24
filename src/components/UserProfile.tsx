
import React, { useState, useEffect } from 'react';
import { Edit, Save, X, User, Mail, Phone, MapPin, Shield, Calendar } from 'lucide-react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

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
      name: string;
      email: string;
      phone: string;
      address_street: string;
      address_city: string;
      address_state: string;
      address_zipcode: string;
      address_country: string;
      role: string;
      created_at: string;
      is_active: boolean;
    };
  };
}

interface Props {
  profile: UserProfile;
  onClose: () => void;
  onUpdateSuccess?: () => void;
}

const UserProfileModal: React.FC<Props> = ({ profile, onClose, onUpdateSuccess }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = profile.data?.user || profile;
    setFormData({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address_street: data.address_street,
      address_city: data.address_city,
      address_state: data.address_state,
      address_zipcode: data.address_zipcode,
      address_country: data.address_country
    });
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const patchData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.address_street,
          city: formData.address_city,
          state: formData.address_state,
          zipcode: formData.address_zipcode,
          country: formData.address_country
        }
      };

      await authAPI.patchProfile(patchData);
      setEditMode(false);
      
      toast.success('Profile updated successfully!', {
        duration: 3000,
        position: 'top-right',
    
      });
      
      if (onUpdateSuccess) onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
      
      toast.error('Failed to update profile', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    if (editMode) {
      const data = profile.data?.user || profile;
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address_street: data.address_street,
        address_city: data.address_city,
        address_state: data.address_state,
        address_zipcode: data.address_zipcode,
        address_country: data.address_country
      });
      setEditMode(false);
      setError(null);
    } else {
      onClose();
    }
  };

  const data = profile.data?.user || profile;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex flex-col">
        <div className="p-6 text-white flex justify-between items-center" style={{ backgroundColor: '#501608' }}>
          <div>
            <h2 className="text-2xl font-bold">{data.name}</h2>
            <p className="text-orange-100">{data.role}</p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{error}</p>
              </div>
            )}

            {editMode ? (
              <form onSubmit={handleSubmit} className="p-8 space-y-6" style={{ color: 'black' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Name', name: 'name', icon: User },
                    { label: 'Email', name: 'email', icon: Mail, type: 'email' },
                    { label: 'Phone', name: 'phone', icon: Phone, type: 'tel' },
                    { label: 'Street', name: 'address_street', icon: MapPin },
                    { label: 'City', name: 'address_city', icon: MapPin },
                    { label: 'State', name: 'address_state', icon: MapPin },
                    { label: 'Zipcode', name: 'address_zipcode', icon: MapPin },
                    { label: 'Country', name: 'address_country', icon: MapPin },
                  ].map(({ label, name, icon: Icon, type = 'text' }) => (
                    <div key={name} className="">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Icon size={16} className="text-orange-600" />
                        {label}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={formData[name as keyof UserProfile] || ''}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg flex items-center gap-2 hover:bg-orange-700 transition disabled:bg-orange-400"
                  >
                    {isLoading ? (
                      'Saving...'
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                      <User size={32} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: '#501608' }}>
                        {data.name.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 text-white rounded-lg flex items-center gap-2 hover:bg-orange-700 transition"
                    style={{ backgroundColor: '#501608' }}
                  >
                    <Edit size={16} />
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-medium text-lg mb-4 flex items-center gap-2 text-orange-700">
                        <Mail size={20} />
                        Contact Information
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <p className="font-bold text-sm text-gray-500">Email</p>
                          <p className="text-gray-900">{data.email}</p>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-500">Phone</p>
                          <p className="text-gray-900">{data.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-medium text-lg mb-4 flex items-center gap-2 text-orange-700">
                        <Calendar size={20} />
                        Account Information
                      </h4>
                      <div>
                        <p className="font-bold text-sm text-gray-500">Member Since</p>
                        <p className="text-gray-900">
                          {new Date(data.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-medium text-lg mb-4 flex items-center gap-2 text-orange-700">
                      <MapPin size={20} />
                      Address
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <p className="font-bold text-sm text-gray-500">Street</p>
                        <p className="text-gray-900">{data.address_street || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-500">City/State/Zip</p>
                        <p className="text-gray-900">
                          {data.address_city}, {data.address_state} {data.address_zipcode}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-500">Country</p>
                        <p className="text-gray-900">{data.address_country}</p>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-500">Account Status</p>
                        <p className="text-gray-900">{data.is_active ? 'Active' : 'Inactive'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;