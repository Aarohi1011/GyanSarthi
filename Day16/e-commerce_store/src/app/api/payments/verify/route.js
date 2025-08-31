import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function POST(req) {
  try {
    await dbConnect();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      items,
      totalAmount
    } = await req.json();
    
    // The body to be hashed is order_id + "|" + payment_id
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    // Create the expected signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Compare the signatures
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // If signature is authentic, create and save the order in the database
      const newOrder = new Order({
        userId,
        items,
        totalAmount,
        paymentStatus: 'successful',
        razorpay: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
        },
      });

      await newOrder.save();
      
      return NextResponse.json({ message: 'Payment verified successfully', success: true }, { status: 200 });
    } else {
      // If signature is not authentic, return an error
      return NextResponse.json({ message: 'Invalid signature', success: false }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { message: 'An error occurred during payment verification', error: error.message },
      { status: 500 }
    );
  }
}