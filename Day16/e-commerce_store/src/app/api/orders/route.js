import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { authMiddleware } from '@/lib/authMiddleware';

export async function GET(req) {
  const { user, error } = authMiddleware(req);
  if (error) return error;

  try {
    await dbConnect();
    const orders = await Order.find({ userId: user.id }).sort({ createdAt: -1 });
    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Server Error', error: err.message }, { status: 500 });
  }
}