import express from 'express';
import studentRoutes from './studentRoutes.js';
import courseRoutes from './courseRoutes.js';
import cartRoutes from './cartRoutes.js';
import checkoutRoutes from './checkoutRoutes.js';

const router = express.Router();

router.use('/students', studentRoutes);
router.use('/courses', courseRoutes);
router.use('/cart', cartRoutes);
router.use('/checkout', checkoutRoutes);

export default router;
