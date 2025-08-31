import React from 'react';
import Image from 'next/image';

export default function ProductList({ products, onEdit, onDelete }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Image</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <Image src={product.image} alt={product.title} width={60} height={60} className="object-contain" />
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{product.title}</td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">${product.price.toFixed(2)}</td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <button onClick={() => onEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                <button onClick={() => onDelete(product._id)} className="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}