import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

/**
 * API route for exporting various types of data as CSV
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exportType = searchParams.get('type');

    if (!exportType) {
      return NextResponse.json(
        { error: 'Export type is required' },
        { status: 400 }
      );
    }

    let csvContent: string;
    let filename: string;

    switch (exportType) {
      case 'redemptions':
        ({ csvContent, filename } = await exportRedemptions());
        break;
      case 'codes':
        ({ csvContent, filename } = await exportCodes());
        break;
      case 'attendees':
        ({ csvContent, filename } = await exportAttendees());
        break;
      case 'summary':
        ({ csvContent, filename } = await exportSummary());
        break;
      case 'unused-codes':
        ({ csvContent, filename } = await exportUnusedCodes());
        break;
      case 'audit-trail':
        ({ csvContent, filename } = await exportAuditTrail());
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid export type' },
          { status: 400 }
        );
    }

    // Return CSV file as download
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    );
  }
}

async function exportRedemptions() {
  const redemptionsSnapshot = await getDocs(
    query(collection(db, 'redemptions'), orderBy('timestamp', 'desc'))
  );

  const headers = ['Attendee Name', 'Email', 'Code URL', 'Redeemed At', 'IP Address'];
  const rows = redemptionsSnapshot.docs.map(doc => {
    const data = doc.data();
    return [
      data.attendeeName || '',
      data.email || '',
      data.codeUrl || '',
      data.timestamp?.toDate?.()?.toISOString() || data.timestamp || '',
      data.ipAddress || 'N/A'
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return {
    csvContent,
    filename: `redemptions-${new Date().toISOString().split('T')[0]}.csv`
  };
}

async function exportCodes() {
  const [codesSnapshot, redemptionsSnapshot] = await Promise.all([
    getDocs(collection(db, 'codes')),
    getDocs(collection(db, 'redemptions'))
  ]);

  // Create redemption lookup map
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

  const headers = ['Code URL', 'Status', 'Redeemed By', 'Email', 'Redeemed At'];
  const rows = codesSnapshot.docs.map(doc => {
    const data = doc.data();
    const redemption = redemptionMap.get(data.url);
    
    return [
      data.url || '',
      redemption ? 'Used' : 'Available',
      redemption?.redeemedBy || '',
      redemption?.email || '',
      redemption?.redeemedAt || ''
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return {
    csvContent,
    filename: `codes-${new Date().toISOString().split('T')[0]}.csv`
  };
}

async function exportAttendees() {
  const [attendeesSnapshot, redemptionsSnapshot] = await Promise.all([
    getDocs(collection(db, 'attendees')),
    getDocs(collection(db, 'redemptions'))
  ]);

  // Create redemption lookup map
  const redemptionMap = new Map();
  redemptionsSnapshot.docs.forEach(doc => {
    const data = doc.data();
    const key = `${data.attendeeName}-${data.email}`.toLowerCase();
    redemptionMap.set(key, {
      redeemedAt: data.timestamp?.toDate?.()?.toISOString() || data.timestamp,
      codeUrl: data.codeUrl
    });
  });

  const headers = ['Name', 'Email', 'Status', 'Redeemed At', 'Code URL'];
  const rows = attendeesSnapshot.docs.map(doc => {
    const data = doc.data();
    const redemptionKey = `${data.name}-${data.email}`.toLowerCase();
    const redemption = redemptionMap.get(redemptionKey);
    
    return [
      data.name || '',
      data.email || '',
      redemption ? 'Redeemed' : 'Pending',
      redemption?.redeemedAt || '',
      redemption?.codeUrl || ''
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return {
    csvContent,
    filename: `attendees-${new Date().toISOString().split('T')[0]}.csv`
  };
}

async function exportSummary() {
  const [codesSnapshot, attendeesSnapshot, redemptionsSnapshot] = await Promise.all([
    getDocs(collection(db, 'codes')),
    getDocs(collection(db, 'attendees')),
    getDocs(collection(db, 'redemptions'))
  ]);

  const totalCodes = codesSnapshot.size;
  const totalAttendees = attendeesSnapshot.size;
  const totalRedemptions = redemptionsSnapshot.size;
  const redemptionRate = totalAttendees > 0 ? (totalRedemptions / totalAttendees * 100).toFixed(1) : '0';

  const headers = ['Metric', 'Value'];
  const rows = [
    ['Export Date', new Date().toISOString()],
    ['Total Codes Available', totalCodes.toString()],
    ['Total Attendees Registered', totalAttendees.toString()],
    ['Total Redemptions', totalRedemptions.toString()],
    ['Codes Remaining', (totalCodes - totalRedemptions).toString()],
    ['Redemption Rate', `${redemptionRate}%`],
    ['Last Activity', redemptionsSnapshot.docs.length > 0 ? 
      (redemptionsSnapshot.docs[0].data().timestamp?.toDate?.()?.toISOString() || 'N/A') : 'N/A']
  ];

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return {
    csvContent,
    filename: `event-summary-${new Date().toISOString().split('T')[0]}.csv`
  };
}

async function exportUnusedCodes() {
  const [codesSnapshot, redemptionsSnapshot] = await Promise.all([
    getDocs(collection(db, 'codes')),
    getDocs(collection(db, 'redemptions'))
  ]);

  // Get set of used code URLs
  const usedUrls = new Set(
    redemptionsSnapshot.docs.map(doc => doc.data().codeUrl).filter(Boolean)
  );

  // Filter to only unused codes
  const unusedCodes = codesSnapshot.docs
    .map(doc => doc.data())
    .filter(code => !usedUrls.has(code.url));

  const headers = ['Code URL'];
  const rows = unusedCodes.map(code => [code.url || '']);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return {
    csvContent,
    filename: `unused-codes-${new Date().toISOString().split('T')[0]}.csv`
  };
}

async function exportAuditTrail() {
  // This would include all system events, uploads, etc.
  // For now, we'll include redemptions with additional metadata
  const redemptionsSnapshot = await getDocs(
    query(collection(db, 'redemptions'), orderBy('timestamp', 'desc'))
  );

  const headers = [
    'Event Type', 'Timestamp', 'Attendee Name', 'Email', 
    'Code URL', 'IP Address', 'User Agent', 'Document ID'
  ];
  
  const rows = redemptionsSnapshot.docs.map(doc => {
    const data = doc.data();
    return [
      'code_redemption',
      data.timestamp?.toDate?.()?.toISOString() || data.timestamp || '',
      data.attendeeName || '',
      data.email || '',
      data.codeUrl || '',
      data.ipAddress || 'N/A',
      data.userAgent || 'N/A',
      doc.id
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return {
    csvContent,
    filename: `audit-trail-${new Date().toISOString().split('T')[0]}.csv`
  };
}
