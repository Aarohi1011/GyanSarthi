"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({ children }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role !== 'admin') {
    return <div className="text-center p-10">Loading and verifying access...</div>;
  }

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Dashboard</h1>
        {/* Shared navigation for all admin pages */}
        <AdminNav />
        {/* Page-specific content will be rendered here */}
        <div>{children}</div>
      </div>
    </>
  );
}