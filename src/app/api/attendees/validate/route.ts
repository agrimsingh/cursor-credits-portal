/**
 * API route for step-by-step attendee validation
 * 
 * Validates attendee name and email in steps to provide better UX
 * for the redemption flow.
 */

import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  AttendeeValidationStepSchema, 
  type AttendeeValidationResponse 
} from '@/features/attendees/model';
import type { ApiResponse } from '@/lib/types';

/**
 * POST /api/attendees/validate
 * 
 * Validates attendee information step by step:
 * - Step 1: Check if name exists in attendee list
 * - Step 2: Check if email matches the attendee name
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validatedData = AttendeeValidationStepSchema.parse(body);
    const { step, name, email, eventId } = validatedData;
    
    // Query attendees collection
    const attendeesRef = collection(db, 'attendees');
    let attendeeQuery;
    
    if (step === 'name') {
      // Step 1: Validate name exists
      attendeeQuery = query(
        attendeesRef,
        where('name', '==', name.trim())
      );
    } else {
      // Step 2: Validate name and email combination
      attendeeQuery = query(
        attendeesRef,
        where('name', '==', name.trim()),
        where('email', '==', email?.toLowerCase().trim())
      );
    }
    
    const snapshot = await getDocs(attendeeQuery);
    
    if (step === 'name') {
      // Name validation step
      if (snapshot.empty) {
        const validationResponse: AttendeeValidationResponse = {
          isValid: false,
          error: 'Attendee not found. Please check the name and try again.',
        };
        
        const response: ApiResponse = {
          success: false,
          data: validationResponse,
          timestamp: new Date(),
        };
        
        return NextResponse.json(response, { status: 404 });
      }
      
      // Name found - check if already redeemed
      const attendeeDoc = snapshot.docs[0];
      const attendeeData = attendeeDoc.data();
      
      // Check if already redeemed by looking for redemptions
      const redemptionsRef = collection(db, 'redemptions');
      const redemptionQuery = query(
        redemptionsRef,
        where('attendeeName', '==', name.trim()),
        where('email', '==', attendeeData.email)
      );
      const redemptionSnapshot = await getDocs(redemptionQuery);
      
      const hasAlreadyRedeemed = !redemptionSnapshot.empty;
      
      const validationResponse: AttendeeValidationResponse = {
        isValid: true,
        attendeeId: attendeeDoc.id,
        expectedEmail: attendeeData.email,
        hasAlreadyRedeemed,
      };
      
      const response: ApiResponse = {
        success: true,
        data: validationResponse,
        timestamp: new Date(),
      };
      
      return NextResponse.json(response);
    } else {
      // Email validation step
      if (snapshot.empty) {
        const validationResponse: AttendeeValidationResponse = {
          isValid: false,
          error: 'Email does not match the attendee record. Please check and try again.',
        };
        
        const response: ApiResponse = {
          success: false,
          data: validationResponse,
          timestamp: new Date(),
        };
        
        return NextResponse.json(response, { status:400 });
      }
      
      // Both name and email match
      const attendeeDoc = snapshot.docs[0];
      
      // Check if already redeemed
      const redemptionsRef = collection(db, 'redemptions');
      const redemptionQuery = query(
        redemptionsRef,
        where('attendeeName', '==', name.trim()),
        where('email', '==', email?.toLowerCase().trim())
      );
      const redemptionSnapshot = await getDocs(redemptionQuery);
      
      const hasAlreadyRedeemed = !redemptionSnapshot.empty;
      
      if (hasAlreadyRedeemed) {
        const validationResponse: AttendeeValidationResponse = {
          isValid: false,
          hasAlreadyRedeemed: true,
          error: 'You have already redeemed a code. Each attendee can only redeem one code.',
        };
        
        const response: ApiResponse = {
          success: false,
          data: validationResponse,
          timestamp: new Date(),
        };
        
        return NextResponse.json(response, { status:400 });
      }
      
      const validationResponse: AttendeeValidationResponse = {
        isValid: true,
        attendeeId: attendeeDoc.id,
      };
      
      const response: ApiResponse = {
        success: true,
        data: validationResponse,
        timestamp: new Date(),
      };
      
      return NextResponse.json(response);
    }
    
  } catch (error) {
    console.error('Attendee validation error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Validation failed',
      timestamp: new Date(),
    };
    
    return NextResponse.json(response, { status: 400 });
  }
}
