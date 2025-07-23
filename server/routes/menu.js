

import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

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

// Get all menu items with filtering, pagination, and sorting
router.get('/', async (req, res) => {
  try {
    const {
      category,
      isVegetarian,
      isAvailable = true,
      page = 1,
      limit = 1000,
      search,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build query
    const query = {};
    if (category) query.category = category;
    if (isVegetarian !== undefined) query.isVegetarian = isVegetarian === 'true';
    if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';

    // Search functionality
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Pagination and sorting options
    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
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

// Create new menu item (Admin only)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const item = req.body;

    // Basic validation
    // if (!item.name || !item.price || !item.category) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Name, price, and category are required',
    //   });
    // }

    const newItem = {
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      is_available: item.isAvailable ?? true,
      is_vegetarian: item.isVegetarian ?? false,
      is_vegan: item.isVegan ?? false,
      is_gluten_free: item.isGlutenFree ?? false,
      image: item.image || null,
      preparation_time: item.preparationTime ?? 0,
      spice_level: item.spiceLevel || 'medium',
      ingredients: item.ingredients || [],
      allergens: item.allergens || [],
      created_at: new Date(),
      updated_at: new Date(),
    };

    const savedItem = await req.db.addMenuItem(newItem);

    res.status(201).json({
      success: true,
      data: savedItem,
      message: 'Menu item created successfully',
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create menu item',
      error: error.message,
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
router.patch('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const itemId = req.params.id;
    const updates = req.body;

    // Check if item exists
    const existingItem = await req.db.findMenuItems({ id: itemId });
    if (!existingItem.items || existingItem.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Prevent restricted field updates
    if (updates.id || updates.createdAt || updates.created_at) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update ID or creation date'
      });
    }

    // Prepare safe field mapping (optional chaining avoids undefined)
    const mappedUpdates = {
      ...(updates.name && { name: updates.name }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.price !== undefined && { price: updates.price }),
      ...(updates.category && { category: updates.category }),
      ...(updates.isVegetarian !== undefined && { is_vegetarian: updates.isVegetarian }),
      ...(updates.isAvailable !== undefined && { is_available: updates.isAvailable }),
      ...(updates.image !== undefined && { image: updates.image }),
      ...(updates.preparationTime !== undefined && { preparation_time: updates.preparationTime }),
      ...(updates.spiceLevel !== undefined && { spice_level: updates.spiceLevel }),
      updated_at: new Date(),
    };

    const updatedItem = await req.db.updateMenuItem(itemId, mappedUpdates);

    res.json({
      success: true,
      data: updatedItem,
      message: 'Menu item updated successfully'
    });

  } catch (error) {
    console.error('Menu item patch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update menu item',
      error: error.message
    });
  }
});




// Delete menu item (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const itemId = req.params.id;

    // Check if item exists
    const existingItem = await req.db.findMenuItems({ id: itemId });
    if (!existingItem.items || existingItem.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    await req.db.deleteMenuItem(itemId);

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
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