// const BASE_URL = '/api';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/products${query ? `?${query}` : ''}`);
  if (!res.ok) {
    throw new Error('Failed to fetch products from backend tier');
  }
  return res.json();
}

export async function createProduct(productData) {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create product');
  }
  return res.json();
}

export async function deleteProduct(productId) {
  const res = await fetch(`${BASE_URL}/products/${productId}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    throw new Error('Failed to delete product');
  }
  return res.json();
}

export async function fetchOrders() {
  const res = await fetch(`${BASE_URL}/orders`);
  if (!res.ok) {
    throw new Error('Failed to fetch orders');
  }
  return res.json();
}

export async function placeOrder(orderPayload) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to submit order');
  }
  return res.json();
}
