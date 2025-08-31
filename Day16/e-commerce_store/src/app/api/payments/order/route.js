import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import shortid from 'shortid';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const { amount, currency } = await req.json();

    // Razorpay requires amount in the smallest currency unit (e.g., paise for INR)
        const orderAmount = Math.round(amount * 100);

    const options = {
      amount: orderAmount.toString(),
      currency,
      receipt: `receipt_order_${shortid.generate()}`, // Generate a unique receipt ID
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { message: 'Failed to create Razorpay order', error: error.message },
      { status: 500 }
    );
  }
}