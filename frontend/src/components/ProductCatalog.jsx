import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Apparel', 'Home & Living', 'Accessories'];

export default function ProductCatalog({ products, loading, error, onAddToCart, onQuickView }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Filter & Sort Products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <section className="catalog-section">
      {/* Search & Filter Controls */}
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            className="input-field"
            placeholder="Search products by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="categories-pills">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SlidersHorizontal size={16} style={{ color: 'var(--text-muted)' }} />
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <p>Connecting to Backend API tier & fetching catalog...</p>
        </div>
      )}

      {error && (
        <div className="empty-state" style={{ color: 'var(--danger)' }}>
          <div className="empty-icon">⚠️</div>
          <p>{error}</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No products match your criteria</h3>
          <p style={{ marginTop: '0.5rem' }}>Try searching for another keyword or selecting a different category filter.</p>
        </div>
      )}
    </section>
  );
}
