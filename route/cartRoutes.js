import express from 'express';
import Cart from '../models/Cart.js';
import Course from '../models/Course.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all cart routes
router.use(requireAuth);

// View cart
router.get('/', async (req, res) => {
    try {
        const cartItems = await Cart.findAll({
            where: { user_id: req.session.studentId },
            include: [{ model: Course }]
        });
        res.render('cart', { 
            title: 'Shopping Cart',
            cartItems: cartItems,
            studentName: req.session.studentName
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add to cart
router.post('/add/:courseId', async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const userId = req.session.studentId;

        // Check if course exists
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check if item already in cart
        let cartItem = await Cart.findOne({
            where: { 
                user_id: userId,
                course_id: courseId
            }
        });

        if (cartItem) {
            cartItem.quantity += 1;
            await cartItem.save();
        } else {
            cartItem = await Cart.create({
                user_id: userId,
                course_id: courseId,
                quantity: 1
            });
        }

        res.json({ message: 'Course added to cart', cartItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove from cart
router.delete('/remove/:courseId', async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const userId = req.session.studentId;

        await Cart.destroy({
            where: {
                user_id: userId,
                course_id: courseId
            }
        });

        res.json({ message: 'Course removed from cart' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 