/**
 * Redemption form component with two-step validation
 * 
 * Implements auto-suggestion from attendee list and validates name first,
 * then email to ensure attendee exists before redemption.
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AttendeeAutocomplete } from './AttendeeAutocomplete';
import { maskEmail } from '@/lib/utils';
import type { AttendeeForSuggestion } from '../hooks/useAttendees';
import type { AttendeeValidationResponse } from '../model';

type ValidationStep = 'name' | 'email' | 'ready';

interface RedemptionFormProps {
  projectId?: string; // Optional for backward compatibility
}

export function RedemptionForm({ projectId }: RedemptionFormProps = {}) {
  const [currentStep, setCurrentStep] = useState<ValidationStep>('name');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedAttendee, setSelectedAttendee] = useState<AttendeeForSuggestion | null>(null);
  const [expectedEmail, setExpectedEmail] = useState<string | null>(null);

  // Handle attendee selection from autocomplete
  const handleAttendeeSelect = (attendee: AttendeeForSuggestion | null) => {
    setSelectedAttendee(attendee);
    setError(null);
    
    if (attendee) {
      setCurrentStep('email');
      setExpectedEmail(attendee.email);
    } else {
      setCurrentStep('name');
      setExpectedEmail(null);
    }
  };

  // Validate name step
  const validateNameStep = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!selectedAttendee) {
      setError('Please select your name from the suggestions');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/attendees/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step: 'name',
          name: name.trim(),
          projectId: projectId,
          eventId: projectId ? undefined : 'sample-event-1', // Legacy fallback
        }),
      });

      const result = await response.json();
      const validationData = result.data as AttendeeValidationResponse;

      if (!result.success || !validationData.isValid) {
        throw new Error(validationData.error || 'Name validation failed');
      }

      if (validationData.hasAlreadyRedeemed) {
        throw new Error('You have already redeemed a code. Each attendee can only redeem one code.');
      }

      setExpectedEmail(validationData.expectedEmail || null);
      setCurrentStep('email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Validate email step
  const validateEmailStep = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (expectedEmail && email.toLowerCase().trim() !== expectedEmail.toLowerCase()) {
      setError('Email does not match the expected address. Please check and try again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/attendees/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step: 'email',
          name: name.trim(),
          email: email.toLowerCase().trim(),
          projectId: projectId,
          eventId: projectId ? undefined : 'sample-event-1', // Legacy fallback
        }),
      });

      const result = await response.json();
      const validationData = result.data as AttendeeValidationResponse;

      if (!result.success || !validationData.isValid) {
        throw new Error(validationData.error || 'Email validation failed');
      }

      if (validationData.hasAlreadyRedeemed) {
        throw new Error('You have already redeemed a code. Each attendee can only redeem one code.');
      }

      setCurrentStep('ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle final redemption
  const handleRedemption = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          projectId: projectId,
          eventId: projectId ? undefined : 'sample-event-1', // Legacy fallback
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to claim code');
      }

      // Redirect to success page
      const params = new URLSearchParams({
        cursorUrl: result.data.cursorUrl,
        name: result.data.name,
      });
      
      window.location.href = `/success?${params.toString()}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Redemption failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to name step
  const resetToNameStep = () => {
    setCurrentStep('name');
    setEmail('');
    setExpectedEmail(null);
    setError(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendee Information</CardTitle>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {currentStep === 'name' && 'Step 1: Enter your name'}
          {currentStep === 'email' && 'Step 2: Confirm your email'}
          {currentStep === 'ready' && 'Ready to claim your code'}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Step 1: Name Selection with Autocomplete */}
          <div className="space-y-2">
            <AttendeeAutocomplete
              value={name}
              onChange={setName}
              onAttendeeSelect={handleAttendeeSelect}
              error={currentStep === 'name' ? error : undefined}
              disabled={currentStep !== 'name' || isLoading}
              projectId={projectId}
            />
            
            {currentStep === 'name' && (
              <Button
                onClick={validateNameStep}
                disabled={!selectedAttendee || isLoading}
                className="w-full"
              >
                {isLoading ? 'Validating...' : 'Continue'}
              </Button>
            )}
          </div>

          {/* Step 2: Email Confirmation */}
          {(currentStep === 'email' || currentStep === 'ready') && (
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              {expectedEmail && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please enter the email that matches: <span className="font-mono font-medium">{maskEmail(expectedEmail)}</span>
                </p>
              )}
              <Input
                id="email"
                type="email"
                autoComplete="email" // Autocomplete allowed per UI rules
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={currentStep === 'ready' || isLoading}
                className={
                  currentStep === 'email' && error ? 'border-red-500' : ''
                }
              />
              
              <div className="flex space-x-2">
                <Button
                  onClick={resetToNameStep}
                  variant="outline"
                  disabled={isLoading}
                  className="flex-1"
                >
                  ← Back
                </Button>
                
                {currentStep === 'email' && (
                  <Button
                    onClick={validateEmailStep}
                    disabled={!email.trim() || isLoading}
                    className="flex-1"
                  >
                    {isLoading ? 'Validating...' : 'Verify Email'}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Final Redemption */}
          {currentStep === 'ready' && (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✓ Name and email verified. Ready to claim your Cursor code!
                </p>
              </div>
              
              <Button
                onClick={handleRedemption}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Claiming Code...' : 'Claim My Cursor Code'}
              </Button>
            </div>
          )}

          {/* Error Display */}
          {error && currentStep !== 'name' && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
