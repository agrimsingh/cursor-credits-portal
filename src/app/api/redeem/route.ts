/**
 * API route for code redemption
 * 
 * Handles the core business logic for validating attendee information
 * and assigning available codes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { AttendeeRedemptionSchema } from '@/features/attendees/model';
import type { ApiResponse } from '@/lib/types';

/**
 * POST /api/redeem
 * 
 * Redeems a code for an attendee based on their name and email.
 * For MVP, this uses mock data until Firebase is fully configured.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validatedData = AttendeeRedemptionSchema.parse(body);
    
    // Extract client information for audit trail (for future use)
    // const ipAddress = request.headers.get('x-forwarded-for') || 
    //                  request.headers.get('x-real-ip') || 
    //                  'unknown';
    // const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // TODO: Replace with actual Firestore lookup when Firebase is configured
    // Use realistic codes from sample data
    const sampleCodes = [
      '7E9E5B8Z1FJ', 'SUEHI0VGFWFY', '89VXCN3QDNCV', 'ERKCSGKXAYV',
      'FN8CR0HNTLBW', 'VZ2YOH3IJZJ', 'UY8DKTBLHRF', 'WAVLKVG8NBZT'
    ];
    const randomSampleCode = sampleCodes[Math.floor(Math.random() * sampleCodes.length)];
    const realisticUrl = `https://cursor.com/referral?code=${randomSampleCode}`;
    
    const result = {
      code: randomSampleCode,
      cursorUrl: realisticUrl,
      attendeeId: 'mock-attendee-id',
      redemptionId: 'mock-redemption-id',
    };
    
    const response: ApiResponse = {
      success: true,
      data: {
        code: result.code,
        cursorUrl: result.cursorUrl,
        name: validatedData.name,
        email: validatedData.email,
        redemptionId: result.redemptionId,
      },
      timestamp: new Date(),
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Redemption error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid request data',
      timestamp: new Date(),
    };
    
    return NextResponse.json(response, { status: 400 });
  }
}
