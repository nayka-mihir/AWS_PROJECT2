import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/orders
router.get('/', (req, res) => {
  try {
    const orders = db.getOrders();
    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
    res.json({
      success: true,
      count: orders.length,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching orders', error: error.message });
  }
});

// POST /api/orders
router.post('/', (req, res) => {
  try {
    const { customerName, email, address, items, totalAmount } = req.body;

    if (!customerName || !email || !address || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order submission. Name, email, address, and items are required.'
      });
    }

    const calculatedTotal = totalAmount || items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder = db.addOrder({
      customerName,
      email,
      address,
      items,
      totalAmount: calculatedTotal
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      data: newOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating order', error: error.message });
  }
});

export default router;
