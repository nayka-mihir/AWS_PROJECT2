import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, Lock } from 'lucide-react';
import { placeOrder } from '../api/client';

export default function CheckoutModal({ isOpen, onClose, cartItems, onOrderSuccess }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    address: '',
    cardNumber: '4242 •••• •••• 4242',
    expDate: '12/28',
    cvv: '123'
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const grandTotal = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.email || !formData.address) {
      setErrorMessage('Please fill in all required contact and shipping details.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        customerName: formData.customerName,
        email: formData.email,
        address: formData.address,
        totalAmount: grandTotal,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      };

      const result = await placeOrder(payload);
      setSubmitting(false);
      onOrderSuccess(result.data);
    } catch (err) {
      setSubmitting(false);
      setErrorMessage(err.message || 'Failed to submit order to API');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Complete Checkout</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Tier 2 API Processing Demonstration
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {errorMessage && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '1rem' }}
              placeholder="e.g. Sarah Jenkins"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="input-field"
              style={{ paddingLeft: '1rem' }}
              placeholder="e.g. sarah@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Shipping Address *</label>
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '1rem' }}
              placeholder="e.g. 742 Evergreen Terrace, Springfield"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          {/* Payment simulation */}
          <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>
              <CreditCard size={16} color="var(--accent)" />
              <span>Simulated Instant Payment</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" className="input-field" style={{ paddingLeft: '1rem' }} value={formData.cardNumber} readOnly />
              <input type="text" className="input-field" style={{ paddingLeft: '1rem', width: '90px' }} value={formData.expDate} readOnly />
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <div className="summary-row">
              <span>Items Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row total">
              <span>Amount Due</span>
              <span style={{ color: 'var(--accent)' }}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
            disabled={submitting}
          >
            <Lock size={16} />
            <span>{submitting ? 'Processing Order...' : `Pay $${grandTotal.toFixed(2)} & Place Order`}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
