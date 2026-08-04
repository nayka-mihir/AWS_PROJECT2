import React from 'react';
import { Star, ShoppingCart, Plus } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onQuickView }) {
  return (
    <div className="product-card">
      <div className="image-container" onClick={() => onQuickView(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <span className="category-tag">{product.category}</span>
      </div>

      <div className="card-body">
        <div className="rating-badge">
          <Star size={14} fill="#fbbf24" color="#fbbf24" />
          <span>{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
          <span className="reviews-count">({product.reviewsCount || 10})</span>
        </div>

        <h3 className="product-title" onClick={() => onQuickView(product)} style={{ cursor: 'pointer' }}>
          {product.name}
        </h3>

        <p className="product-desc">{product.description}</p>

        <div className="card-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button className="btn btn-primary" onClick={() => onAddToCart(product)}>
            <Plus size={16} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
