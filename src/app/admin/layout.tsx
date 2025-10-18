'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

/**
 * Admin layout that enforces authentication and provides navigation.
 * Checks for admin_authenticated flag in localStorage.
 */
interface SelectedProject {
  id: string;
  name: string;
  slug: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedProject, setSelectedProject] = useState<SelectedProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = localStorage.getItem('admin_authenticated') === 'true';
      setIsAuthenticated(authenticated);

      // Check for selected project
      const projectData = localStorage.getItem('admin_selected_project');
      if (projectData) {
        try {
          setSelectedProject(JSON.parse(projectData));
        } catch {
          // Invalid project data, clear it
          localStorage.removeItem('admin_selected_project');
          setSelectedProject(null);
        }
      }

      setIsLoading(false);

      // Handle redirects based on auth state and project selection
      if (!authenticated && pathname !== '/admin') {
        router.push('/admin');
      } else if (authenticated && !projectData && pathname !== '/admin' && pathname !== '/admin/projects') {
        // Authenticated but no project selected - redirect to project selection
        router.push('/admin/projects');
      }
    };

    checkAuth();
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_selected_project');
    setIsAuthenticated(false);
    setSelectedProject(null);
    router.push('/admin');
  };

  const handleProjectSwitch = () => {
    router.push('/admin/projects');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page
  if (!isAuthenticated || pathname === '/admin') {
    return children;
  }

  // Show project selection page
  if (pathname === '/admin/projects') {
    return children;
  }

  // Require project selection for other admin pages
  if (!selectedProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-lg font-medium mb-2">No Project Selected</h2>
          <p className="text-muted-foreground mb-6">Please select a project to continue.</p>
          <Button onClick={handleProjectSwitch}>
            Select Project
          </Button>
        </div>
      </div>
    );
  }

  // Admin dashboard layout
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-medium">
                  Cursor Credits Admin
                </h1>
                {selectedProject && (
                  <p className="text-sm text-muted-foreground">
                    {selectedProject.name}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={handleProjectSwitch}
                size="sm"
              >
                Switch Project
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push(`/event/${selectedProject.slug}/redeem`)}
                size="sm"
              >
                View Public Site
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                size="sm"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <NavLink href="/admin/dashboard" isActive={pathname === '/admin/dashboard'}>
              Dashboard
            </NavLink>
            <NavLink href="/admin/codes" isActive={pathname === '/admin/codes'}>
              Codes
            </NavLink>
            <NavLink href="/admin/attendees" isActive={pathname === '/admin/attendees'}>
              Attendees
            </NavLink>
            <NavLink href="/admin/uploads" isActive={pathname === '/admin/uploads'}>
              Upload Data
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

/**
 * Navigation link component with active state styling
 */
function NavLink({ 
  href, 
  isActive, 
  children 
}: { 
  href: string; 
  isActive: boolean; 
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
        isActive
          ? 'border-foreground text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}
