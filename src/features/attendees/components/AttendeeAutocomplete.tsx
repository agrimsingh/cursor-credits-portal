/**
 * Attendee autocomplete component
 * 
 * Provides auto-suggestion functionality for attendee names during redemption.
 * Shows available attendees as user types and handles selection.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAttendees, type AttendeeForSuggestion } from '../hooks/useAttendees';

interface AttendeeAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAttendeeSelect: (attendee: AttendeeForSuggestion | null) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  projectId?: string;
}

export function AttendeeAutocomplete({
  value,
  onChange,
  onAttendeeSelect,
  error,
  disabled = false,
  placeholder = "Start typing attendee name...",
  projectId,
}: AttendeeAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { getNameSuggestions, findAttendeeByName, isLoading } = useAttendees(projectId);
  const suggestions = getNameSuggestions(value);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Check if exact match exists
    const exactMatch = findAttendeeByName(newValue);
    onAttendeeSelect(exactMatch);
    
    // Show suggestions if typing
    setIsOpen(newValue.length >= 2);
    setFocusedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0) {
          handleSuggestionSelect(suggestions[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (attendee: AttendeeForSuggestion) => {
    onChange(attendee.name);
    onAttendeeSelect(attendee);
    setIsOpen(false);
    setFocusedIndex(-1);
    inputRef.current?.blur();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        listRef.current && 
        !listRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <Label htmlFor="attendee-name">Attendee Name</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="attendee-name"
          type="text"
          autoComplete="off" // Per UI rules - no autocomplete for name field
          placeholder={isLoading ? "Loading attendees..." : placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length >= 2 && setIsOpen(true)}
          disabled={disabled || isLoading}
          className={error ? 'border-red-500' : ''}
        />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 mt-1 w-full rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {suggestions.map((attendee, index) => (
            <li
              key={attendee.id}
              role="option"
              aria-selected={index === focusedIndex}
              className={`px-4 py-2 cursor-pointer text-sm ${
                index === focusedIndex
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
              onClick={() => handleSuggestionSelect(attendee)}
            >
              <div className="font-medium">{attendee.name}</div>
            </li>
          ))}
        </ul>
      )}

      {/* No results message */}
      {isOpen && value.length >= 2 && suggestions.length === 0 && !isLoading && (
        <div className="absolute z-50 mt-1 w-full rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
            No attendees found matching "{value}"
          </div>
        </div>
      )}
    </div>
  );
}
