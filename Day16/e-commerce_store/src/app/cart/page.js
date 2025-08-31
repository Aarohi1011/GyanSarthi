"use client";

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  // Handle the case where the cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto text-center p-10 bg-white rounded-lg shadow-xl mt-10">
        <h1 className="text-3xl font-bold mb-4 text-gray-700">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/" passHref>
          <button className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  // Render the cart with items
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="w-full lg:w-2/3 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Image src={item.image} alt={item.title} width={100} height={100} className="rounded-md object-contain" />
              <div className="flex-grow ml-4">
                <h2 className="font-bold text-lg text-gray-800">{item.title}</h2>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-sm mt-1">
                  Remove
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 font-bold">-</button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 font-bold">+</button>
              </div>
              <div className="ml-4 font-semibold text-lg w-24 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 border-b pb-3">Order Summary</h2>
            <div className="flex justify-between mb-2 text-gray-600">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between font-bold text-xl text-gray-800">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button className="w-full mt-6 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}