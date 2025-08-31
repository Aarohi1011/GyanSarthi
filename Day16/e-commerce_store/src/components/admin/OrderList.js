import React from 'react';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Shipped: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const ORDER_STATUSES = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrderList({ orders, onStatusChange }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order._id.slice(-6)}</td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.userId?.name || 'N/A'}</td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">${order.totalAmount.toFixed(2)}</td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <select
                  value={order.orderStatus}
                  onChange={(e) => onStatusChange(order._id, e.target.value)}
                  className={`p-2 rounded-md border-2 ${statusColors[order.orderStatus].replace('bg-', 'border-').replace('-100', '-300')}`}
                >
                  {ORDER_STATUSES.map(status => ( <option key={status} value={status}>{status}</option>))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}