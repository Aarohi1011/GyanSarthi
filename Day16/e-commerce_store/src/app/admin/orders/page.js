"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Shipped: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const ORDER_STATUSES = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        toast.error('Access Denied. Admins only.');
        router.push('/');
        return;
      }

      const fetchOrders = async () => {
        try {
          const res = await fetch('/api/orders/admin', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!res.ok) throw new Error('Failed to fetch orders');
          const data = await res.json();
          setOrders(data);
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [user, token, authLoading, router]);

  const handleStatusChange = async (orderId, newStatus) => {
    const originalOrders = [...orders];
    // Optimistically update UI
    setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success('Order status updated!');
    } catch (error) {
      // Revert UI on failure
      setOrders(originalOrders);
      toast.error(error.message);
    }
  };

  if (loading || authLoading) {
    return <div className="text-center p-10">Loading all orders...</div>;
  }

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6">Admin: All Orders</h1>
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{order._id.slice(-6)}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{order.userId?.name || 'N/A'}</p>
                    <p className="text-gray-600 whitespace-no-wrap">{order.userId?.email || 'N/A'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">${order.totalAmount.toFixed(2)}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`w-full p-2 rounded-md border-2 ${statusColors[order.orderStatus].replace('bg-', 'border-').replace('-100', '-300')}`}
                    >
                      {ORDER_STATUSES.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}