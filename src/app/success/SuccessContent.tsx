/**
 * Success page content component
 * 
 * Separated from page.tsx to handle useSearchParams properly with Suspense.
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, ExternalLink } from 'lucide-react';

export function SuccessContent() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  
  // Get data from URL params (in production, this would come from secure state)
  const cursorUrl = searchParams.get('cursorUrl') || 'https://cursor.com/referral?code=SAMPLE-CODE';
  const name = searchParams.get('name') || 'Attendee';
  
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(cursorUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Success!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Your Cursor credits have been claimed, {name}
            </p>
          </div>

          {/* Main Action */}
          <Card className="mb-6">
            <CardContent className="pt-8 pb-8">
              {/* Primary CTA */}
              <Button 
                onClick={() => window.open(cursorUrl, '_blank')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 text-xl mb-4"
              >
                <ExternalLink className="w-6 h-6 mr-3" />
                Claim Your Cursor Credits
              </Button>

              {/* Subtle secondary action */}
              <div className="text-center">
                <Button 
                  onClick={handleCopyUrl}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Link copied to clipboard
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy link to share
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-600 dark:text-gray-300">
                <p className="text-sm mb-2">
                  Click the button above to instantly claim your credits.
                </p>
                <p className="text-sm">
                  You&apos;ll be taken directly to Cursor where your credits will be automatically applied.
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Need help? Contact the event organizers
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
