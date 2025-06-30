import express from 'express';
import { body, query, validationResult } from 'express-validator';
import Contact from '../models/Contact.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Submit contact form
router.post('/', [
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Please provide a valid phone number'),
  body('subject').isIn(['reservation', 'catering', 'feedback', 'complaint', 'other']).withMessage('Invalid subject'),
  body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters')
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

    const contactData = req.body;
    
    // Set priority based on subject
    if (contactData.subject === 'complaint') {
      contactData.priority = 'high';
    } else if (contactData.subject === 'catering') {
      contactData.priority = 'medium';
    }

    const contact = new Contact(contactData);
    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon.',
      data: { contact }
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
      error: error.message
    });
  }
});

// Get all contact messages (Admin only)
router.get('/', authenticate, authorize('admin'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['new', 'in-progress', 'resolved', 'closed']),
  query('subject').optional().isIn(['reservation', 'catering', 'feedback', 'complaint', 'other']),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
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

    const {
      page = 1,
      limit = 20,
      status,
      subject,
      priority,
      search
    } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (subject) filter.subject = subject;
    if (priority) filter.priority = priority;
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('assignedTo', 'name')
        .populate('response.respondedBy', 'name'),
      Contact.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Contacts fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
      error: error.message
    });
  }
});

// Get single contact message (Admin only)
router.get('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('response.respondedBy', 'name')
      .populate('notes.addedBy', 'name');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      data: { contact }
    });
  } catch (error) {
    console.error('Contact fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact message',
      error: error.message
    });
  }
});

// Update contact status (Admin only)
router.patch('/:id/status', authenticate, authorize('admin'), [
  body('status').isIn(['new', 'in-progress', 'resolved', 'closed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
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

    const { status, priority } = req.body;
    
    const updateData = { status };
    if (priority) updateData.priority = priority;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('assignedTo', 'name');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: { contact }
    });
  } catch (error) {
    console.error('Contact status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact status',
      error: error.message
    });
  }
});

// Assign contact to staff (Admin only)
router.patch('/:id/assign', authenticate, authorize('admin'), [
  body('assignedTo').isMongoId().withMessage('Valid staff ID is required')
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

    const { assignedTo } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true }
    ).populate('assignedTo', 'name');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact assigned successfully',
      data: { contact }
    });
  } catch (error) {
    console.error('Contact assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign contact',
      error: error.message
    });
  }
});

// Add response to contact (Admin only)
router.post('/:id/response', authenticate, authorize('admin'), [
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Response must be between 10 and 2000 characters')
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

    const { message } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        response: {
          message,
          respondedBy: req.user._id,
          respondedAt: new Date()
        },
        status: 'resolved'
      },
      { new: true }
    ).populate('response.respondedBy', 'name');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Response added successfully',
      data: { contact }
    });
  } catch (error) {
    console.error('Response addition error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add response',
      error: error.message
    });
  }
});

// Add note to contact (Admin only)
router.post('/:id/notes', authenticate, authorize('admin'), [
  body('message').trim().isLength({ min: 5, max: 500 }).withMessage('Note must be between 5 and 500 characters')
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

    const { message } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          notes: {
            message,
            addedBy: req.user._id,
            addedAt: new Date()
          }
        }
      },
      { new: true }
    ).populate('notes.addedBy', 'name');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Note added successfully',
      data: { contact }
    });
  } catch (error) {
    console.error('Note addition error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add note',
      error: error.message
    });
  }
});

export default router;