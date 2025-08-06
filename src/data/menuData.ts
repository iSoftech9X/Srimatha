// Only export menuCategories and restaurantInfo for static use (e.g., dropdowns, info)
export const menuCategories = [
  { id: 'non-veg-soups', name: 'Non-Veg Soups' },
  { id: 'non-veg-starters', name: 'Non-Veg Starters' },
  { id: 'fish-prawns-curries', name: 'Fish & Prawns Curries' },
  { id: 'biryanis-pulaos', name: 'Biryanis & Pulaos' },
  { id: 'kodi-vepudu', name: 'Kodi Vepudu' },
  { id: 'kodi-kura', name: 'Kodi Kura' },
  { id: 'mutton-curries', name: 'Mutton Curries' },
  { id: 'veg-starters', name: 'Veg Starters' },
  { id: 'veg-curries', name: 'Veg Curries' },
  { id: 'dal-sambar', name: 'Dal & Sambar' },
  { id: 'rice-items', name: 'Rice Items' },
  { id: 'breads', name: 'Breads' },
  { id: 'beverages', name: 'Beverages' },
  { id: 'desserts', name: 'Desserts' }
];

// REMOVE ALL STATIC MENU DATA EXPORTS
// All menu data must be fetched from backend API, not from this file.

export const restaurantInfo = {
  name: 'Srimatha',
  tagline: 'Serving Culinary Delights that Satisfy Every Palate!',
  phone: '040-4859 5886/7',
  mobile: '(+91)74166 70123',
  website: 'www.srimatha.co.in',
  email: 'info@srimatha.com',
  address: {
    line1: 'Plot1/P, Sri Sai Balaji Towers',
    line2: 'Rajeev Gandhi Nagar Colony,',
    line3: 'Secunderabad-500 003'
  },
  qrCode: 'Scan QR CODE for Menu selection',
  socialMedia: {
    linkedin: 'linkedin',
    facebook: 'facebook',
    youtube: 'youtube'
  },
  services: {
    veg: 'VEG CATERING',
    nonVeg: 'NON-VEG CATERING'
  }
};