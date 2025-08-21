/**
 * Landing page for Cursor Credits Distribution
 * 
 * This is the main entry point where attendees start their code redemption journey.
 * Provides a clear introduction and navigation to the redemption flow.
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <main className="max-w-2xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Claim Your Cursor Credits
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Thank you for attending our event! Enter your details below to claim your complimentary Cursor credits.
            </p>
          </div>

          {/* Event Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Sample Hackathon Event
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Hamburg • August 20, 2025
            </p>
            
            {/* CTA Button */}
            <a 
              href="/redeem"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center"
            >
              Start Code Redemption
            </a>
          </div>

          {/* Info Section */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">
              Each attendee can claim one code. You&apos;ll need your name and email address.
            </p>
            <p>
              Having trouble? Contact the event organizers for assistance.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
