"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiLogIn } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  // Calculate the total number of items in the cart
  const totalCartItems = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-gray-700">
          MyStore
        </Link>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {user ? (
            // If user is logged in
            <div className="relative group">
              <Link href={user.role === 'admin' ? '/admin' : '/orders'} className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                <FiUser size={22} />
                <span className="hidden sm:inline font-medium">{user.name}</span>
              </Link>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link href={user.role === 'admin' ? '/admin' : '/orders'} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  {user.role === 'admin' ? 'Admin Dashboard' : 'My Orders'}
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            // If user is not logged in
            <Link href="/login" className="flex items-center text-gray-700 hover:text-blue-600">
              <FiLogIn size={22} />
              <span className="ml-2 hidden sm:inline font-medium">Login</span>
            </Link>
          )}

          {/* Cart Icon */}
          <Link href="/cart" className="relative flex items-center text-gray-700 hover:text-blue-600">
            <FiShoppingCart size={24} />
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}