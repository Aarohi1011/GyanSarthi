"use client";

import React, { useState, useEffect } from 'react';

export default function ProductForm({ product, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', image: '', category: ''
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({ title: '', description: '', price: '', image: '', category: '' });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.title || !formData.price || !formData.image) {
      alert('Please fill in all required fields.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="w-full p-2 border rounded" />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="w-full p-2 border rounded" />
          <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" required className="w-full p-2 border rounded" />
          <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" required className="w-full p-2 border rounded" />
          <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" required className="w-full p-2 border rounded" />
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}