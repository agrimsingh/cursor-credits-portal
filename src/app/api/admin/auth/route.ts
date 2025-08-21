import { NextRequest, NextResponse } from 'next/server';

/**
 * API route for admin password authentication.
 * Validates password against ADMIN_PASSWORD environment variable.
 */
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Get admin password from environment
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD not configured in environment');
      return NextResponse.json(
        { success: false, error: 'Admin authentication not configured' },
        { status: 500 }
      );
    }

    // Simple password comparison
    const isValid = password === adminPassword;

    if (isValid) {
      return NextResponse.json({ success: true });
    } else {
      // Add small delay to prevent brute force attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
