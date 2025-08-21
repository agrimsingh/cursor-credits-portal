'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

/**
 * Admin layout that enforces authentication and provides navigation.
 * Checks for admin_authenticated flag in localStorage.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = localStorage.getItem('admin_authenticated') === 'true';
      setIsAuthenticated(authenticated);
      setIsLoading(false);

      // Redirect to login if not authenticated and not on login page
      if (!authenticated && pathname !== '/admin') {
        router.push('/admin');
      }
    };

    checkAuth();
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    router.push('/admin');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page
  if (!isAuthenticated || pathname === '/admin') {
    return children;
  }

  // Admin dashboard layout
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Cursor Credits Admin
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
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
      <nav className="bg-white border-b border-gray-200">
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
            <NavLink href="/admin/exports" isActive={pathname === '/admin/exports'}>
              Exports
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  );
}
