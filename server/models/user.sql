-- SQL schema for users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address_street VARCHAR(100),
  address_city VARCHAR(50),
  address_state VARCHAR(50),
  address_zipcode VARCHAR(20),
  address_country VARCHAR(50) DEFAULT 'India',
  role VARCHAR(20) DEFAULT 'customer',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
