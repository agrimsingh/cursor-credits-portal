/**
 * Firebase Storage helpers for CSV file processing
 * 
 * Handles uploading and processing CSV files for codes and attendees.
 */

import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from './firebase';
import { parseCodesCSV, parseAttendeesCSV } from './csv-parser';

/**
 * Upload CSV file to Firebase Storage
 */
export async function uploadCSVFile(
  file: File, 
  eventId: string, 
  type: 'codes' | 'attendees'
): Promise<string> {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `${type}-${eventId}-${timestamp}-${file.name}`;
    const storageRef = ref(storage, `events/${eventId}/csv/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading CSV file:', error);
    throw new Error('Failed to upload CSV file');
  }
}

/**
 * Process codes CSV file and return parsed data
 */
export async function processCodesCSV(file: File): Promise<Array<{
  code: string;
  cursorUrl: string;
  creator?: string;
  date?: string;
}>> {
  try {
    const text = await file.text();
    return parseCodesCSV(text);
  } catch (error) {
    console.error('Error processing codes CSV:', error);
    throw new Error('Failed to process codes CSV file');
  }
}

/**
 * Process attendees CSV file and return parsed data
 */
export async function processAttendeesCSV(file: File): Promise<Array<{
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  checkedInAt?: string;
  approvalStatus?: string;
}>> {
  try {
    const text = await file.text();
    return parseAttendeesCSV(text);
  } catch (error) {
    console.error('Error processing attendees CSV:', error);
    throw new Error('Failed to process attendees CSV file');
  }
}

/**
 * List all CSV files for an event
 */
export async function listEventCSVFiles(eventId: string): Promise<Array<{
  name: string;
  url: string;
  type: 'codes' | 'attendees';
}>> {
  try {
    const csvRef = ref(storage, `events/${eventId}/csv/`);
    const result = await listAll(csvRef);
    
    const files = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        const type = itemRef.name.startsWith('codes-') ? 'codes' : 'attendees';
        
        return {
          name: itemRef.name,
          url,
          type: type as 'codes' | 'attendees',
        };
      })
    );
    
    return files;
  } catch (error) {
    console.error('Error listing CSV files:', error);
    throw new Error('Failed to list CSV files');
  }
}
