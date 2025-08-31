import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { authMiddleware } from '@/lib/authMiddleware';

export async function GET(req) {
  const { user, error } = authMiddleware(req);
  if (error) return error;

  // Authorization check: Only admins can access
  if (user.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden: Access is restricted to administrators.' }, { status: 403 });
  }

  try {
    await dbConnect();
    // Populate user details for the admin view
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('userId', 'name email'); // Get user's name and email

    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Server Error', error: err.message }, { status: 500 });
  }
}