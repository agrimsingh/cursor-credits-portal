'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Admin page for uploading CSV files (codes and attendees)
 */
export default function AdminUploads() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{
    type: 'codes' | 'attendees';
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const handleFileUpload = async (file: File, type: 'codes' | 'attendees') => {
    setIsUploading(true);
    setUploadResults(null);

    try {
      // Get selected project from localStorage
      const selectedProjectData = localStorage.getItem('admin_selected_project');
      if (!selectedProjectData) {
        setUploadResults({
          type,
          success: false,
          message: 'No project selected. Please select a project first.'
        });
        setIsUploading(false);
        return;
      }

      const selectedProject = JSON.parse(selectedProjectData);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('projectId', selectedProject.id);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      setUploadResults({
        type,
        success: result.success,
        message: result.message,
        details: result.details
      });
    } catch (error) {
      setUploadResults({
        type,
        success: false,
        message: 'Upload failed. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Upload Data</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Codes Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Codes</CardTitle>
            <CardDescription>
              Upload a CSV file containing Cursor credit codes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileUploadZone
                accept=".csv"
                onFileSelect={(file) => handleFileUpload(file, 'codes')}
                disabled={isUploading}
                title="Drop codes CSV here"
                description="Expected format: url column with cursor.com links"
              />
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong>Expected CSV format:</strong></p>
              <p>• Header row with 'url' column</p>
              <p>• Each row: cursor.com redemption link</p>
              <p>• Example: https://cursor.com/redeem/abc123...</p>
            </div>
          </CardContent>
        </Card>

        {/* Attendees Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Attendees</CardTitle>
            <CardDescription>
              Upload a CSV file containing event attendee information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileUploadZone
                accept=".csv"
                onFileSelect={(file) => handleFileUpload(file, 'attendees')}
                disabled={isUploading}
                title="Drop attendees CSV here"
                description="Expected format: name, email columns"
              />
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong>Expected CSV format:</strong></p>
              <p>• Header row with 'name' and 'email' columns</p>
              <p>• Each row: attendee name and email address</p>
              <p>• Example: John Doe, john@example.com</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Results */}
      {uploadResults && (
        <Card className={uploadResults.success ? 'border-green-200' : 'border-red-200'}>
          <CardHeader>
            <CardTitle className={uploadResults.success ? 'text-green-700' : 'text-red-700'}>
              {uploadResults.success ? '✅ Upload Successful' : '❌ Upload Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{uploadResults.message}</p>
            {uploadResults.details && (
              <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(uploadResults.details, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>CSV Format Guidelines</CardTitle>
          <CardDescription>
            Important notes for preparing your CSV files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900">Codes CSV:</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Must have 'url' column header</li>
              <li>Each URL should be a complete cursor.com redemption link</li>
              <li>Duplicate codes will be skipped</li>
              <li>Invalid URLs will be reported</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900">Attendees CSV:</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Must have 'name' and 'email' columns</li>
              <li>Email addresses will be validated</li>
              <li>Duplicate entries will be skipped</li>
              <li>Names are case-sensitive for redemption matching</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Reusable file upload zone component with drag-and-drop
 */
function FileUploadZone({
  accept,
  onFileSelect,
  disabled,
  title,
  description
}: {
  accept: string;
  onFileSelect: (file: File) => void;
  disabled: boolean;
  title: string;
  description: string;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.name.endsWith('.csv'));
    
    if (csvFile) {
      onFileSelect(csvFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // Reset input
    e.target.value = '';
  };

  return (
    <div
      className={`transition-colors ${
        isDragOver ? 'border-blue-400 bg-blue-50' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        disabled={disabled}
        className="hidden"
        id={`file-input-${title}`}
      />
      
      <label 
        htmlFor={`file-input-${title}`} 
        className="block cursor-pointer"
      >
        <div className="text-center">
          <div className="text-3xl mb-2">📁</div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <p className="text-xs text-gray-500 mt-2">
            {disabled ? 'Uploading...' : 'Click to browse or drag and drop'}
          </p>
        </div>
      </label>
    </div>
  );
}
