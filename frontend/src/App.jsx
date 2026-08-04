import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductCatalog from './components/ProductCatalog';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminDashboard from './components/AdminDashboard';
import { fetchProducts } from './api/client';
import { CheckCircle, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('shop');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  const loadCatalog = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchProducts();
      setProducts(res.data || []);
    } catch (err) {
      setError('Unable to load products. Please check if the Tier 2 Backend Server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.id === product.id);
      if (existing) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => item.id === productId ? { ...item, quantity: newQty } : item)
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleOrderSuccess = (completedOrder) => {
    setIsCheckoutOpen(false);
    setCartItems([]);
    setOrderConfirmation(completedOrder);
  };

  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="main-content">
        {activeTab === 'shop' ? (
          <>
            {/* Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(16,185,129,0.15))',
              border: '1px solid var(--border-highlight)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem 2.5rem',
              marginBottom: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: "space-between",
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <span className="status-pill" style={{ marginBottom: '0.5rem' }}>
                  Two-Tier E-Commerce Demo
                </span>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 700, margin: '0.25rem 0' }}>
                  Elevate Your Everyday Essentials
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px' }}>
                  Explore top premium products directly served from our Node.js + Express backend API database tier.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" onClick={() => setIsCartOpen(true)}>
                  View Shopping Cart ({cartTotalCount})
                </button>
              </div>
            </div>

            <ProductCatalog
              products={products}
              loading={loading}
              error={error}
              onAddToCart={handleAddToCart}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          </>
        ) : (
          <AdminDashboard
            products={products}
            onRefreshProducts={loadCatalog}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Quick View Product Modal */}
      {quickViewProduct && (
        <div className="modal-overlay" onClick={() => setQuickViewProduct(null)}>
          <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="category-tag" style={{ position: 'static' }}>{quickViewProduct.category}</span>
              <button className="btn-icon" onClick={() => setQuickViewProduct(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{quickViewProduct.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {quickViewProduct.description}
                </p>
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                    ${quickViewProduct.price.toFixed(2)}
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {orderConfirmation && (
        <div className="modal-overlay" onClick={() => setOrderConfirmation(null)}>
          <div className="modal-card" style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ margin: '0 auto 1rem', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={36} />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Order Placed Successfully!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Thank you, <strong>{orderConfirmation.customerName}</strong>. Your order ID is <strong>{orderConfirmation.id}</strong>.
            </p>

            <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span>Delivery Address:</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{orderConfirmation.address}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>Total Amount Paid:</span>
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>${orderConfirmation.totalAmount ? orderConfirmation.totalAmount.toFixed(2) : '0.00'}</span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => setOrderConfirmation(null)}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
