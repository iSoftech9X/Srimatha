import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Contactquotes = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const response = await api.get('/contact', { 
          params: { 
            page: 1, 
            limit: 1000000000 // Set a very high limit to fetch all contacts
          } 
        });
        const contactsData = response.data?.data?.contacts || [];
        setContacts(contactsData);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const markAsRead = async (id) => {
    try {
      await api.patch(`/contact/${id}`, { status: 'read' });
      setContacts(contacts.map(contact => 
        contact.id === id ? { ...contact, status: 'read' } : contact
      ));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    markAsRead(contact.id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {filteredContacts.length}
          </span>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* <select
            className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Messages</option>
            <option value="new">New</option>
            <option value="read">Read</option>
          </select> */}
        </div>
      </div>
      
      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-lg bg-gray-50">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No messages found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Contact List */}
          <div className={`${selectedContact && !isMobile ? 'lg:w-2/3' : 'w-full'} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4`}>
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleContactSelect(contact)}
                className={`relative bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  contact.status === 'new' ? 'border-l-4 border-blue-500' : ''
                } ${selectedContact?.id === contact.id ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-medium text-gray-900 truncate pr-2">{contact.subject}</h3>
                   
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span className="truncate">{contact.name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="truncate">{contact.email}</span>
                    </div>
                  </div>
                  
                  <p className="mt-3 text-sm text-gray-500 line-clamp-2">{contact.message}</p>
                  
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>{formatDate(contact.created_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{formatTime(contact.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Contact Details - Desktop */}
          {selectedContact && !isMobile && (
            <div className="lg:w-1/3 sticky top-6 h-fit">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedContact.subject}</h3>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">{selectedContact.name}</h4>
                      <p className="text-sm text-gray-500">{selectedContact.email}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gray-50 rounded-md p-4">
                    <p className="text-sm text-gray-700">{selectedContact.message}</p>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="bg-gray-50 rounded-md p-4">
                      <p className="text-xs font-medium text-gray-500">Phone</p>
                      <p className="mt-1 text-sm font-medium text-gray-900 flex items-center">
                        <svg className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        {selectedContact.phone || 'Not provided'}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-md p-4">
                      <p className="text-xs font-medium text-gray-500">Date Received</p>
                      <p className="mt-1 text-sm font-medium text-gray-900 flex items-center">
                        <svg className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {formatDate(selectedContact.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Contact Details - Mobile (Modal) */}
          {selectedContact && isMobile && (
            <div className="fixed inset-0 overflow-y-auto z-50">
              <div className="flex items-end justify-center min-h-screen pt-6 px-8 text-center sm:block sm:p-0" style={{ paddingBottom:"250px" } }>
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setSelectedContact(null)}></div>
                </div> 
                
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                <div className="inline-block align-bottom bg-white rounded-t-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                  <div> 
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedContact.subject}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>{formatDate(selectedContact.created_at)}</span>
                          <span className="mx-1">·</span>
                          <span>{formatTime(selectedContact.created_at)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedContact(null)}
                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="mt-4 flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">{selectedContact.name}</h4>
                        <p className="text-sm text-gray-500">{selectedContact.email}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-gray-50 rounded-md p-4">
                      <p className="text-sm text-gray-700">{selectedContact.message}</p>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 gap-4">
                      <div className="bg-gray-50 rounded-md p-4">
                        <p className="text-xs font-medium text-gray-500">Phone</p>
                        <p className="mt-1 text-sm font-medium text-gray-900 flex items-center">
                          <svg className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          {selectedContact.phone || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                 
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Contactquotes;