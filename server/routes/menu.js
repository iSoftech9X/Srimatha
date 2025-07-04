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
    const item = await req.db.findMenuItemById(req.params.id);
    
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
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const itemData = {
      ...req.body,
      createdBy: req.user.id
    };

    const newItem = await req.db.createMenuItem(itemData);

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: { item: newItem }
    });
  } catch (error) {
    console.error('Menu item creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create menu item',
      error: error.message
    });
  }
});

// Update menu item (Admin only)
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const updatedItem = await req.db.updateMenuItem(req.params.id, {
      ...req.body,
      updatedBy: req.user.id
    });

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: { item: updatedItem }
    });
  } catch (error) {
    console.error('Menu item update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update menu item',
      error: error.message
    });
  }
});

// Toggle item availability (Admin only)
router.patch('/:id/availability', authenticate, authorize('admin'), async (req, res) => {
  try {
    const item = await req.db.findMenuItemById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    const updatedItem = await req.db.updateMenuItem(req.params.id, {
      isAvailable: !item.isAvailable,
      updatedBy: req.user.id
    });

    res.json({
      success: true,
      message: `Menu item ${updatedItem.isAvailable ? 'enabled' : 'disabled'} successfully`,
      data: { item: updatedItem }
    });
  } catch (error) {
    console.error('Menu item availability toggle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle menu item availability',
      error: error.message
    });
  }
});

// Delete menu item (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const deletedItem = await req.db.deleteMenuItem(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu item deleted successfully',
      data: { item: deletedItem }
    });
  } catch (error) {
    console.error('Menu item deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete menu item',
      error: error.message
    });
  }
});

export default router;