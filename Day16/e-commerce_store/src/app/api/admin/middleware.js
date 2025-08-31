import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {
  const authHeader = req.headers.get('authorization');

  // 1. Check for the Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { message: 'Authentication token is required.' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if the user has the 'admin' role
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden: Access is restricted to administrators.' },
        { status: 403 }
      );
    }
    
    // 4. If all checks pass, proceed to the API route
    return NextResponse.next();
  } catch (err) {
    return NextResponse.json(
      { message: 'Invalid or expired token.' },
      { status: 401 }
    );
  }
}

// Apply the middleware to all routes under /api/admin/*
export const config = {
  matcher: '/api/admin/:path*',
};