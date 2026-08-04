import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/products
router.get('/', (req, res) => {
  try {
    let products = db.getProducts();
    const { category, search, minPrice, maxPrice, sort } = req.query;

    if (category && category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (sort === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    }

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching products', error: error.message });
  }
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching product', error: error.message });
  }
});

// POST /api/products (Admin)
router.post('/', (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;

    if (!name || !category || !price || !description) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields (name, category, price, description)' });
    }

    const newProduct = db.addProduct({
      name,
      category,
      price: parseFloat(price),
      description,
      image: image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'
    });

    res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating product', error: error.message });
  }
});

// DELETE /api/products/:id (Admin)
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting product', error: error.message });
  }
});

export default router;
