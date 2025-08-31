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

export default function OrdersPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/orders');
        return;
      }

      const fetchOrders = async () => {
        try {
          const res = await fetch('/api/orders', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
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

  if (loading || authLoading) {
    return <div className="text-center p-10">Loading your orders...</div>;
  }

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">My Orders</h1>
        {orders.length === 0 ? (
          <p>You have not placed any orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-wrap justify-between items-center mb-4">
                  <div>
                    <p className="font-bold text-lg">Order ID: <span className="font-normal text-gray-600">{order._id}</span></p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-2 sm:mt-0">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                    <p className="font-bold text-xl text-gray-800">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Items:</h3>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-gray-700 py-1">
                      <span>{item.title} (x{item.quantity})</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}