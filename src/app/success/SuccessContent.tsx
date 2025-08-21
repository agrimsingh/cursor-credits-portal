/**
 * Success page content component with single CTA focus
 * 
 * Simplified to have one core action: claim credits via direct URL click.
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink } from 'lucide-react';

export function SuccessContent() {
  const searchParams = useSearchParams();
  
  // Get data from URL params
  const cursorUrl = searchParams.get('cursorUrl') || 'https://cursor.com/referral?code=SAMPLE-CODE';
  const name = searchParams.get('name') || 'Attendee';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              🎉 Success, {name}!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Your Cursor credits are ready to claim
            </p>
          </div>

          {/* Single Core CTA */}
          <Card className="mb-8">
            <CardContent className="pt-10 pb-10 text-center">
              <Button 
                onClick={() => window.open(cursorUrl, '_blank')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-8 text-2xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <ExternalLink className="w-8 h-8 mr-4" />
                Claim Your Credits Now
              </Button>
              
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-6">
                Click above to open Cursor and automatically apply your credits
              </p>
            </CardContent>
          </Card>

          {/* Simple Help */}
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need help? Contact the event organizers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
