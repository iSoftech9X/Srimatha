// Script to seed menu items into PostgreSQL from menuSeedData.js
import dotenv from 'dotenv';
dotenv.config();
import db from '../services/postgres.js';
import { menuSeedData } from '../data/menuSeedData.js';

async function seedMenu() {
  try {
    // Remove all existing menu items
    await db.query('DELETE FROM menu_items');
    console.log('Cleared menu_items table');

    // Insert new menu items
    for (const item of menuSeedData) {
      await db.query(
        `INSERT INTO menu_items (name, description, price, category, is_vegetarian, is_available, image, preparation_time, spice_level)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          item.name,
          item.description,
          item.price,
          item.category,
          item.isVegetarian,
          item.isAvailable,
          item.image,
          item.preparationTime,
          item.spiceLevel
        ]
      );
    }
    console.log('Seeded menu_items table with new data!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding menu:', err);
    process.exit(1);
  }
}

seedMenu();
