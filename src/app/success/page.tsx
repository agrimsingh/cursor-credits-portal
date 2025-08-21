/**
 * Success page showing the redeemed code
 * 
 * Displays the claimed code with copy-to-clipboard functionality
 * and confirmation details.
 */

import { Suspense } from 'react';
import { SuccessContent } from './SuccessContent';

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
