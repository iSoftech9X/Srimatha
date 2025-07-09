// Get all unique menu categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await req.db.getMenuCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Menu categories fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu categories',
      error: error.message
    });
  }
});
import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all menu items with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      category,
      isVegetarian,
      isAvailable = true,
      page = 1,
      limit = 10,
      search,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build query
    const query = {};
    if (category) query.category = category;
    if (isVegetarian !== undefined) query.isVegetarian = isVegetarian === 'true';
    if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';

    // Pagination options
    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    };

    const result = await req.db.findMenuItems(query, options);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Menu fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items',
      error: error.message
    });
  }
});

// Get single menu item
router.get('/:id', async (req, res) => {
  try {
    const result = await req.db.findMenuItems({ id: req.params.id });
    const item = result.items && result.items.length > 0 ? result.items[0] : null;
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    res.json({
      success: true,
      data: { item }
    });
  } catch (error) {
    console.error('Menu item fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu item',
      error: error.message
    });
  }
});

// Get popular/featured items
router.get('/featured/popular', async (req, res) => {
  try {
    const result = await req.db.findMenuItems(
      { isAvailable: true },
      { limit: 6, skip: 0 }
    );

    res.json({
      success: true,
      data: { items: result.items }
    });
  } catch (error) {
    console.error('Popular items fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular items',
      error: error.message
    });
  }
});

// Create new menu item (Admin only)
// TODO: Implement createMenuItem for PostgreSQL if needed
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  return res.status(501).json({
    success: false,
    message: 'Not implemented: Use seed script to add menu items.'
  });
});

// Update menu item (Admin only)
// TODO: Implement updateMenuItem for PostgreSQL if needed
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  return res.status(501).json({
    success: false,
    message: 'Not implemented: Update via database only.'
  });
});

// Toggle item availability (Admin only)
// TODO: Implement toggle availability for PostgreSQL if needed
router.patch('/:id/availability', authenticate, authorize('admin'), async (req, res) => {
  return res.status(501).json({
    success: false,
    message: 'Not implemented: Update via database only.'
  });
});

// Delete menu item (Admin only)
// TODO: Implement deleteMenuItem for PostgreSQL if needed
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  return res.status(501).json({
    success: false,
    message: 'Not implemented: Delete via database only.'
  });
});

export default router;