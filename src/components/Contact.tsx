
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Calendar, MessageSquare } from 'lucide-react';
import { restaurantInfo } from '../data/menuData';
import toast from 'react-hot-toast';
import { contactAPI } from '../services/api';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await contactAPI.submitForm({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      });

      if (response && (response.status === 201 || response.success)) {
        toast.success('Contact form submitted successfully. We will get back to you soon');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Contact form error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Failed to send message. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOrderNow = () => {
    window.location.href = 'https://orders.srimatha.co.in';
  };

  const handleCateringQuote = () => {
    window.location.href = '/catering';
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Get In <span className="text-orange-600">Touch</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to experience exceptional dining? Contact us for reservations, catering inquiries, or any questions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="text-orange-600 mt-1 mr-4 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Address</h4>
                    <p className="text-gray-600">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${restaurantInfo.address.line1}, ${restaurantInfo.address.line2}, ${restaurantInfo.address.line3}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:underline"
                      >
                        {restaurantInfo.address.line1}<br />
                        {restaurantInfo.address.line2}<br />
                        {restaurantInfo.address.line3}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="text-orange-600 mt-1 mr-4 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Phone</h4>
                    <p className="text-gray-600">
                      <a href={`tel:${restaurantInfo.phone}`} className="text-black hover:underline">
                        Restaurant: {restaurantInfo.phone}
                      </a><br />
                      <a href={`tel:${restaurantInfo.mobile}`} className="text-black hover:underline">
                        Catering: {restaurantInfo.mobile}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="text-orange-600 mt-1 mr-4 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                    <p className="text-gray-600">
                      <a href={`mailto:${restaurantInfo.email}`} className="text-black hover:underline">
                        {restaurantInfo.email}
                      </a><br />
                      <a href={`mailto:${restaurantInfo.cateringEmail}`} className="text-black hover:underline">
                        {restaurantInfo.cateringEmail}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="text-orange-600 mt-1 mr-4 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Operating Hours</h4>
                    <p className="text-gray-600">
                      Monday - Sunday: 11:00 AM - 11:00 PM<br />
                      Catering: 24/7 Service Available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-bold text-gray-800">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleOrderNow}
                  className="flex items-center justify-center bg-[#501608] hover:bg-[#722010] text-white p-4 rounded-lg font-semibold transition-colors duration-300"
                >
                  <Calendar className="mr-2" size={20} />
                  Order Now
                </button>
                <button 
                  onClick={handleCateringQuote}
                  className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg font-semibold transition-colors duration-300"
                >
                  <MessageSquare className="mr-2" size={20} />
                  Catering Quote
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder=" Enter Your first name"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder=" Enter Your last name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+91 98765 43210"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                  disabled={loading}
                >
                  <option value="">Select a subject</option>
                  <option value="reservation">Table Reservation</option>
                  <option value="catering">Catering Inquiry</option>
                  <option value="feedback">Feedback</option>
                  <option value="complaint">Complaint</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
                  placeholder="Tell us how we can help you..."
                  required
                  disabled={loading}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#501608] hover:bg-[#722010] text-white py-3 rounded-lg font-semibold transition-colors duration-300" 
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <h3 className="text-2xl font-bold text-gray-800 p-6 pb-0">Our Location</h3>
            <div className="p-4">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3804.578781587917!2d78.36560867463004!3d17.527609598751525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb8d5401fd3031%3A0xf3978e60312fdb56!2sSri%20Matha%20Family%20Restaurant!5e0!3m2!1sen!2sin!4v1752830527267!5m2!1sen!2sin" 
                width="100%" 
                height="450" 
                style={{border:0}} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Sri Matha Family Restaurant Location"
              ></iframe>
            </div>
            <div className="p-6 pt-0">
              <p className="text-gray-600">
                {restaurantInfo.address.line1}, {restaurantInfo.address.line2}, {restaurantInfo.address.line3}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;