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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-lg mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="mx-auto w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-8">
              <CheckCircle className="w-10 h-10 text-foreground" />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight mb-4">
              Success, {name}!
            </h1>
            <p className="text-lg text-muted-foreground">
              Your Cursor credits are ready to claim
            </p>
          </div>

          {/* Single Core CTA */}
          <Card className="mb-12 border-border bg-card">
            <CardContent className="pt-10 pb-10 text-center">
              <Button 
                onClick={() => window.open(cursorUrl, '_blank')}
                className="w-full h-16 text-lg font-medium"
                size="lg"
              >
                <ExternalLink className="w-5 h-5 mr-3" />
                Claim Your Credits Now
              </Button>
              
              <p className="text-muted-foreground text-sm mt-6">
                Click above to open Cursor and automatically apply your credits
              </p>
            </CardContent>
          </Card>

          {/* Simple Help */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact the event organizers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
