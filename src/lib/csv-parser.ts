/**
 * CSV parsing utilities for codes and attendees
 * 
 * Handles parsing of actual CSV formats from Cursor events:
 * - Codes: cursor.com URLs with embedded codes
 * - Attendees: Luma export format with full attendee details
 */

/**
 * Extract code from cursor.com URL
 * Format: https://cursor.com/referral?code=ABCD1234,Creator,Date,Role
 */
export function extractCodeFromUrl(csvLine: string): string | null {
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

/**
 * Parse codes CSV file (format: cursor.com URLs)
 */
export function parseCodesCSV(csvContent: string): Array<{
  code: string;
  cursorUrl: string;
  creator?: string;
  date?: string;
}> {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const codes: Array<{ code: string; cursorUrl: string; creator?: string; date?: string }> = [];
  
  for (const line of lines) {
    const parts = line.split(',');
    const cursorUrl = parts[0]?.trim();
    const creator = parts[1]?.trim();
    const date = parts[2]?.trim();
    
    if (cursorUrl && cursorUrl.includes('cursor.com/referral?code=')) {
      const code = extractCodeFromUrl(line);
      if (code) {
        codes.push({
          code,
          cursorUrl,
          creator,
          date,
        });
      }
    }
  }
  
  return codes;
}

/**
 * Parse attendees CSV file (Luma export format)
 */
export function parseAttendeesCSV(csvContent: string): Array<{
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  checkedInAt?: string;
  approvalStatus?: string;
}> {
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return [];
  }
  
  // Parse headers
  const headers = lines[0].split(',').map(header => 
    header.trim().replace(/"/g, '').toLowerCase()
  );
  
  const attendees: Array<{
    name: string;
    email: string;
    firstName?: string;
    lastName?: string;
    checkedInAt?: string;
    approvalStatus?: string;
  }> = [];
  
  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const attendee: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      attendee[header] = values[index] || '';
    });
    
    // Only include approved attendees with name and email
    if (attendee.name && attendee.email && attendee.approval_status === 'approved') {
      attendees.push({
        name: attendee.name,
        email: attendee.email,
        firstName: attendee.first_name,
        lastName: attendee.last_name,
        checkedInAt: attendee.checked_in_at,
        approvalStatus: attendee.approval_status,
      });
    }
  }
  
  return attendees;
}

/**
 * Parse CSV line handling quoted fields and commas within quotes
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
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
