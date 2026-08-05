import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Single-Container E-Commerce App',
    timestamp: new Date().toISOString()
  });
});

// Serve Static Frontend Assets (copied into public directory)
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Fallback: Return index.html for any frontend client routing
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 App running on http://localhost:${PORT}`);
});
