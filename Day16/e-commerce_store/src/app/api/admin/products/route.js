import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

// Get all products
export async function GET() {
  await dbConnect();
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server Error', error }, { status: 500 });
  }
}

// Create a new product
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const newProduct = await Product.create(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server Error', error }, { status: 500 });
  }
}