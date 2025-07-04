import express from 'express';
import MenuItem from '../models/MenuItem.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

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
    
    if (search) {
      query.$text = { $search: search };
    }

    // Pagination options
    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
    };

    const items = await MenuItem.find(query)
      .sort(options.sort)
      .limit(options.limit)
      .skip(options.skip)
      .populate('createdBy', 'name');

    const total = await MenuItem.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        items,
        total,
        page: parseInt(page),
        totalPages
      }
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
    const item = await MenuItem.findById(req.params.id).populate('createdBy', 'name');
    
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
    const items = await MenuItem.find({ 
      isAvailable: true,
      isPopular: true 
    })
      .limit(6)
      .populate('createdBy', 'name');

    res.json({
      success: true,
      data: { items }
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

    const newItem = await MenuItem.create(itemData);
    await newItem.populate('createdBy', 'name');

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
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

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
    const item = await MenuItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();
    await item.populate('createdBy', 'name');

    res.json({
      success: true,
      message: `Menu item ${item.isAvailable ? 'enabled' : 'disabled'} successfully`,
      data: { item }
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
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);

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