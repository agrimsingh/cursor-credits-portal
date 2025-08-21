/**
 * Test script for CSV data flow
 * 
 * This script simulates loading and processing CSV data
 * to validate the data structures and flow.
 */

const fs = require('fs');
const path = require('path');

function parseCsvLine(line) {
  // Simple CSV parser for test data
  return line.split(',').map(field => field.trim().replace(/"/g, ''));
}

function testAttendeesCsv() {
  try {
    console.log('🧪 Testing attendees CSV flow...');
    
    const csvPath = path.join(__dirname, '..', 'test_files', 'Cursor Meetup Hamburg - Guests - 2025-08-20-14-08-57.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }
    
    // Parse header
    const headers = parseCsvLine(lines[0]);
    console.log('📋 Headers found:', headers);
    
    // Parse sample attendees
    const sampleAttendees = lines.slice(1, 6).map((line, index) => {
      const values = parseCsvLine(line);
      const attendee = {};
      
      headers.forEach((header, i) => {
        attendee[header.toLowerCase().replace(/\s+/g, '_')] = values[i] || '';
      });
      
      return {
        id: `attendee-${index + 1}`,
        name: attendee.name || `Attendee ${index + 1}`,
        email: attendee.email || `attendee${index + 1}@example.com`,
        eventId: 'sample-event-1',
        hasRedeemedCode: false,
        createdAt: new Date(),
      };
    });
    
    console.log('👥 Sample attendees processed:', sampleAttendees.length);
    console.log('📝 First attendee:', sampleAttendees[0]);
    
    return sampleAttendees;
  } catch (error) {
    console.error('❌ Error processing attendees CSV:', error.message);
    return [];
  }
}

function testCodesCsv() {
  try {
    console.log('🎫 Testing codes CSV flow...');
    
    const csvPath = path.join(__dirname, '..', 'test_files', 'Codes Sheet7 (1).csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    // Parse sample codes
    const sampleCodes = lines.slice(1, 11).map((line, index) => {
      const code = line.trim().replace(/"/g, '');
      
      return {
        id: `code-${index + 1}`,
        code: code || `CURSOR-DEMO-${index + 1}`,
        isRedeemed: false,
        eventId: 'sample-event-1',
        createdAt: new Date(),
      };
    });
    
    console.log('🎫 Sample codes processed:', sampleCodes.length);
    console.log('🏷️ First code:', sampleCodes[0]);
    
    return sampleCodes;
  } catch (error) {
    console.error('❌ Error processing codes CSV:', error.message);
    return [];
  }
}

function runTest() {
  console.log('🚀 Starting CSV flow test...\n');
  
  const attendees = testAttendeesCsv();
  console.log('');
  const codes = testCodesCsv();
  
  console.log('\n📊 Test Summary:');
  console.log(`✅ Attendees loaded: ${attendees.length}`);
  console.log(`✅ Codes loaded: ${codes.length}`);
  
  if (attendees.length > 0 && codes.length > 0) {
    console.log('🎉 CSV flow test completed successfully!');
    console.log('\n💡 Ready for Phase 1 testing with:');
    console.log(`   • ${attendees.length} test attendees`);
    console.log(`   • ${codes.length} test codes`);
    console.log('   • Complete redemption flow');
  } else {
    console.log('⚠️ Some test data could not be loaded');
  }
}

// Run the test
runTest();
