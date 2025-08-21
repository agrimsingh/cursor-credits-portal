'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ProjectSummary } from '@/features/projects/model';

interface CreateProjectForm {
  name: string;
  description: string;
  eventDate: string;
  slug: string;
}

interface DeleteConfirmation {
  projectId: string;
  projectName: string;
  totalDocuments: number;
  totalCodes: number;
  totalAttendees: number;
  totalRedemptions: number;
}

/**
 * Project selection/management page shown after admin authentication.
 * Allows creating new projects or selecting existing ones.
 */
export default function AdminProjects() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [createForm, setCreateForm] = useState<CreateProjectForm>({
    name: '',
    description: '',
    eventDate: '',
    slug: ''
  });
  
  // Deletion state
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  const router = useRouter();

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/projects');
      const result = await response.json();

      if (result.success) {
        setProjects(result.data.projects);
      } else {
        setError('Failed to load projects');
      }
    } catch (err) {
      setError('Failed to load projects');
      console.error('Project loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProject = (project: ProjectSummary) => {
    // Store selected project in localStorage
    localStorage.setItem('admin_selected_project', JSON.stringify({
      id: project.id,
      name: project.name,
      slug: project.slug
    }));

    // Navigate to dashboard
    router.push('/admin/dashboard');
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string) => {
    setCreateForm(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name) // Auto-generate only if slug is empty
    }));
  };

  const handleCreateProject = async () => {
    setIsCreating(true);
    setError('');

    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createForm.name.trim(),
          description: createForm.description.trim(),
          eventDate: createForm.eventDate || null,
          slug: createForm.slug.trim(),
          status: 'active'
        })
      });

      const result = await response.json();

      if (result.success) {
        // Select the newly created project immediately
        localStorage.setItem('admin_selected_project', JSON.stringify({
          id: result.data.id,
          name: result.data.name,
          slug: result.data.slug
        }));

        router.push('/admin/dashboard');
      } else {
        setError(result.error || 'Failed to create project');
      }
    } catch (err) {
      setError('Failed to create project');
      console.error('Project creation error:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (project: ProjectSummary) => {
    // Prepare deletion confirmation with data preview
    setDeleteConfirmation({
      projectId: project.id,
      projectName: project.name,
      totalDocuments: project.totalCodes + project.totalAttendees + project.totalRedemptions + 1,
      totalCodes: project.totalCodes,
      totalAttendees: project.totalAttendees,
      totalRedemptions: project.totalRedemptions,
    });
    setDeleteConfirmText('');
    setError('');
  };

  const confirmDeletion = async () => {
    if (!deleteConfirmation) return;
    
    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/projects/${deleteConfirmation.projectId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        // Remove from local state
        setProjects(prev => prev.filter(p => p.id !== deleteConfirmation.projectId));
        
        // Clear any selection if this was the selected project
        const selectedProject = localStorage.getItem('admin_selected_project');
        if (selectedProject) {
          const parsed = JSON.parse(selectedProject);
          if (parsed.id === deleteConfirmation.projectId) {
            localStorage.removeItem('admin_selected_project');
          }
        }
        
        // Close confirmation dialog
        setDeleteConfirmation(null);
        setDeleteConfirmText('');
      } else {
        setError(result.error || 'Failed to delete project');
      }
    } catch (err) {
      setError('Failed to delete project');
      console.error('Project deletion error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeletion = () => {
    setDeleteConfirmation(null);
    setDeleteConfirmText('');
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_selected_project');
    router.push('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Select Project</h1>
            <p className="text-gray-600">Choose a hackathon or event to manage, or create a new one.</p>
          </div>
          <Button variant="outline" onClick={handleLogout} size="sm">
            Logout
          </Button>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          {/* Create New Project Card */}
          <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
            <CardContent className="p-6">
              {!showCreateForm ? (
                <div className="text-center">
                  <div className="rounded-full bg-gray-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Project</h3>
                  <p className="text-gray-500 mb-4">Start a new hackathon or event project</p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    Create Project
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">New Project</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setShowCreateForm(false);
                        setCreateForm({ name: '', description: '', eventDate: '', slug: '' });
                        setError('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="project-name">Project Name *</Label>
                      <Input
                        id="project-name"
                        value={createForm.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Hackathon NYC December 2024"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="project-slug">URL Slug *</Label>
                      <Input
                        id="project-slug"
                        value={createForm.slug}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="hackathon-nyc-dec-2024"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Used in URLs. Only lowercase letters, numbers, and hyphens allowed.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="project-description">Description</Label>
                      <Input
                        id="project-description"
                        value={createForm.description}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of the event"
                      />
                    </div>

                    <div>
                      <Label htmlFor="project-date">Event Date</Label>
                      <Input
                        id="project-date"
                        type="date"
                        value={createForm.eventDate}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, eventDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleCreateProject}
                      disabled={isCreating || !createForm.name.trim() || !createForm.slug.trim()}
                      className="flex-1"
                    >
                      {isCreating ? 'Creating...' : 'Create & Select Project'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Existing Projects */}
          {projects.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Existing Projects</h2>
              <div className="grid gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 cursor-pointer" onClick={() => handleSelectProject(project)}>
                          <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                          {project.description && (
                            <p className="text-gray-600 mt-1">{project.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <span>{project.totalCodes} codes</span>
                            <span>{project.totalAttendees} attendees</span>
                            <span>{project.totalRedemptions} redeemed</span>
                            {project.eventDate && (
                              <span>• {new Date(project.eventDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : project.status === 'archived'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.status}
                          </span>
                          
                          {/* Delete button - only show for non-active projects or if they have no data */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Delete Project</CardTitle>
              <CardDescription>
                This action cannot be undone. All project data will be permanently deleted.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">Project: {deleteConfirmation.projectName}</h4>
                <div className="text-sm text-red-700 space-y-1">
                  <p>• {deleteConfirmation.totalCodes} cursor credit codes</p>
                  <p>• {deleteConfirmation.totalAttendees} registered attendees</p>
                  <p>• {deleteConfirmation.totalRedemptions} completed redemptions</p>
                  <p className="font-medium pt-1 border-t border-red-200">
                    Total: {deleteConfirmation.totalDocuments} documents will be deleted
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="confirm-delete" className="text-sm font-medium text-gray-700">
                  Type <strong>DELETE</strong> to confirm:
                </Label>
                <Input
                  id="confirm-delete"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="mt-1"
                  autoComplete="off"
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={cancelDeletion}
                  disabled={isDeleting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDeletion}
                  disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Project'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
