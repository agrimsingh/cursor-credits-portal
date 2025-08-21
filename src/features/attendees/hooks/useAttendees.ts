/**
 * Hook for fetching and managing attendee data
 * 
 * Provides auto-suggestion capabilities for the redemption form
 * by fetching attendees who haven't redeemed codes yet.
 */

import { useState, useEffect } from 'react';

export interface AttendeeForSuggestion {
  id: string;
  name: string;
  email: string;
  hasRedeemed: boolean;
}

export function useAttendees(projectId?: string) {
  const [attendees, setAttendees] = useState<AttendeeForSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAttendees();
  }, [projectId]);

  const fetchAttendees = async () => {
    try {
      setIsLoading(true);
      const url = projectId ? `/api/attendees?projectId=${projectId}` : '/api/attendees';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch attendees');
      }
      
      const data = await response.json();
      setAttendees(data.attendees || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attendees');
      console.error('Error fetching attendees:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get attendees who haven't redeemed codes for suggestions
  const availableAttendees = attendees.filter(attendee => !attendee.hasRedeemed);

  // Find attendee by exact name match
  const findAttendeeByName = (name: string): AttendeeForSuggestion | null => {
    const trimmedName = name.trim();
    return attendees.find(
      attendee => attendee.name.toLowerCase() === trimmedName.toLowerCase()
    ) || null;
  };

  // Get name suggestions based on partial input
  const getNameSuggestions = (input: string): AttendeeForSuggestion[] => {
    if (!input || input.length < 2) return [];
    
    const searchTerm = input.toLowerCase().trim();
    return availableAttendees
      .filter(attendee => 
        attendee.name.toLowerCase().includes(searchTerm)
      )
      .slice(0, 5); // Limit to 5 suggestions for UX
  };

  return {
    attendees,
    availableAttendees,
    isLoading,
    error,
    findAttendeeByName,
    getNameSuggestions,
    refetch: fetchAttendees,
  };
}
