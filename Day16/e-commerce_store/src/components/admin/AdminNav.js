"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();

  const activeClasses = 'bg-blue-600 text-white';
  const inactiveClasses = 'bg-gray-200 text-gray-800 hover:bg-gray-300';

  return (
    <div className="mb-6">
      <Link href="/admin">
        <button
          className={`px-4 py-2 mr-2 rounded-lg font-semibold transition-colors ${
            pathname === '/admin' ? activeClasses : inactiveClasses
          }`}
        >
          Products
        </button>
      </Link>
      <Link href="/admin/orders">
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            pathname === '/admin/orders' ? activeClasses : inactiveClasses
          }`}
        >
          Orders
        </button>
      </Link>
    </div>
  );
}