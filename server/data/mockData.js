// Mock data for development when MongoDB is not available
export const mockMenuItems = [
  {
    _id: '1',
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice cooked with tender chicken pieces and traditional spices',
    price: 299,
    category: 'main-course',
    image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg',
    isVegetarian: false,
    isAvailable: true,
    preparationTime: 25,
    spiceLevel: 'medium',
    ingredients: ['Basmati Rice', 'Chicken', 'Onions', 'Yogurt', 'Spices'],
    nutritionalInfo: {
      calories: 450,
      protein: 25,
      carbs: 55,
      fat: 12
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    name: 'Paneer Butter Masala',
    description: 'Creamy tomato-based curry with soft paneer cubes',
    price: 249,
    category: 'main-course',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 20,
    spiceLevel: 'mild',
    ingredients: ['Paneer', 'Tomatoes', 'Cream', 'Butter', 'Spices'],
    nutritionalInfo: {
      calories: 320,
      protein: 15,
      carbs: 12,
      fat: 25
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato filling',
    price: 149,
    category: 'breakfast',
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 15,
    spiceLevel: 'mild',
    ingredients: ['Rice', 'Lentils', 'Potatoes', 'Onions', 'Spices'],
    nutritionalInfo: {
      calories: 280,
      protein: 8,
      carbs: 45,
      fat: 8
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '4',
    name: 'Samosa',
    description: 'Crispy triangular pastry filled with spiced potatoes and peas',
    price: 49,
    category: 'appetizer',
    image: 'https://images.pexels.com/photos/14477/pexels-photo-14477.jpeg',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 10,
    spiceLevel: 'mild',
    ingredients: ['Flour', 'Potatoes', 'Peas', 'Spices'],
    nutritionalInfo: {
      calories: 150,
      protein: 4,
      carbs: 20,
      fat: 6
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '5',
    name: 'Gulab Jamun',
    description: 'Soft milk dumplings soaked in rose-flavored sugar syrup',
    price: 99,
    category: 'dessert',
    image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 5,
    spiceLevel: 'none',
    ingredients: ['Milk Powder', 'Sugar', 'Rose Water', 'Cardamom'],
    nutritionalInfo: {
      calories: 180,
      protein: 3,
      carbs: 35,
      fat: 4
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '6',
    name: 'Mango Lassi',
    description: 'Refreshing yogurt-based drink with fresh mango',
    price: 79,
    category: 'beverage',
    image: 'https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg',
    isVegetarian: true,
    isAvailable: true,
    preparationTime: 5,
    spiceLevel: 'none',
    ingredients: ['Yogurt', 'Mango', 'Sugar', 'Cardamom'],
    nutritionalInfo: {
      calories: 120,
      protein: 4,
      carbs: 25,
      fat: 2
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const mockUsers = [
  {
    _id: 'admin1',
    name: 'Admin User',
    email: 'admin@srimatha.com',
    password: '$2b$10$hash', // This would be hashed in real implementation
    role: 'admin',
    phone: '+91 9876543210',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const mockOrders = [];
export const mockContacts = [];