import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

/**
 * API route for fetching all codes with their redemption status
 */
export async function GET() {
  try {
    // Fetch codes and redemptions in parallel
    // Handle case where collections don't exist yet (they'll return empty snapshots)
    const [codesSnapshot, redemptionsSnapshot] = await Promise.all([
      getDocs(collection(db, 'codes')),
      getDocs(collection(db, 'redemptions'))
    ]);

    // Create a map of redeemed codes for quick lookup
    const redemptionMap = new Map();
    redemptionsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.codeUrl) {
        redemptionMap.set(data.codeUrl, {
          redeemedBy: data.attendeeName,
          redeemedAt: data.timestamp?.toDate?.()?.toISOString() || data.timestamp,
          email: data.email
        });
      }
    });

    // Process codes with redemption info
    const codes = codesSnapshot.docs
      .map(doc => {
        const data = doc.data();
        const redemption = redemptionMap.get(data.url);
        
        return {
          id: doc.id,
          url: data.url || '', // Ensure url is never undefined
          isUsed: !!redemption,
          redeemedBy: redemption?.redeemedBy,
          redeemedAt: redemption?.redeemedAt,
          email: redemption?.email
        };
      })
      .filter(code => code.url); // Filter out any codes without URLs

    // Sort by status (unused first) then by URL
    codes.sort((a, b) => {
      if (a.isUsed !== b.isUsed) {
        return a.isUsed ? 1 : -1; // unused first
      }
      // Safe comparison with null checks
      const urlA = a.url || '';
      const urlB = b.url || '';
      return urlA.localeCompare(urlB);
    });

    return NextResponse.json({ codes });
  } catch (error) {
    console.error('Codes API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch codes' },
      { status: 500 }
    );
  }
}
