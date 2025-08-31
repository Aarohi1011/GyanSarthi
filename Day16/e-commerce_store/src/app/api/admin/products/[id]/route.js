import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

// Update a product
export async function PATCH(req, { params }) {
  await dbConnect();
  try {
    const body = await req.json();
    const updatedProduct = await Product.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server Error', error }, { status: 500 });
  }
}

// Delete a product
export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    const deletedProduct = await Product.findByIdAndDelete(params.id);
    if (!deletedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server Error', error }, { status: 500 });
  }
}