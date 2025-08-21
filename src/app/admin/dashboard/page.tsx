'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalCodes: number;
  usedCodes: number;
  totalAttendees: number;
  totalRedemptions: number;
  recentRedemptions: Array<{
    id: string;
    attendeeName: string;
    email: string;
    timestamp: string;
    codeUrl: string;
  }>;
}

/**
 * Main admin dashboard showing overview stats and recent activity
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
    
    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get selected project from localStorage
      const selectedProjectData = localStorage.getItem('admin_selected_project');
      if (!selectedProjectData) {
        setError('No project selected');
        setIsLoading(false);
        return;
      }

      const selectedProject = JSON.parse(selectedProjectData);
      const response = await fetch(`/api/admin/dashboard?projectId=${selectedProject.id}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      setStats(data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>{error}</p>
              <Button onClick={fetchDashboardData} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/uploads')}
          >
            Upload Data
          </Button>
          <Button onClick={fetchDashboardData}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Codes"
          value={stats?.totalCodes || 0}
          description="Available for redemption"
        />
        <StatsCard
          title="Total Attendees"
          value={stats?.totalAttendees || 0}
          description="Registered for event"
        />
        <StatsCard
          title="Redemptions"
          value={stats?.totalRedemptions || 0}
          description={`${stats?.totalRedemptions || 0} of ${stats?.totalCodes || 0} codes redeemed`}
          progress={stats?.totalCodes ? ((stats.totalRedemptions || 0) / stats.totalCodes) * 100 : 0}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Redemptions</CardTitle>
            <CardDescription>Latest code claims</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentRedemptions?.length ? (
              <div className="space-y-3">
                {stats.recentRedemptions.slice(0, 5).map((redemption) => (
                  <div key={redemption.id} className="flex justify-between items-start p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-sm">{redemption.attendeeName}</p>
                      <p className="text-xs text-gray-600">{redemption.email}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(redemption.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {redemption.codeUrl.slice(-8)}
                    </div>
                  </div>
                ))}
                
                {stats.recentRedemptions.length > 5 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => router.push('/admin/redemptions')}
                  >
                    View All Redemptions
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No redemptions yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => router.push('/admin/uploads')}
            >
              📁 Upload New Codes
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => router.push('/admin/uploads')}
            >
              👥 Upload Attendee List
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => router.push('/admin/codes')}
            >
              📊 View All Codes
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => window.open('/', '_blank')}
            >
              🔗 Test Redemption Flow
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Reusable stats card component
 */
function StatsCard({ 
  title, 
  value, 
  description, 
  progress 
}: { 
  title: string; 
  value: number; 
  description: string; 
  progress?: number;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</div>
        <p className="text-xs text-gray-600">{description}</p>
        {progress !== undefined && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
