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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-md mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto"></div>
              <p className="mt-4 text-sm text-muted-foreground">Loading event...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-md mx-auto">
            <div className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight mb-3">Event Not Found</h1>
              <p className="text-muted-foreground mb-6">
                {error || 'The event you\'re looking for is not available for code redemption.'}
              </p>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/" className="text-foreground hover:text-muted-foreground underline underline-offset-4">
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold tracking-tight mb-3">
              Claim Your Code
            </h1>
            <p className="text-muted-foreground text-lg">
              {project.name}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your details to receive your Cursor credits
            </p>
          </div>
          <RedemptionForm projectId={project.id} />
        </div>
      </div>
    </div>
  );
}
