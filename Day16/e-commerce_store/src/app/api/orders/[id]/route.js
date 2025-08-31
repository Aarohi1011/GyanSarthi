import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { authMiddleware } from '@/lib/authMiddleware';

export async function PATCH(req, { params }) {
  const { user, error } = authMiddleware(req);
  if (error) return error;

  if (user.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden: Access is restricted to administrators.' }, { status: 403 });
  }

  const { id } = params;
  const { orderStatus } = await req.json();

  if (!orderStatus) {
    return NextResponse.json({ message: 'Order status is required.' }, { status: 400 });
  }

  try {
    await dbConnect();
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Server Error', error: err.message }, { status: 500 });
  }
}