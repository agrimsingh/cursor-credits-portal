/**
 * Data seeding script for development and testing
 * 
 * This script populates Firestore with sample event and code data
 * for testing the redemption flow.
 * 
 * Usage: node scripts/seed-data.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, Timestamp } = require('firebase/firestore');

// Firebase config - you'll need to update with your project details
const firebaseConfig = {
  // Add your Firebase config here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');

    // Create sample event
    const eventRef = doc(db, 'events', 'sample-event-1');
    await setDoc(eventRef, {
      name: 'Cursor Hamburg Hackathon',
      description: 'A fantastic hackathon event in Hamburg',
      organizerId: 'admin-user-1',
      organizationName: 'Cursor Hamburg',
      location: 'Hamburg, Germany',
      eventDate: Timestamp.fromDate(new Date('2025-08-20')),
      isActive: true,
      totalCodes: 100,
      redeemedCodes: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log('✅ Created sample event');

    // Create sample codes
    const codes = [
      'CURSOR-HAMBURG-001',
      'CURSOR-HAMBURG-002', 
      'CURSOR-HAMBURG-003',
      'CURSOR-HAMBURG-004',
      'CURSOR-HAMBURG-005',
    ];

    for (let i = 0; i < codes.length; i++) {
      const codeRef = doc(db, 'codes', `code-${i + 1}`);
      await setDoc(codeRef, {
        code: codes[i],
        isRedeemed: false,
        eventId: 'sample-event-1',
        createdAt: Timestamp.now(),
      });
    }

    console.log(`✅ Created ${codes.length} sample codes`);
    console.log('🎉 Data seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

// Run the seeding
seedData();
