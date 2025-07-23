import React, { useState } from 'react';
import { Edit, Save, X, User, Mail, Phone, MapPin, Shield, Calendar } from 'lucide-react';

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
}

const UserProfileModal: React.FC<Props> = ({ profile, onClose }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>(profile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await getProfile.put('/auth/profile', formData);
      setEditMode(false);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    if (editMode) {
      setFormData(profile); // Reset form data
      setEditMode(false); // Exit edit mode
    } else {
      onClose(); // Close modal
    }
  };

  const data = profile.data?.user || profile;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex flex-col">
   
        <div className=" p-6 text-white flex justify-between items-center" style={{ backgroundColor: '#501608' }}>
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

        {/* Content */}
        <div className="flex-1 bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            {editMode ? (
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
                    <div key={name} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Icon size={16} className="text-orange-600" />
                        {label}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={formData[name as keyof UserProfile] || ''}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg flex items-center gap-2 hover:bg-orange-700 transition"
                  >
                    <Save size={16} />
                    Save Changes
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
                      <h3 className="text-2xl font-bold">{profile.name}</h3>
                      <p className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: '#501608' }}>{data.name.toUpperCase()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2  text-white rounded-lg flex items-center gap-2 hover:bg-orange-700 transition" style={{ backgroundColor: '#501608' }}
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
                          <p className=" font-bold text-sm text-gray-500">Email</p>
                          <p className=" text-gray-900">{data.email}</p>
                        </div>
                        <div>
                          <p className=" font-bold text-sm text-gray-500">Phone</p>
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
                        <p className=" font-bold text-sm text-gray-500">Member Since</p>
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
                          <p className=" font-bold text-sm text-gray-500">Address_Street</p>
                         <p className="text-gray-900">{data.address_street || 'Not provided'}</p>
                        </div>
                       <div>
                          <p className=" font-bold text-sm text-gray-500">Address_city</p>
                      <p className="text-gray-900">{data.address_city}, {data.address_state} {data.address_zipcode}</p>
                        </div>
                     

                      <div>
                          <p className=" font-bold text-sm text-gray-500">Address_Country</p>
                       <p className="text-gray-900">{data.address_country}</p>
                        </div>
                   <div>
                            <p className=" font-bold text-sm text-gray-500">Account-Status</p>
                            <p>{data.is_active ? 'Active' : 'Deactive'}</p>
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
