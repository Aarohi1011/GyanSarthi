"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';

// Helper function to dynamically load the Razorpay script
const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  // State to manage the payment process: 'idle', 'processing', 'successful', 'failed'
  const [paymentStatus, setPaymentStatus] = useState('idle');

  // Redirect if user is not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/checkout');
    }
  }, [user, authLoading, router]);

  const makePayment = async () => {
    if (cartItems.length === 0) {
        toast.error('Your cart is empty.');
        return;
    }

    setPaymentStatus('processing');
    const scriptLoaded = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!scriptLoaded) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      setPaymentStatus('failed');
      return;
    }

    try {
      // 1. Create a Razorpay Order on the backend
      const res = await fetch('/api/payments/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal, currency: 'INR' }),
      });

      const order = await res.json();
      if (!res.ok) {
        throw new Error(order.message || 'Failed to create Razorpay order');
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'My E-Commerce Store',
        description: 'Thank you for your purchase!',
        order_id: order.id,
        handler: async function (response) {
          // 3. This function is called on successful payment
          //    Verify Payment Signature on the backend
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user._id,
              items: cartItems.map(item => ({
                  productId: item.id,
                  title: item.title,
                  quantity: item.quantity,
                  price: item.price
              })),
              totalAmount: cartTotal
            }),
          });
          
          const verificationData = await verifyRes.json();
          if (verificationData.success) {
            // ✅ SUCCESS: Update state, show success toast, and clear the cart
            setPaymentStatus('successful');
            toast.success('Payment successful!');
            clearCart();
            // Optionally redirect after a few seconds
            setTimeout(() => router.push('/orders'), 3000);
          } else {
            // ❌ FAILED VERIFICATION: Update state and show error
            setPaymentStatus('failed');
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const paymentObject = new window.Razorpay(options);
      
      // Handle payment failure from Razorpay modal
      paymentObject.on('payment.failed', function (response) {
        setPaymentStatus('failed');
        toast.error(`Payment failed: ${response.error.description}`);
      });

      paymentObject.open();

    } catch (error) {
      setPaymentStatus('failed');
      toast.error(error.message);
    }
  };

  const renderPaymentButton = () => {
    switch (paymentStatus) {
      case 'processing':
        return (
          <button disabled className="w-full flex justify-center items-center bg-gray-400 text-white font-bold py-3 rounded-lg cursor-not-allowed">
            <FiLoader className="animate-spin mr-2" />
            Processing...
          </button>
        );
      case 'successful':
        return (
          <button disabled className="w-full flex justify-center items-center bg-green-600 text-white font-bold py-3 rounded-lg cursor-not-allowed">
            <FiCheckCircle className="mr-2" />
            Payment Successful!
          </button>
        );
      case 'failed':
        return (
           <button onClick={makePayment} className="w-full flex justify-center items-center bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors">
            <FiXCircle className="mr-2" />
            Payment Failed. Try Again.
          </button>
        );
      case 'idle':
      default:
        return (
          <button onClick={makePayment} disabled={cartItems.length === 0} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
            Pay ${cartTotal.toFixed(2)} with Razorpay
          </button>
        );
    }
  };


  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">Loading your details...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Checkout</h1>
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Order Summary */}
          <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Your Order</h2>
            {cartItems.length > 0 ? (
                <div className="space-y-4">
                {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
                </div>
            ) : (
                <p className="text-gray-500">Your cart is empty.</p>
            )}
            <hr className="my-4" />
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          {/* Payment Details */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Shipping to:</h3>
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                </div>
                {renderPaymentButton()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}