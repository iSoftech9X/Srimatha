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

export const srimathaMenu = [
  // Non-Veg Soups
  {
    id: 'chicken-clear-soup',
    name: 'Chicken Clear Soup',
    description: 'Light and flavorful clear chicken soup',
    price: 120,
    category: 'non-veg-soups',
    image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 15,
    spiceLevel: 'mild'
  },
  {
    id: 'chicken-manchow-soup',
    name: 'Chicken Manchow Soup',
    description: 'Spicy Indo-Chinese chicken soup with vegetables',
    price: 140,
    category: 'non-veg-soups',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 20,
    spiceLevel: 'medium'
  },
  {
    id: 'chicken-sweet-corn-soup',
    name: 'Chicken Sweet Corn Soup',
    description: 'Creamy chicken soup with sweet corn kernels',
    price: 130,
    category: 'non-veg-soups',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 18,
    spiceLevel: 'mild'
  },

  // Non-Veg Starters
  {
    id: 'chicken-65',
    name: 'Chicken 65',
    description: 'Spicy deep-fried chicken appetizer with curry leaves',
    price: 280,
    category: 'non-veg-starters',
    image: 'https://images.pexels.com/photos/5864474/pexels-photo-5864474.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 25,
    spiceLevel: 'hot',
    popular: true
  },
  {
    id: 'chilli-chicken',
    name: 'Chilli Chicken',
    description: 'Indo-Chinese style chicken with bell peppers and onions',
    price: 320,
    category: 'non-veg-starters',
    image: 'https://images.pexels.com/photos/3622479/pexels-photo-3622479.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 30,
    spiceLevel: 'medium',
    popular: true
  },
  {
    id: 'chicken-drumsticks',
    name: 'Chicken Drumsticks',
    description: 'Marinated and grilled chicken drumsticks',
    price: 350,
    category: 'non-veg-starters',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 35,
    spiceLevel: 'medium'
  },
  {
    id: 'crispy-fried-chicken',
    name: 'Crispy Fried Chicken',
    description: 'Golden crispy fried chicken pieces',
    price: 300,
    category: 'non-veg-starters',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 25,
    spiceLevel: 'mild'
  },

  // Fish & Prawns Curries
  {
    id: 'fish-curry',
    name: 'Fish Curry',
    description: 'Traditional South Indian fish curry with coconut',
    price: 380,
    category: 'fish-prawns-curries',
    image: 'https://images.pexels.com/photos/3622479/pexels-photo-3622479.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 30,
    spiceLevel: 'medium',
    popular: true
  },
  {
    id: 'fish-fry',
    name: 'Fish Fry',
    description: 'Crispy fried fish with South Indian spices',
    price: 420,
    category: 'fish-prawns-curries',
    image: 'https://images.pexels.com/photos/725996/pexels-photo-725996.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 25,
    spiceLevel: 'medium'
  },
  {
    id: 'fish-pulusu',
    name: 'Fish Pulusu',
    description: 'Tangy fish curry with tamarind and spices',
    price: 360,
    category: 'fish-prawns-curries',
    image: 'https://images.pexels.com/photos/3622479/pexels-photo-3622479.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 35,
    spiceLevel: 'medium'
  },
  {
    id: 'prawns-curry',
    name: 'Prawns Curry',
    description: 'Delicious prawns cooked in coconut curry',
    price: 450,
    category: 'fish-prawns-curries',
    image: 'https://images.pexels.com/photos/725996/pexels-photo-725996.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 30,
    spiceLevel: 'medium'
  },
  {
    id: 'prawns-fry',
    name: 'Prawns Fry',
    description: 'Crispy fried prawns with aromatic spices',
    price: 480,
    category: 'fish-prawns-curries',
    image: 'https://images.pexels.com/photos/725996/pexels-photo-725996.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 25,
    spiceLevel: 'medium'
  },

  // Biryanis & Pulaos
  {
    id: 'chicken-dum-biryani',
    name: 'Chicken Dum Biryani',
    description: 'Aromatic basmati rice layered with spiced chicken',
    price: 320,
    category: 'biryanis-pulaos',
    image: 'https://images.pexels.com/photos/15953175/pexels-photo-15953175.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 45,
    spiceLevel: 'medium',
    popular: true
  },
  {
    id: 'chicken-fry-biryani',
    name: 'Chicken Fry Biryani',
    description: 'Biryani with fried chicken pieces and fragrant rice',
    price: 350,
    category: 'biryanis-pulaos',
    image: 'https://images.pexels.com/photos/15953175/pexels-photo-15953175.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 40,
    spiceLevel: 'medium'
  },
  {
    id: 'mutton-biryani',
    name: 'Mutton Biryani',
    description: 'Rich and flavorful mutton biryani with tender meat',
    price: 420,
    category: 'biryanis-pulaos',
    image: 'https://images.pexels.com/photos/15953175/pexels-photo-15953175.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 50,
    spiceLevel: 'medium',
    popular: true
  },
  {
    id: 'chicken-pulao',
    name: 'Chicken Pulao',
    description: 'Mildly spiced rice dish with chicken pieces',
    price: 280,
    category: 'biryanis-pulaos',
    image: 'https://images.pexels.com/photos/15953175/pexels-photo-15953175.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 35,
    spiceLevel: 'mild'
  },
  {
    id: 'mutton-pulao',
    name: 'Mutton Pulao',
    description: 'Fragrant rice cooked with tender mutton pieces',
    price: 350,
    category: 'biryanis-pulaos',
    image: 'https://images.pexels.com/photos/15953175/pexels-photo-15953175.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 40,
    spiceLevel: 'mild'
  },

  // Kodi Vepudu (Chicken Dry)
  {
    id: 'kaju-kodi-vepudu',
    name: 'Kaju Kodi Vepudu',
    description: 'Dry chicken curry with cashews and spices',
    price: 380,
    category: 'kodi-vepudu',
    image: 'https://images.pexels.com/photos/5864474/pexels-photo-5864474.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 35,
    spiceLevel: 'medium'
  },
  {
    id: 'karivepaku-kodi-vepudu',
    name: 'Karivepaku Kodi Vepudu',
    description: 'Chicken dry curry with curry leaves',
    price: 350,
    category: 'kodi-vepudu',
    image: 'https://images.pexels.com/photos/5864474/pexels-photo-5864474.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 30,
    spiceLevel: 'medium'
  },
  {
    id: 'gongura-kodi-vepudu',
    name: 'Gongura Kodi Vepudu',
    description: 'Tangy chicken curry with gongura leaves',
    price: 370,
    category: 'kodi-vepudu',
    image: 'https://images.pexels.com/photos/5864474/pexels-photo-5864474.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 35,
    spiceLevel: 'medium'
  },

  // Kodi Kura (Chicken Curry)
  {
    id: 'kodi-kura',
    name: 'Kodi Kura',
    description: 'Traditional Andhra chicken curry',
    price: 320,
    category: 'kodi-kura',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 35,
    spiceLevel: 'medium'
  },
  {
    id: 'kothimeera-kodi-kura',
    name: 'Kothimeera Kodi Kura',
    description: 'Chicken curry with fresh coriander',
    price: 340,
    category: 'kodi-kura',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 30,
    spiceLevel: 'medium'
  },
  {
    id: 'andhra-kodi-kura',
    name: 'Andhra Kodi Kura',
    description: 'Spicy Andhra style chicken curry',
    price: 360,
    category: 'kodi-kura',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 35,
    spiceLevel: 'hot'
  },

  // Mutton Curries
  {
    id: 'mutton-curry',
    name: 'Mutton Curry',
    description: 'Rich and spicy mutton curry',
    price: 450,
    category: 'mutton-curries',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 60,
    spiceLevel: 'medium'
  },
  {
    id: 'mutton-fry',
    name: 'Mutton Fry',
    description: 'Dry mutton preparation with aromatic spices',
    price: 480,
    category: 'mutton-curries',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 55,
    spiceLevel: 'medium'
  },
  {
    id: 'mutton-keema',
    name: 'Mutton Keema',
    description: 'Minced mutton curry with peas',
    price: 420,
    category: 'mutton-curries',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 45,
    spiceLevel: 'medium'
  },

  // Veg Starters
  {
    id: 'gobi-65',
    name: 'Gobi 65',
    description: 'Spicy cauliflower appetizer',
    price: 180,
    category: 'veg-starters',
    image: 'https://images.pexels.com/photos/8879576/pexels-photo-8879576.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 20,
    spiceLevel: 'medium'
  },
  {
    id: 'paneer-65',
    name: 'Paneer 65',
    description: 'Crispy fried paneer with spices',
    price: 220,
    category: 'veg-starters',
    image: 'https://images.pexels.com/photos/5864474/pexels-photo-5864474.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 25,
    spiceLevel: 'medium',
    popular: true
  },
  {
    id: 'mushroom-65',
    name: 'Mushroom 65',
    description: 'Spicy mushroom starter',
    price: 200,
    category: 'veg-starters',
    image: 'https://images.pexels.com/photos/8879576/pexels-photo-8879576.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 20,
    spiceLevel: 'medium'
  },

  // Veg Curries
  {
    id: 'dal-tadka',
    name: 'Dal Tadka',
    description: 'Yellow lentils tempered with spices',
    price: 150,
    category: 'veg-curries',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 25,
    spiceLevel: 'mild'
  },
  {
    id: 'paneer-butter-masala',
    name: 'Paneer Butter Masala',
    description: 'Creamy paneer curry in tomato gravy',
    price: 280,
    category: 'veg-curries',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 30,
    spiceLevel: 'mild',
    popular: true
  },
  {
    id: 'aloo-gobi',
    name: 'Aloo Gobi',
    description: 'Potato and cauliflower curry',
    price: 180,
    category: 'veg-curries',
    image: 'https://images.pexels.com/photos/8879576/pexels-photo-8879576.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 25,
    spiceLevel: 'mild'
  },

  // Rice Items
  {
    id: 'veg-fried-rice',
    name: 'Veg Fried Rice',
    description: 'Stir-fried rice with mixed vegetables',
    price: 180,
    category: 'rice-items',
    image: 'https://images.pexels.com/photos/15953175/pexels-photo-15953175.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 20,
    spiceLevel: 'mild'
  },
  {
    id: 'chicken-fried-rice',
    name: 'Chicken Fried Rice',
    description: 'Fried rice with chicken pieces',
    price: 220,
    category: 'rice-items',
    image: 'https://images.pexels.com/photos/15953175/pexels-photo-15953175.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 25,
    spiceLevel: 'mild'
  },
  {
    id: 'jeera-rice',
    name: 'Jeera Rice',
    description: 'Cumin flavored basmati rice',
    price: 120,
    category: 'rice-items',
    image: 'https://images.pexels.com/photos/15953175/pexels-photo-15953175.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 15,
    spiceLevel: 'mild'
  },

  // Breads
  {
    id: 'butter-naan',
    name: 'Butter Naan',
    description: 'Soft bread with butter',
    price: 60,
    category: 'breads',
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 10,
    spiceLevel: 'none'
  },
  {
    id: 'garlic-naan',
    name: 'Garlic Naan',
    description: 'Naan bread with garlic and herbs',
    price: 80,
    category: 'breads',
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 12,
    spiceLevel: 'mild'
  },
  {
    id: 'roti',
    name: 'Roti',
    description: 'Traditional Indian flatbread',
    price: 40,
    category: 'breads',
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 8,
    spiceLevel: 'none'
  },

  // Beverages
  {
    id: 'masala-chai',
    name: 'Masala Chai',
    description: 'Spiced tea with milk',
    price: 40,
    category: 'beverages',
    image: 'https://images.pexels.com/photos/7283289/pexels-photo-7283289.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 5,
    spiceLevel: 'mild'
  },
  {
    id: 'fresh-lime-water',
    name: 'Fresh Lime Water',
    description: 'Refreshing lime water with mint',
    price: 60,
    category: 'beverages',
    image: 'https://images.pexels.com/photos/7869266/pexels-photo-7869266.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 3,
    spiceLevel: 'none'
  },
  {
    id: 'buttermilk',
    name: 'Buttermilk',
    description: 'Traditional spiced buttermilk',
    price: 50,
    category: 'beverages',
    image: 'https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 5,
    spiceLevel: 'mild'
  },

  // Desserts
  {
    id: 'gulab-jamun',
    name: 'Gulab Jamun',
    description: 'Sweet milk dumplings in sugar syrup',
    price: 80,
    category: 'desserts',
    image: 'https://images.pexels.com/photos/4725030/pexels-photo-4725030.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 5,
    spiceLevel: 'none'
  },
  {
    id: 'rasmalai',
    name: 'Rasmalai',
    description: 'Soft cottage cheese dumplings in sweet milk',
    price: 100,
    category: 'desserts',
    image: 'https://images.pexels.com/photos/6078387/pexels-photo-6078387.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 5,
    spiceLevel: 'none'
  },
  {
    id: 'ice-cream',
    name: 'Ice Cream',
    description: 'Assorted flavors of ice cream',
    price: 60,
    category: 'desserts',
    image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 2,
    spiceLevel: 'none'
  }
];

export const menuItems = srimathaMenu;

// Restaurant contact details from the menu
export const restaurantInfo = {
  name: 'Srimatha',
  tagline: 'Serving Culinary Delights that Satisfy Every Palate!',
  phone: '040-4859 5886/7',
  mobile: '(+91)74166 70123',
  website: 'www.srimatha.co.in',
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