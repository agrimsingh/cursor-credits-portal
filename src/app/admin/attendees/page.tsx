'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Attendee {
  id: string;
  name: string;
  email: string;
  hasRedeemed: boolean;
  redeemedAt?: string;
  codeUrl?: string;
}

/**
 * Admin page for viewing and managing attendees
 */
export default function AdminAttendees() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'redeemed' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAttendees();
  }, []);

  // Filter attendees based on redemption status and search term
  useEffect(() => {
    let filtered = attendees;

    // Apply status filter
    if (filter === 'redeemed') {
      filtered = filtered.filter(attendee => attendee.hasRedeemed);
    } else if (filter === 'pending') {
      filtered = filtered.filter(attendee => !attendee.hasRedeemed);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(attendee => 
        attendee.name.toLowerCase().includes(term) ||
        attendee.email.toLowerCase().includes(term)
      );
    }

    setFilteredAttendees(filtered);
  }, [attendees, filter, searchTerm]);

  const fetchAttendees = async () => {
    try {
      // Get selected project from localStorage
      const selectedProjectData = localStorage.getItem('admin_selected_project');
      if (!selectedProjectData) {
        setError('No project selected');
        setIsLoading(false);
        return;
      }

      const selectedProject = JSON.parse(selectedProjectData);
      const response = await fetch(`/api/admin/attendees?projectId=${selectedProject.id}`);
      if (!response.ok) throw new Error('Failed to fetch attendees');
      
      const data = await response.json();
      setAttendees(data.attendees);
      setError('');
    } catch (err) {
      setError('Failed to load attendees');
      console.error('Attendees fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const exportAttendees = () => {
    const csvData = [
      ['Name', 'Email', 'Status', 'Redeemed At', 'Code URL'],
      ...filteredAttendees.map(attendee => [
        attendee.name,
        attendee.email,
        attendee.hasRedeemed ? 'Redeemed' : 'Pending',
        attendee.redeemedAt ? new Date(attendee.redeemedAt).toLocaleString() : '',
        attendee.codeUrl || ''
      ])
    ];

    const csvContent = csvData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendees-${filter}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchAttendees} />;
  }

  const redeemedCount = attendees.filter(a => a.hasRedeemed).length;
  const pendingCount = attendees.length - redeemedCount;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Attendee Management</h1>
        <Button onClick={exportAttendees}>
          Export {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)} Attendees
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{redeemedCount}</div>
            <p className="text-sm text-gray-600">Redeemed Credits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
            <p className="text-sm text-gray-600">Pending Redemption</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{attendees.length}</div>
            <p className="text-sm text-gray-600">Total Attendees</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({attendees.length})
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pending ({pendingCount})
            </Button>
            <Button
              variant={filter === 'redeemed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('redeemed')}
            >
              Redeemed ({redeemedCount})
            </Button>
          </div>
          
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      {/* Attendees List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Attendees ({filteredAttendees.length})
          </CardTitle>
          <CardDescription>
            {filter === 'all' && 'All registered attendees'}
            {filter === 'redeemed' && 'Attendees who have claimed their credits'}
            {filter === 'pending' && 'Attendees who haven\'t claimed their credits yet'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAttendees.length > 0 ? (
            <div className="space-y-3">
              {filteredAttendees.map((attendee) => (
                <div 
                  key={attendee.id} 
                  className={`p-4 rounded border ${
                    attendee.hasRedeemed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{attendee.name}</h3>
                      <p className="text-sm text-gray-600">{attendee.email}</p>
                      
                      {attendee.hasRedeemed && attendee.redeemedAt && (
                        <div className="mt-2 text-sm">
                          <p className="text-green-700">
                            ✅ Redeemed on {new Date(attendee.redeemedAt).toLocaleString()}
                          </p>
                          {attendee.codeUrl && (
                            <p className="text-gray-600 font-mono text-xs mt-1">
                              Code: {attendee.codeUrl.slice(-20)}...
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      attendee.hasRedeemed 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {attendee.hasRedeemed ? 'Redeemed' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No attendees match your search.' : 'No attendees found.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Attendee Management</h1>
      <div className="animate-pulse space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Attendee Management</h1>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <Button onClick={onRetry} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
