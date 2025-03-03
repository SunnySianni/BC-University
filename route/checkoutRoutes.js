import express from 'express';
import Cart from '../models/Cart.js';
import Course from '../models/Course.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware
router.use(requireAuth);

// View checkout page
router.get('/', async (req, res) => {
    try {
        const cartItems = await Cart.findAll({
            where: { user_id: req.session.studentId },
            include: [{ model: Course }]
        });

        // Calculate total (assuming each course costs $100)
        const total = cartItems.length * 100;
        
        res.render('checkout', {
            title: 'Checkout',
            cartItems: cartItems,
            total: total,
            studentName: req.session.studentName
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Process checkout
router.post('/process', async (req, res) => {
    try {
        const cartItems = await Cart.findAll({
            where: { user_id: req.session.studentId },
            include: [{ model: Course }]
        });

        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Here you would typically:
        // 1. Process payment
        // 2. Create enrollment records
        // 3. Clear the cart
        
        // For now, we'll just clear the cart
        await Cart.destroy({
            where: { user_id: req.session.studentId }
        });

        res.json({ 
            success: true, 
            message: 'Checkout successful! You are now enrolled in the selected courses.'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 