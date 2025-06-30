import express from 'express';
import { body, query, validationResult } from 'express-validator';
import MenuItem from '../models/MenuItem.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all menu items with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isIn(['appetizers', 'main-course', 'desserts', 'beverages', 'specials']),
  query('search').optional().trim().isLength({ min: 1, max: 100 }),
  query('sortBy').optional().isIn(['name', 'price', 'rating', 'createdAt']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      category,
      search,
      isVegetarian,
      isVegan,
      isGlutenFree,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isAvailable = true
    } = req.query;

    // Build filter object
    const filter = { isAvailable: isAvailable === 'true' };
    
    if (category) filter.category = category;
    if (isVegetarian === 'true') filter.isVegetarian = true;
    if (isVegan === 'true') filter.isVegan = true;
    if (isGlutenFree === 'true') filter.isGlutenFree = true;
    
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [items, total] = await Promise.all([
      MenuItem.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'name'),
      MenuItem.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
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
    const item = await MenuItem.findById(req.params.id)
      .populate('createdBy', 'name');

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

// Get popular menu items
router.get('/featured/popular', async (req, res) => {
  try {
    const items = await MenuItem.find({ 
      isPopular: true, 
      isAvailable: true 
    })
    .sort({ 'rating.average': -1 })
    .limit(10)
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
router.post('/', authenticate, authorize('admin'), [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(['appetizers', 'main-course', 'desserts', 'beverages', 'specials']).withMessage('Invalid category'),
  body('image.url').isURL().withMessage('Valid image URL is required'),
  body('preparationTime').optional().isInt({ min: 1, max: 180 }).withMessage('Preparation time must be between 1 and 180 minutes')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const itemData = {
      ...req.body,
      createdBy: req.user._id
    };

    const item = new MenuItem(itemData);
    await item.save();

    await item.populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: { item }
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
router.put('/:id', authenticate, authorize('admin'), [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('description').optional().trim().isLength({ min: 10, max: 500 }),
  body('price').optional().isFloat({ min: 0 }),
  body('category').optional().isIn(['appetizers', 'main-course', 'desserts', 'beverages', 'specials']),
  body('preparationTime').optional().isInt({ min: 1, max: 180 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: { item }
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

// Toggle menu item availability (Admin only)
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
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

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