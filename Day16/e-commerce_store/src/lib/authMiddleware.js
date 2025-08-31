import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

/**
 * Middleware to verify JWT from the Authorization header.
 * @param {Request} req - The incoming request object.
 * @returns {{user?: object, error?: NextResponse}} - An object containing the decoded user payload or an error response.
 */
export const authMiddleware = (req) => {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const errorResponse = NextResponse.json(
      { message: 'Authentication token is required.' },
      { status: 401 }
    );
    return { error: errorResponse };
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // The decoded object will contain { id, role }
    return { user: decoded };
  } catch (err) {
    const errorResponse = NextResponse.json(
      { message: 'Invalid or expired token.' },
      { status: 401 }
    );
    return { error: errorResponse };
  }
};