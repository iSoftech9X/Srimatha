
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Contactquotes = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const response = await api.get('/contact', { params: { page: 1, limit: 10 } });
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


  return (
    <div style={{ 
      maxWidth: 1200, 
      margin: '2rem auto', 
      fontFamily: "'Inter', sans-serif",
      padding: '0 20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <h2 style={{ 
          margin: 0, 
          color: '#000000ff',
          fontSize: '2rem',
          fontWeight: 700,
          
          WebkitBackgroundClip: 'text',
         
        }}>
          Contact Messages
        </h2>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 15px 10px 40px',
                borderRadius: '25px',
                border: '1px solid #e0e0e0',
                outline: 'none',
                fontSize: '14px',
                width: '200px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.3s'
              }}
            />
            <span style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#95a5a6'
            }}>🔍</span>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '50px 20px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ color: '#7f8c8d', marginBottom: '10px' }}>No contacts found</h3>
          <p style={{ color: '#95a5a6' }}>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: selectedContact ? '1fr 2fr' : '1fr',
          gap: '25px',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
            alignContent: 'start'
          }}>
            {filteredContacts.map((contact) => (
              <div 
                key={contact.id}
                onClick={() => {
                  setSelectedContact(contact);
                  markAsRead(contact.id);
                }}
                style={{
                  backgroundColor: contact.status === 'new' ? '#f8f9fa' : '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  borderLeft: contact.status === 'new' ? '4px solid #3498db' : '4px solid transparent',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
              >
                {/*  */}
                <h3 style={{ 
                  margin: '0 0 10px', 
                  color: '#2c3e50',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {contact.subject}
                </h3>
                <p style={{ 
                  margin: '0 0 6px', 
                  fontSize: '14px', 
                  color: '#000000ff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  <strong>{contact.name}</strong> <br></br>
                  <strong>{contact.email}</strong>
                </p>
                <p style={{ 
                  fontStyle: 'italic', 
                  color: '#555', 
                  margin: '10px 0',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {contact.message}
                </p>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#95a5a6',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>{new Date(contact.created_at).toLocaleDateString()}</span>

                </p>
              </div>
            ))}
          </div>
          
          {selectedContact && (
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
              padding: '30px',
              position: 'sticky',
              top: '20px',
              height: 'fit-content',
              animation: 'fadeIn 0.3s ease'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{ 
                  margin: 0, 
                  color: '#2c3e50',
                  fontSize: '1.5rem'
                }}>
                  {selectedContact.subject}
                </h3>
                <button 
                  onClick={() => setSelectedContact(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    color: '#95a5a6',
                    padding: '5px'
                  }}
                >
                  ✕
                </button>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#e3f2fd',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#000000ff',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>
                  {selectedContact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 5px', color: '#000000ff' }}>
                    {selectedContact.name}
                  </h4>
                  <p style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>
                    {selectedContact.email}
                  </p>
                </div>
              </div>
              
              <div style={{ 
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <p style={{ 
                  margin: 0, 
                  color: '#555',
                  lineHeight: '1.6'
                }}>
                  {selectedContact.message}
                </p>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div style={{
                  backgroundColor: '#f0f7ff',
                  borderRadius: '8px',
                  padding: '15px'
                }}>
                  <p style={{ 
                    margin: '0 0 5px', 
                    fontSize: '12px',
                    color: '#7f8c8d'
                  }}>
                    Phone
                  </p>
                  <p style={{ 
                    margin: 0, 
                    fontWeight: '500',
                    color: '#2c3e50'
                  }}>
                    {selectedContact.phone || 'Not provided'}
                  </p>
                </div>
                
                
                
                <div style={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  padding: '15px'
                }}>
                  <p style={{ 
                    margin: '0 0 5px', 
                    fontSize: '12px',
                    color: '#7f8c8d'
                  }}>
                    Date Received
                  </p>
                  <p style={{ 
                    margin: 0, 
                    fontWeight: '500',
                    color: '#2c3e50'
                  }}>
                    {new Date(selectedContact.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
              </div>
            </div>
          )}
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Contactquotes;