'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { RedemptionForm } from '@/features/attendees/components/RedemptionForm';

/**
 * Project-specific redemption page
 * URL: /event/{project-slug}/redeem
 */
export default function ProjectRedeemPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<{id: string; name: string; slug: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjectBySlug();
  }, [slug]);

  const fetchProjectBySlug = async () => {
    try {
      const response = await fetch(`/api/public/projects/${slug}`);
      if (!response.ok) {
        throw new Error('Project not found');
      }
      
      const result = await response.json();
      setProject(result.data);
      setError('');
    } catch (err) {
      setError('Event not found or not available for redemption');
      console.error('Project fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading event...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Event Not Found</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {error || 'The event you\'re looking for is not available for code redemption.'}
              </p>
              <a href="/" className="text-blue-600 hover:text-blue-800 underline">
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Claim Your Code
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {project.name}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Enter your details to receive your Cursor credits
            </p>
          </div>
          <RedemptionForm projectId={project.id} />
        </div>
      </div>
    </div>
  );
}
