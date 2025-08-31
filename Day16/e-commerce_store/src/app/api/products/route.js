import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Helper to connect to the database
import Product from '@/models/Product';   // Your Mongoose Product model

/**
 * Handles GET requests to fetch all products from the database.
 * @returns {NextResponse} A JSON response containing the list of products or an error message.
 */
export async function GET() {
  try {
    // Ensure the database is connected
    await dbConnect();

    // Fetch all products and sort them by creation date (newest first)
    const products = await Product.find({}).sort({ createdAt: -1 });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching products.', error: error.message },
      { status: 500 }
    );
  }
}