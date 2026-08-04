import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onProceedToCheckout }) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 9.99) : 0;
  const grandTotal = subtotal + shipping;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem' }}>Your Cart</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-content">
          {cartItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                Discover our curated collection and add items to your cart.
              </p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4 className="cart-item-title">{item.name}</h4>
                  <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>

                  <div className="quantity-controls">
                    <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                      <Minus size={14} />
                    </button>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, padding: '0 0.5rem' }}>
                      {item.quantity}
                    </span>
                    <button className="qty-btn" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                      <Plus size={14} />
                    </button>

                    <button
                      className="qty-btn"
                      onClick={() => onRemoveItem(item.id)}
                      style={{ marginLeft: 'auto', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <strong style={{ color: 'var(--accent)' }}>FREE</strong> : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row total">
              <span>Grand Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem' }}
              onClick={onProceedToCheckout}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
