import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import MenuItem from '../models/MenuItem.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/srimatha-restaurant');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = new User({
      name: 'Srimatha Admin',
      email: 'admin@srimatha.com',
      password: adminPassword,
      phone: '+91 98765 43210',
      role: 'admin',
      address: {
        street: '123 Food Street',
        city: 'Culinary City',
        state: 'Karnataka',
        zipCode: '560001',
        country: 'India'
      }
    });
    await admin.save();
    console.log('Admin user created');

    // Create demo customer
    const customerPassword = await bcrypt.hash('user123', 12);
    const customer = new User({
      name: 'Demo User',
      email: 'user@example.com',
      password: customerPassword,
      phone: '+91 87654 32109',
      role: 'customer',
      address: {
        street: '456 Demo Street',
        city: 'Test City',
        state: 'Karnataka',
        zipCode: '560002',
        country: 'India'
      }
    });
    await customer.save();
    console.log('Demo customer created');

    // Create menu items
    const menuItems = [
      {
        name: 'Crispy Calamari',
        description: 'Fresh squid rings with tangy marinara sauce',
        price: 450,
        category: 'appetizers',
        image: {
          url: 'https://images.pexels.com/photos/725996/pexels-photo-725996.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
        },
        ingredients: ['Squid', 'Flour', 'Marinara Sauce', 'Herbs'],
        allergens: ['shellfish', 'wheat'],
        isPopular: true,
        isAvailable: true,
        preparationTime: 15,
        createdBy: admin._id
      },
      {
        name: 'Paneer Tikka',
        description: 'Marinated cottage cheese grilled to perfection',
        price: 420,
        category: 'appetizers',
        image: {
          url: 'https://images.pexels.com/photos/5864474/pexels-photo-5864474.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
        },
        ingredients: ['Paneer', 'Yogurt', 'Spices', 'Bell Peppers'],
        allergens: ['dairy'],
        isVegetarian: true,
        isPopular: true,
        isAvailable: true,
        preparationTime: 20,
        createdBy: admin._id
      },
      {
        name: 'Butter Chicken',
        description: 'Tender chicken in rich tomato and cream sauce',
        price: 650,
        category: 'main-course',
        image: {
          url: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
        },
        ingredients: ['Chicken', 'Tomato', 'Cream', 'Butter', 'Spices'],
        allergens: ['dairy'],
        isPopular: true,
        isAvailable: true,
        preparationTime: 25,
        createdBy: admin._id
      },
      {
        name: 'Vegetable Biryani',
        description: 'Aromatic basmati rice with mixed vegetables',
        price: 480,
        category: 'main-course',
        image: {
          url: 'https://images.pexels.com/photos/15953175/pexels-photo-15953175.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
        },
        ingredients: ['Basmati Rice', 'Mixed Vegetables', 'Saffron', 'Spices'],
        allergens: [],
        isVegetarian: true,
        isVegan: true,
        isPopular: true,
        isAvailable: true,
        preparationTime: 30,
        createdBy: admin._id
      },
      {
        name: 'Grilled Salmon',
        description: 'Atlantic salmon with lemon herb butter',
        price: 850,
        category: 'main-course',
        image: {
          url: 'https://images.pexels.com/photos/3622479/pexels-photo-3622479.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
        },
        ingredients: ['Salmon', 'Lemon', 'Herbs', 'Butter'],
        allergens: ['fish', 'dairy'],
        isAvailable: true,
        preparationTime: 20,
        createdBy: admin._id
      },
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center',
        price: 320,
        category: 'desserts',
        image: {
          url: 'https://images.pexels.com/photos/8844893/pexels-photo-8844893.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
        },
        ingredients: ['Dark Chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour'],
        allergens: ['eggs', 'wheat', 'dairy'],
        isPopular: true,
        isAvailable: true,
        preparationTime: 15,
        createdBy: admin._id
      },
      {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee and mascarpone',
        price: 380,
        category: 'desserts',
        image: {
          url: 'https://images.pexels.com/photos/6078387/pexels-photo-6078387.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
        },
        ingredients: ['Mascarpone', 'Coffee', 'Ladyfingers', 'Cocoa'],
        allergens: ['dairy', 'eggs', 'wheat'],
        isVegetarian: true,
        isAvailable: true,
        preparationTime: 10,
        createdBy: admin._id
      },
      {
        name: 'Mango Lassi',
        description: 'Traditional yogurt drink with fresh mango',
        price: 180,
        category: 'beverages',
        image: {
          url: 'https://images.pexels.com/photos/19764735/pexels-photo-19764735.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
        },
        ingredients: ['Fresh Mango', 'Yogurt', 'Sugar', 'Cardamom'],
        allergens: ['dairy'],
        isVegetarian: true,
        isPopular: true,
        isAvailable: true,
        preparationTime: 5,
        createdBy: admin._id
      },
      {
        name: 'Fresh Lime Soda',
        description: 'Refreshing lime with sparkling water',
        price: 120,
        category: 'beverages',
        image: {
          url: 'https://images.pexels.com/photos/7869266/pexels-photo-7869266.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
        },
        ingredients: ['Fresh Lime', 'Sparkling Water', 'Sugar', 'Salt'],
        allergens: [],
        isVegetarian: true,
        isVegan: true,
        isAvailable: true,
        preparationTime: 3,
        createdBy: admin._id
      },
      {
        name: 'Masala Chai',
        description: 'Spiced tea blend with milk and aromatic spices',
        price: 80,
        category: 'beverages',
        image: {
          url: 'https://images.pexels.com/photos/7283289/pexels-photo-7283289.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
        },
        ingredients: ['Tea', 'Milk', 'Cardamom', 'Ginger', 'Cinnamon'],
        allergens: ['dairy'],
        isVegetarian: true,
        isAvailable: true,
        preparationTime: 5,
        createdBy: admin._id
      }
    ];

    await MenuItem.insertMany(menuItems);
    console.log('Menu items created');

    console.log('Seed data created successfully!');
    console.log('Admin credentials: admin@srimatha.com / admin123');
    console.log('Customer credentials: user@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();