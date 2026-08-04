import React from 'react';
import { ShoppingBag, Store, ShieldCheck, Search } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, cartCount, onOpenCart, searchTerm, setSearchTerm }) {
  return (
    <header className="navbar">
      <div className="nav-wrapper">
        <div className="brand-logo" onClick={() => setActiveTab('shop')}>
          <div className="brand-icon">
            <ShoppingBag size={22} />
          </div>
          <span>Aura<span style={{ color: 'var(--accent)' }}>Store</span></span>
        </div>

        <div className="nav-actions">
          <button
            className={`btn ${activeTab === 'shop' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('shop')}
          >
            <Store size={18} />
            <span>Store</span>
          </button>

          <button
            className={`btn ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('admin')}
          >
            <ShieldCheck size={18} />
            <span>Admin Portal</span>
          </button>

          <button className="btn-icon" onClick={onOpenCart} title="Open Shopping Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
