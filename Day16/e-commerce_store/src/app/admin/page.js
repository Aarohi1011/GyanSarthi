"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import ProductList from '@/components/admin/ProductList';
import ProductForm from '@/components/admin/ProductForm';

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // For Product Form Modal
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/admin/products', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  const handleProductSubmit = async (productData) => {
    const method = editingProduct ? 'PATCH' : 'POST';
    const url = editingProduct ? `/api/admin/products/${editingProduct._id}` : '/api/admin/products';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error('Failed to save product');
      const savedProduct = await res.json();
      if (editingProduct) {
        setProducts(products.map(p => p._id === savedProduct._id ? savedProduct : p));
        toast.success('Product updated!');
      } else {
        setProducts([savedProduct, ...products]);
        toast.success('Product created!');
      }
      setIsFormVisible(false);
      setEditingProduct(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsFormVisible(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts(products.filter(p => p._id !== productId));
      toast.success('Product deleted!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading products...</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Products ({products.length})</h2>
        <button onClick={() => { setEditingProduct(null); setIsFormVisible(true); }} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
          Add New Product
        </button>
      </div>
      <ProductList products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />

      {isFormVisible && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleProductSubmit}
          onCancel={() => { setIsFormVisible(false); setEditingProduct(null); }}
        />
      )}
    </div>
  );
}