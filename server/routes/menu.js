

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
// router.get('/', async (req, res) => {
//   try {
//     const {
//       category,
//       isVegetarian,
//       isAvailable = true,
//       page = 1,
//       limit = 1000,
//       search,
//       sortBy = 'name',
//       sortOrder = 'asc'
//     } = req.query;

//     // Build query
//     const query = {};
//     if (category) query.category = category;
//     if (isVegetarian !== undefined) query.isVegetarian = isVegetarian === 'true';
//     if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';

//     // Search functionality
//     if (search) {
//       query.name = { $regex: search, $options: 'i' };
//     }

//     // Pagination and sorting options
//     const options = {
//       limit: parseInt(limit),
//       skip: (parseInt(page) - 1) * parseInt(limit),
//       sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
//     };

//     const result = await req.db.findMenuItems(query, options);
//     res.json({
//       success: true,
//       data: result
//     });
//   } catch (error) {
//     console.error('Menu fetch error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch menu items',
//       error: error.message
//     });
//   }
// });
//updated
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

    const query = {};
    if (category) query.category = category;
    if (isVegetarian !== undefined) query.is_vegetarian = isVegetarian === 'true';
    if (isAvailable !== undefined) query.is_available = isAvailable === 'true';

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
    };

    // 🔁 Fetch data from DB
    const result = await req.db.findMenuItems(query, options);
    console.log('findMenuItems result:', result);
    
 // DEBUG

    // 🔁 Map DB rows and parse combo_items
    const items = result.items.map(item => {
      
      let parsedComboItems = [];

      if (item.is_combo && item.combo_items) {
        if (typeof item.combo_items === 'string') {
          try {
            parsedComboItems = JSON.parse(item.combo_items);
          } catch (err) {
            console.warn('Failed to parse combo_items for item:', item.id, err);
          }
        } else if (Array.isArray(item.combo_items)) {
          parsedComboItems = item.combo_items;
        }
      }

      return {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        available: item.is_available,
        isVegetarian: item.is_vegetarian,
        isVegan: item.is_vegan,
        isGlutenFree: item.is_gluten_free,
        image: item.image,
        preparationTime: item.preparation_time,
        spiceLevel: item.spice_level,
        isCombo: item.is_combo,
        comboItems: parsedComboItems
      };
    });
    console.log('Mapped menu items with comboItems:', JSON.stringify(items, null, 2));

    res.json({
      success: true,
      data: {
        items,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages
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

// router.get('/:id', async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     console.log('Fetching menu item with ID:', id);

//     const result = await req.db.findMenuItems({ id });

//     const item = result.items && result.items.length > 0 ? result.items[0] : null;

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: 'Menu item not found'
//       });
//     }

//     let parsedComboItems = [];
//     if (item.is_combo && item.combo_items) {
//       if (typeof item.combo_items === 'string') {
//         try {
//           parsedComboItems = JSON.parse(item.combo_items);
//         } catch (err) {
//           console.warn('Failed to parse combo_items for item:', item.id, err);
//         }
//       } else if (Array.isArray(item.combo_items)) {
//         parsedComboItems = item.combo_items;
//       }
//     }

//     const mappedItem = {
//       id: item.id,
//       name: item.name,
//       description: item.description,
//       price: item.price,
//       category: item.category,
//       image: item.image,
//       comboItems: parsedComboItems
//     };

//     res.json({
//       success: true,
//       data: { item: mappedItem }
//     });

//   } catch (error) {
//     console.error('Menu item fetch error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch menu item',
//       error: error.message
//     });
//   }
// });



// Create new menu item (Admin only)
// router.post('/', authenticate, authorize('admin'), async (req, res) => {
//   try {
//     const item = req.body;

//     // Basic validation
//     // if (!item.name || !item.price || !item.category) {
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: 'Name, price, and category are required',
//     //   });
//     // }

//     const newItem = {
//       name: item.name,
//       description: item.description || '',
//       price: item.price,
//       category: item.category,
//       is_available: item.isAvailable ?? true,
//       is_vegetarian: item.isVegetarian ?? false,
//       is_vegan: item.isVegan ?? false,
//       is_gluten_free: item.isGlutenFree ?? false,
//       image: item.image || null,
//       preparation_time: item.preparationTime ?? 0,
//       spice_level: item.spiceLevel ,
//       ingredients: item.ingredients || [],
//       allergens: item.allergens || [],
//       created_at: new Date(),
//       updated_at: new Date(),
//     };

//     const savedItem = await req.db.addMenuItem(newItem);

//     res.status(201).json({
//       success: true,
//       data: savedItem,
//       message: 'Menu item created successfully',
//     });
//   } catch (error) {
//     console.error('Create menu item error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create menu item',
//       error: error.message,
//     });
//   }
// });

// router.post('/', authenticate, authorize('admin'), async (req, res) => {
//   try {
//     const item = req.body;

//     // Validate required fields based on whether it's a combo or regular item
//     if (!item.name || !item.category) {
//       return res.status(400).json({
//         success: false,
//         message: 'Name and category are required',
//       });
//     }

//     // For regular items, price is required
//     if (!item.isCombo && !item.price) {
//       return res.status(400).json({
//         success: false,
//         message: 'Price is required for regular menu items',
//       });
//     }

//     // For combos, comboItems array is required
//     if (item.isCombo && (!item.comboItems || item.comboItems.length === 0)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Combo items are required for combos',
//       });
//     }

//     // Base item data
//     const newItem = {
//       name: item.name,
//       description: item.description || '',
//       category: item.category,
//       is_combo: item.isCombo || false,
//       is_available: item.isAvailable ?? true,
//       is_vegetarian: item.isVegetarian ?? false,
//       is_vegan: item.isVegan ?? false,
//       is_gluten_free: item.isGlutenFree ?? false,
//       image: item.image || null,
//       preparation_time: item.preparationTime ?? 0,
//       spice_level: item.spiceLevel || null,
//       ingredients: item.ingredients || [],
//       allergens: item.allergens || [],
//       created_at: new Date(),
//       updated_at: new Date(),
//     };

//     // Handle combo-specific data
//     if (item.isCombo) {
//       newItem.combo_items = item.comboItems.map(comboItem => ({
//   menu_item_id: comboItem.id,
//   name: comboItem.name,
//   quantity: comboItem.quantity || 1,
//   spice_level: comboItem.spiceLevel || item.spiceLevel || null 
// }));
//       // Combo price is optional (can be calculated from items or set manually)
//       newItem.price = item.price || 0;
//     } else {
//       // Regular item must have price
//       newItem.price = item.price;
//     }

//    const savedItem = await req.db.addMenuItem(newItem);

// // Add combo items back to the response if this is a combo
// const responseData = {
//   id: savedItem.id,
//   name: newItem.name,
//   description: newItem.description,
//   category: newItem.category,
//   is_combo: newItem.is_combo,
//   is_available: newItem.is_available,
//   is_vegetarian: newItem.is_vegetarian,
//   is_vegan: newItem.is_vegan,
//   is_gluten_free: newItem.is_gluten_free,
//   image: newItem.image,
//   preparation_time: newItem.preparation_time,
//   spice_level: newItem.spice_level,
//   ingredients: newItem.ingredients,
//   allergens: newItem.allergens,
//   created_at: newItem.created_at,
//   updated_at: newItem.updated_at,
//   price: newItem.price,
//   comboItems: newItem.combo_items || []
// };

// // delete responseData.combo_items;
// console.log("comboItems in request:", item.comboItems);
// console.log("Mapped combo_items:", newItem.combo_items);
// console.log("Response data:", responseData);


// res.status(201).json({
//   success: true,
//   data: responseData, 
//   message: 'Menu item created successfully',
// });

//   } catch (error) {
//     console.error('Create menu item error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create menu item',
//       error: error.message,
//     });
//   }
// });


// Get popular/featured items

router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const item = req.body;

    // Validate required fields
    if (!item.name || !item.category) {
      return res.status(400).json({
        success: false,
        message: 'Name and category are required',
      });
    }

    if (!item.isCombo && !item.price) {
      return res.status(400).json({
        success: false,
        message: 'Price is required for regular menu items',
      });
    }

    if (item.isCombo && (!item.comboItems || item.comboItems.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Combo items are required for combos',
      });
    }

    // Base item data
    const newItem = {
      name: item.name,
      description: item.description || '',
      category: item.category,
      is_combo: item.isCombo || false,
      is_available: item.isAvailable ?? true,
      is_vegetarian: item.isVegetarian ?? false,
      is_vegan: item.isVegan ?? false,
      is_gluten_free: item.isGlutenFree ?? false,
      image: item.image || null,
      preparation_time: item.preparationTime ?? 0,
      spice_level: item.spiceLevel || null,
      ingredients: item.ingredients || [],
      allergens: item.allergens || [],
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Handle combo-specific data
    let comboItemsWithId = [];
    if (item.isCombo) {
      comboItemsWithId = item.comboItems.map(comboItem => ({

        menu_item_id: comboItem.id,
        name: comboItem.name || 'Unknown',
        quantity: comboItem.quantity || 1,
        spice_level: comboItem.spiceLevel || item.spiceLevel || null,
      }));
      newItem.combo_items = comboItemsWithId;
      newItem.price = item.price || 0;
    } else {
      newItem.price = item.price;
    }

    // Save menu item
    const savedItem = await req.db.addMenuItem(newItem);


    // Fetch combo item names from DB
    let comboItemsDetailed = [];

if (newItem.is_combo && comboItemsWithId.length > 0) {
  comboItemsDetailed = comboItemsWithId.map((c) => ({
    id: c.menu_item_id,
    name: c.name || 'Unknown', // ← use the name from frontend
    quantity: c.quantity,
    spiceLevel: c.spice_level || null,
  }));
}


    // Build clean responseData (no spreading of newItem to avoid extra fields like combo_items)
    const responseData = {
      id: savedItem.id,
      name: newItem.name,
      description: newItem.description,
      category: newItem.category,
      is_combo: newItem.is_combo,
      is_available: newItem.is_available,
      is_vegetarian: newItem.is_vegetarian,
      is_vegan: newItem.is_vegan,
      is_gluten_free: newItem.is_gluten_free,
      image: newItem.image,
      preparation_time: newItem.preparation_time,
      spice_level: newItem.spice_level,
      ingredients: newItem.ingredients,
      allergens: newItem.allergens,
      created_at: newItem.created_at,
      updated_at: newItem.updated_at,
      price: newItem.price,
      comboItems: comboItemsDetailed
    };

    res.status(201).json({
      success: true,
      data: responseData,
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