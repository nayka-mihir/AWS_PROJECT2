import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

// Health Check & Root Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Two-Tier E-Commerce Backend API',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Two-Tier E-Commerce API Server',
    endpoints: [
      'GET /api/products',
      'GET /api/products/:id',
      'POST /api/products',
      'DELETE /api/products/:id',
      'GET /api/orders',
      'POST /api/orders',
      'GET /api/health'
    ]
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Tier 2 Backend Server running on http://localhost:${PORT}`);
});
