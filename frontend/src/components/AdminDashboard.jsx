import React, { useState, useEffect } from 'react';
import { Package, DollarSign, ShoppingCart, Plus, Trash2, RefreshCw } from 'lucide-react';
import { fetchOrders, createProduct, deleteProduct } from '../api/client';

export default function AdminDashboard({ products, onRefreshProducts }) {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    description: '',
    image: ''
  });

  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetchOrders();
      setOrders(res.data || []);
      setTotalRevenue(res.totalRevenue || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price || !newProd.description) return;

    setAdding(true);
    try {
      await createProduct(newProd);
      setMessage('Product added to database successfully!');
      setNewProd({ name: '', category: 'Electronics', price: '', description: '', image: '' });
      setShowAddModal(false);
      onRefreshProducts();
    } catch (err) {
      alert(err.message || 'Error creating product');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product from the database?')) return;
    try {
      await deleteProduct(id);
      onRefreshProducts();
    } catch (err) {
      alert(err.message || 'Error deleting product');
    }
  };

  return (
    <div className="admin-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Merchant Admin Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Backend Database Statistics & Catalog Management
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => { loadOrders(); onRefreshProducts(); }}>
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {message && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          {message}
        </div>
      )}

      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="product-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
            <DollarSign size={20} color="var(--accent)" />
            <span>Total Revenue</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--accent)' }}>
            ${totalRevenue.toFixed(2)}
          </div>
        </div>

        <div className="product-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
            <ShoppingCart size={20} color="var(--primary)" />
            <span>Total Orders Placed</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.5rem' }}>
            {orders.length}
          </div>
        </div>

        <div className="product-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
            <Package size={20} color="#f59e0b" />
            <span>Active Products</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '0.5rem' }}>
            {products.length}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <h3 style={{ marginBottom: '1rem' }}>Recent Customer Orders</h3>
      <div className="admin-table-container">
        {loadingOrders ? (
          <div className="empty-state">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state">No orders found in database.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Items Count</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(ord => (
                <tr key={ord.id}>
                  <td><strong>{ord.id}</strong></td>
                  <td>{ord.customerName}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{ord.email}</td>
                  <td>{ord.items ? ord.items.reduce((s, i) => s + i.quantity, 0) : 1}</td>
                  <td style={{ fontWeight: 600 }}>${ord.totalAmount ? ord.totalAmount.toFixed(2) : '0.00'}</td>
                  <td>
                    <span className="status-pill">{ord.status || 'Completed'}</span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Manage Products Table */}
      <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>Inventory Catalog Management</h3>
      <div className="admin-table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>
                  <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td><strong>{p.name}</strong></td>
                <td><span className="category-tag" style={{ position: 'static' }}>{p.category}</span></td>
                <td>${p.price.toFixed(2)}</td>
                <td>⭐ {p.rating ? p.rating.toFixed(1) : '5.0'}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                    onClick={() => handleDeleteProduct(p.id)}
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3>Add Product to Catalog</h3>
              <button className="btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateProduct}>
              <div className="form-group">
                <label className="form-label">Product Title *</label>
                <input
                  type="text"
                  className="input-field"
                  style={{ paddingLeft: '1rem' }}
                  placeholder="e.g. Wireless Gaming Mouse"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="input-field"
                  style={{ paddingLeft: '1rem' }}
                  value={newProd.category}
                  onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Home & Living">Home & Living</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Price ($ USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-field"
                  style={{ paddingLeft: '1rem' }}
                  placeholder="89.99"
                  value={newProd.price}
                  onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="input-field"
                  style={{ paddingLeft: '1rem', height: '80px', resize: 'vertical' }}
                  placeholder="Brief summary of product specs and features..."
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (Optional)</label>
                <input
                  type="url"
                  className="input-field"
                  style={{ paddingLeft: '1rem' }}
                  placeholder="https://images.unsplash.com/..."
                  value={newProd.image}
                  onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }} disabled={adding}>
                {adding ? 'Saving to Database...' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
