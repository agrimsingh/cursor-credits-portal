/**
 * Code redemption page
 * 
 * This page handles the core redemption flow where attendees enter their
 * name and email to claim their Cursor credits.
 */

import { RedemptionForm } from '@/features/attendees/components/RedemptionForm';

export default function RedeemPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Claim Your Code
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Enter your details to receive your Cursor credits
            </p>
          </div>

          {/* Redemption Form */}
          <RedemptionForm />
        </div>
      </div>
    </div>
  );
}
