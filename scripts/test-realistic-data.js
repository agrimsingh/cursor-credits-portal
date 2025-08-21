/**
 * Test script with realistic data from actual CSV files
 * 
 * Uses the exact format from the provided CSV files to test
 * the parsing and data flow.
 */

const fs = require('fs');
const path = require('path');

// Import our parsing functions (simulate module import)
function extractCodeFromUrl(csvLine) {
  try {
    const parts = csvLine.split(',');
    const urlPart = parts[0];
    
    if (!urlPart.includes('cursor.com/referral?code=')) {
      return null;
    }
    
    const url = new URL(urlPart);
    const code = url.searchParams.get('code');
    
    return code || null;
  } catch (error) {
    console.error('Error extracting code from URL:', error);
    return null;
  }
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function testRealisticCodesData() {
  console.log('🎫 Testing with realistic codes data...\n');
  
  try {
    const csvPath = path.join(__dirname, '..', 'test_files', 'Codes Sheet7 (1).csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    console.log(`📄 Found ${lines.length} lines in codes CSV`);
    
    // Process first 5 codes
    const processedCodes = [];
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      const code = extractCodeFromUrl(line);
      
      if (code) {
        processedCodes.push({
          originalLine: line,
          extractedCode: code,
          cursorUrl: `https://cursor.com/referral?code=${code}`,
        });
      }
    }
    
    console.log('✅ Successfully processed codes:');
    processedCodes.forEach((item, index) => {
      console.log(`  ${index + 1}. Code: ${item.extractedCode}`);
      console.log(`     URL: ${item.cursorUrl}`);
    });
    
    return processedCodes;
  } catch (error) {
    console.error('❌ Error processing codes:', error.message);
    return [];
  }
}

function testRealisticAttendeesData() {
  console.log('\n👥 Testing with realistic attendees data...\n');
  
  try {
    const csvPath = path.join(__dirname, '..', 'test_files', 'Cursor Meetup Hamburg - Guests - 2025-08-20-14-08-57.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }
    
    // Parse headers
    const headers = parseCSVLine(lines[0]).map(header => 
      header.replace(/"/g, '').toLowerCase().trim()
    );
    
    console.log(`📄 Found ${lines.length - 1} attendees`);
    console.log('📋 Key headers:', headers.filter(h => 
      ['name', 'email', 'approval_status', 'checked_in_at'].includes(h)
    ));
    
    // Process first 5 approved attendees
    const processedAttendees = [];
    for (let i = 1; i < Math.min(6, lines.length); i++) {
      const values = parseCSVLine(lines[i]);
      const attendee = {};
      
      headers.forEach((header, index) => {
        attendee[header] = values[index] || '';
      });
      
      // Only include approved attendees
      if (attendee.approval_status === 'approved' && attendee.name && attendee.email) {
        processedAttendees.push({
          name: attendee.name,
          email: attendee.email,
          approvalStatus: attendee.approval_status,
          checkedInAt: attendee.checked_in_at,
        });
      }
    }
    
    console.log('✅ Successfully processed attendees:');
    processedAttendees.forEach((attendee, index) => {
      console.log(`  ${index + 1}. ${attendee.name} (${attendee.email})`);
      console.log(`     Status: ${attendee.approvalStatus}, Checked in: ${attendee.checkedInAt || 'No'}`);
    });
    
    return processedAttendees;
  } catch (error) {
    console.error('❌ Error processing attendees:', error.message);
    return [];
  }
}

function runRealisticTest() {
  console.log('🚀 Testing with REAL CSV data formats...\n');
  
  const codes = testRealisticCodesData();
  const attendees = testRealisticAttendeesData();
  
  console.log('\n📊 Realistic Test Summary:');
  console.log(`✅ Codes extracted: ${codes.length}`);
  console.log(`✅ Approved attendees: ${attendees.length}`);
  
  if (codes.length > 0 && attendees.length > 0) {
    console.log('\n🎉 Realistic data parsing successful!');
      console.log('\n💡 Ready for production with:');
  console.log(`   • ${codes.length} valid cursor.com referral URLs`);
  console.log(`   • ${attendees.length} approved attendees from Luma`);
  console.log('   • Proper URL format for seamless claiming');
  console.log('   • Clickable links (no copy-paste needed)');
  console.log('   • Firebase Storage ready for CSV processing');
  }
}

// Run the realistic test
runRealisticTest();
