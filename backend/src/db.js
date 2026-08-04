import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Aura Sound Pro Wireless Headphones",
    category: "Electronics",
    price: 149.99,
    rating: 4.8,
    reviewsCount: 124,
    description: "Active noise canceling with 40-hour battery life and ultra-comfortable memory foam earcups.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    featured: true
  },
  {
    id: "prod-2",
    name: "Minimalist Leather Smart Watch",
    category: "Accessories",
    price: 199.50,
    rating: 4.6,
    reviewsCount: 89,
    description: "Genuine Italian leather strap with fitness tracking, heart rate monitor, and sleek OLED display.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    featured: true
  },
  {
    id: "prod-3",
    name: "Ergonomic Mechanical Keyboard",
    category: "Electronics",
    price: 129.00,
    rating: 4.9,
    reviewsCount: 210,
    description: "Custom mechanical switches, RGB backlight customization, and wireless Bluetooth 5.2 connectivity.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    featured: true
  },
  {
    id: "prod-4",
    name: "Nordic Ceramic Coffee Mug Set",
    category: "Home & Living",
    price: 34.99,
    rating: 4.7,
    reviewsCount: 65,
    description: "Handcrafted matte ceramic mugs designed for cozy mornings. Includes 4 matching 12oz cups.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    featured: false
  },
  {
    id: "prod-5",
    name: "Ultra-Light Performance Hoodie",
    category: "Apparel",
    price: 68.00,
    rating: 4.5,
    reviewsCount: 142,
    description: "Breathable cotton-blend fleece, tailored modern fit, ideal for workouts or casual daily wear.",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    featured: false
  },
  {
    id: "prod-6",
    name: "Studio Hi-Fi Desktop Speakers",
    category: "Electronics",
    price: 210.00,
    rating: 4.8,
    reviewsCount: 95,
    description: "Rich room-filling sound with wood cabinet enclosure, Bluetooth 5.0, and optical inputs.",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    featured: true
  },
  {
    id: "prod-7",
    name: "Modern Canvas Backpack",
    category: "Accessories",
    price: 79.99,
    rating: 4.6,
    reviewsCount: 118,
    description: "Water-resistant canvas with padded 15-inch laptop compartment and anti-theft back pocket.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    featured: false
  },
  {
    id: "prod-8",
    name: "Aromatherapy Soy Candle Trio",
    category: "Home & Living",
    price: 29.50,
    rating: 4.9,
    reviewsCount: 78,
    description: "Natural soy wax candles infused with lavender, eucalyptus, and amber cedar essential oils.",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    featured: false
  }
];

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      products: INITIAL_PRODUCTS,
      orders: [
        {
          id: "ord-1001",
          customerName: "Alex Rivera",
          email: "alex@example.com",
          address: "123 Innovation Way, Suite 400, San Francisco, CA",
          totalAmount: 184.98,
          items: [
            { id: "prod-1", name: "Aura Sound Pro Wireless Headphones", price: 149.99, quantity: 1 },
            { id: "prod-4", name: "Nordic Ceramic Coffee Mug Set", price: 34.99, quantity: 1 }
          ],
          status: "Completed",
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ]
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

function readData() {
  ensureDataFile();
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading database file:", error);
    return { products: INITIAL_PRODUCTS, orders: [] };
  }
}

function writeData(data) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export const db = {
  getProducts() {
    return readData().products || [];
  },

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  },

  addProduct(newProduct) {
    const data = readData();
    const product = {
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
      featured: false,
      ...newProduct
    };
    data.products.unshift(product);
    writeData(data);
    return product;
  },

  deleteProduct(id) {
    const data = readData();
    const initialLen = data.products.length;
    data.products = data.products.filter(p => p.id !== id);
    if (data.products.length !== initialLen) {
      writeData(data);
      return true;
    }
    return false;
  },

  getOrders() {
    return readData().orders || [];
  },

  addOrder(orderData) {
    const data = readData();
    const newOrder = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: orderData.customerName,
      email: orderData.email,
      address: orderData.address,
      totalAmount: Number(orderData.totalAmount.toFixed(2)),
      items: orderData.items,
      status: "Processing",
      createdAt: new Date().toISOString()
    };
    data.orders.unshift(newOrder);
    writeData(data);
    return newOrder;
  }
};
