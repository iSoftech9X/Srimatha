// Service aggregator for switching between mock and real DB
import * as menuPostgres from './menuPostgres.js';
import pool from './postgres.js';

export default {
   findMenuItems: menuPostgres.findMenuItems,
  getMenuCategories: menuPostgres.getMenuCategories,
   query: (text, params) => pool.query(text, params),
  addMenuItem: menuPostgres.addMenuItem,
    deleteMenuItem: menuPostgres.deleteMenuItem,
  addCateringOrder: menuPostgres.addCateringOrder,
  updateMenuItem: menuPostgres.updateMenuItem,
connect: async () => {
  try {
    const res = await pool.query('SELECT current_database()');
    console.log('✅ Connected to database:', res.rows[0].current_database);
    return true;
  } catch (err) {
    console.error('❌ Failed to fetch database name:', err);
    return false;
  }
}}