import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

/**
 * API route for fetching all attendees with their redemption status
 */
export async function GET() {
  try {
    // Fetch attendees and redemptions in parallel
    const [attendeesSnapshot, redemptionsSnapshot] = await Promise.all([
      getDocs(collection(db, 'attendees')),
      getDocs(collection(db, 'redemptions'))
    ]);

    // Create a map of redemptions by attendee for quick lookup
    const redemptionMap = new Map();
    redemptionsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const key = `${data.attendeeName}-${data.email}`.toLowerCase();
      redemptionMap.set(key, {
        redeemedAt: data.timestamp?.toDate?.()?.toISOString() || data.timestamp,
        codeUrl: data.codeUrl
      });
    });

    // Process attendees with redemption info
    const attendees = attendeesSnapshot.docs.map(doc => {
      const data = doc.data();
      const redemptionKey = `${data.name}-${data.email}`.toLowerCase();
      const redemption = redemptionMap.get(redemptionKey);
      
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        hasRedeemed: !!redemption,
        redeemedAt: redemption?.redeemedAt,
        codeUrl: redemption?.codeUrl
      };
    });

    // Sort by redemption status (pending first) then by name
    attendees.sort((a, b) => {
      if (a.hasRedeemed !== b.hasRedeemed) {
        return a.hasRedeemed ? 1 : -1; // pending first
      }
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({ attendees });
  } catch (error) {
    console.error('Attendees API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendees' },
      { status: 500 }
    );
  }
}
