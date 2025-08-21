/**
 * Data seeding script for development and testing
 * 
 * This script populates Firestore with sample data matching our current schema:
 * - codes: { url, isUsed, createdAt }
 * - attendees: { name, email, createdAt }
 * - redemptions: { attendeeName, email, codeUrl, timestamp }
 * 
 * Usage: node scripts/seed-data.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, addDoc, Timestamp } = require('firebase/firestore');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');

    // Create sample codes (matching our current schema)
    const sampleCodes = [
      { code: 'ABC123DEF456', url: 'https://cursor.com/redeem/abc123def456ghi789' },
      { code: 'JKL012MNO345', url: 'https://cursor.com/redeem/jkl012mno345pqr678' },
      { code: 'STU901VWX234', url: 'https://cursor.com/redeem/stu901vwx234yzA567' },
      { code: 'BCD890EFG123', url: 'https://cursor.com/redeem/bcd890efg123hij456' },
      { code: 'KLM789NOP012', url: 'https://cursor.com/redeem/klm789nop012qrs345' },
    ];

    for (let i = 0; i < sampleCodes.length; i++) {
      await addDoc(collection(db, 'codes'), {
        code: sampleCodes[i].code,
        cursorUrl: sampleCodes[i].url,
        isRedeemed: false, // Fixed: Match redemption API expectations
        createdAt: Timestamp.now(),
      });
    }

    console.log(`✅ Created ${sampleCodes.length} sample codes`);

    // Create sample attendees (matching our current schema)
    const sampleAttendees = [
      { name: 'Alex Schmidt', email: 'alex.schmidt@example.com' },
      { name: 'Sarah Johnson', email: 'sarah.j@example.com' },
      { name: 'Mike Chen', email: 'mchen@example.com' },
      { name: 'Emma Williams', email: 'emma.w@example.com' },
      { name: 'David Brown', email: 'david.brown@example.com' },
    ];

    for (const attendee of sampleAttendees) {
      await addDoc(collection(db, 'attendees'), {
        name: attendee.name,
        email: attendee.email,
        createdAt: Timestamp.now(),
      });
    }

    console.log(`✅ Created ${sampleAttendees.length} sample attendees`);

    // Create a sample redemption
    await addDoc(collection(db, 'redemptions'), {
      attendeeName: 'Alex Schmidt',
      email: 'alex.schmidt@example.com',
      codeUrl: 'https://cursor.com/redeem/abc123def456ghi789',
      timestamp: Timestamp.now(),
      ipAddress: '127.0.0.1'
    });

    console.log('✅ Created sample redemption');
    console.log('🎉 Data seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

// Run the seeding
seedData();
