/**
 * Firebase helper functions for data operations
 * 
 * Provides abstracted functions for common Firestore operations
 * used throughout the application.
 */

import { 
  collection, 
  doc,
  query, 
  where, 
  getDocs, 
  Timestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from './firebase';
import type { Redemption } from '@/lib/types';
import type { Attendee } from '@/features/attendees/model';
import type { Code } from '@/features/codes/model';

/**
 * Find an attendee by name and email for a specific event
 */
export async function findAttendeeByDetails(
  name: string, 
  email: string, 
  eventId: string
): Promise<Attendee | null> {
  try {
    const attendeesRef = collection(db, 'attendees');
    const q = query(
      attendeesRef,
      where('name', '==', name),
      where('email', '==', email),
      where('eventId', '==', eventId)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      redeemedAt: doc.data().redeemedAt?.toDate(),
    } as Attendee;
  } catch (error) {
    console.error('Error finding attendee:', error);
    throw new Error('Failed to find attendee record');
  }
}

/**
 * Get an available (unredeemed) code for an event
 */
export async function getAvailableCode(eventId: string): Promise<Code | null> {
  try {
    const codesRef = collection(db, 'codes');
    const q = query(
      codesRef,
      where('eventId', '==', eventId),
      where('isRedeemed', '==', false)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    // Get the first available code
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      redeemedAt: doc.data().redeemedAt?.toDate(),
    } as Code;
  } catch (error) {
    console.error('Error finding available code:', error);
    throw new Error('Failed to find available code');
  }
}

/**
 * Redeem a code for an attendee (atomic transaction)
 */
export async function redeemCodeForAttendee(
  attendeeData: { name: string; email: string; eventId: string },
  ipAddress?: string,
  userAgent?: string
): Promise<{ code: string; attendeeId: string; redemptionId: string }> {
  try {
    return await runTransaction(db, async (transaction) => {
      // Find available code
      const codesRef = collection(db, 'codes');
      const codeQuery = query(
        codesRef,
        where('eventId', '==', attendeeData.eventId),
        where('isRedeemed', '==', false)
      );
      
      const codeSnapshot = await getDocs(codeQuery);
      if (codeSnapshot.empty) {
        throw new Error('No codes available for this event');
      }
      
      const codeDoc = codeSnapshot.docs[0];
      const codeData = codeDoc.data() as Code;
      
      // Check if attendee already redeemed
      const attendeesRef = collection(db, 'attendees');
      const attendeeQuery = query(
        attendeesRef,
        where('name', '==', attendeeData.name),
        where('email', '==', attendeeData.email),
        where('eventId', '==', attendeeData.eventId)
      );
      
      const attendeeSnapshot = await getDocs(attendeeQuery);
      if (!attendeeSnapshot.empty) {
        const existingAttendee = attendeeSnapshot.docs[0].data();
        if (existingAttendee.hasRedeemedCode) {
          throw new Error('You have already claimed your code for this event');
        }
      }
      
      const now = Timestamp.now();
      const attendeeRef = doc(collection(db, 'attendees'));
      const redemptionRef = doc(collection(db, 'redemptions'));
      
      // Create attendee record
      const attendee: Omit<Attendee, 'id'> = {
        ...attendeeData,
        hasRedeemedCode: true,
        redeemedCodeId: codeDoc.id,
        createdAt: now.toDate(),
        redeemedAt: now.toDate(),
      };
      
      // Create redemption record
      const redemption: Omit<Redemption, 'id'> = {
        eventId: attendeeData.eventId,
        attendeeId: attendeeRef.id,
        codeId: codeDoc.id,
        attendeeName: attendeeData.name,
        attendeeEmail: attendeeData.email,
        codeValue: codeData.code,
        redeemedAt: now.toDate(),
        ipAddress,
        userAgent,
      };
      
      // Update code as redeemed
      transaction.update(doc(db, 'codes', codeDoc.id), {
        isRedeemed: true,
        redeemedAt: now,
        redeemedBy: attendeeRef.id,
      });
      
      // Create attendee record
      transaction.set(attendeeRef, {
        ...attendee,
        createdAt: now,
        redeemedAt: now,
      });
      
      // Create redemption record
      transaction.set(redemptionRef, {
        ...redemption,
        redeemedAt: now,
      });
      
      return {
        code: codeData.code,
        attendeeId: attendeeRef.id,
        redemptionId: redemptionRef.id,
      };
    });
  } catch (error) {
    console.error('Error redeeming code:', error);
    throw error;
  }
}
