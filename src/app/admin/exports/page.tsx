'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Admin page for exporting various data reports
 */
export default function AdminExports() {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [exportResult, setExportResult] = useState<{
    type: string;
    success: boolean;
    message: string;
  } | null>(null);

  const handleExport = async (exportType: string) => {
    setIsExporting(exportType);
    setExportResult(null);

    try {
      const response = await fetch(`/api/admin/export?type=${exportType}`);
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      // Get filename from Content-Disposition header or create default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${exportType}-${new Date().toISOString().split('T')[0]}.csv`;
      
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="(.+)"/);
        if (matches) filename = matches[1];
      }

      // Download the file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      setExportResult({
        type: exportType,
        success: true,
        message: `Successfully exported ${exportType} data`
      });
    } catch (error) {
      setExportResult({
        type: exportType,
        success: false,
        message: `Failed to export ${exportType}: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsExporting(null);
    }
  };

  const exports = [
    {
      id: 'redemptions',
      title: 'Redemption Logs',
      description: 'Complete log of all code redemptions with timestamps',
      icon: '📋'
    },
    {
      id: 'codes',
      title: 'All Codes',
      description: 'All codes with usage status and redemption details',
      icon: '🔗'
    },
    {
      id: 'attendees',
      title: 'Attendees List',
      description: 'All registered attendees with redemption status',
      icon: '👥'
    },
    {
      id: 'summary',
      title: 'Event Summary',
      description: 'High-level statistics and performance metrics',
      icon: '📊'
    },
    {
      id: 'unused-codes',
      title: 'Unused Codes',
      description: 'Only codes that haven\'t been redeemed yet',
      icon: '🔓'
    },
    {
      id: 'audit-trail',
      title: 'Full Audit Trail',
      description: 'Complete event audit with all actions and timestamps',
      icon: '🔍'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Data Exports</h1>
        <div className="text-sm text-gray-600">
          All exports are in CSV format
        </div>
      </div>

      {/* Export Results */}
      {exportResult && (
        <Card className={exportResult.success ? 'border-green-200' : 'border-red-200'}>
          <CardContent className="pt-6">
            <div className={`text-sm ${exportResult.success ? 'text-green-700' : 'text-red-700'}`}>
              {exportResult.success ? '✅' : '❌'} {exportResult.message}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exports.map((exportOption) => (
          <Card key={exportOption.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">{exportOption.icon}</span>
                <span>{exportOption.title}</span>
              </CardTitle>
              <CardDescription>
                {exportOption.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleExport(exportOption.id)}
                disabled={isExporting !== null}
                className="w-full"
              >
                {isExporting === exportOption.id ? (
                  <span className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Exporting...</span>
                  </span>
                ) : (
                  'Download CSV'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Export Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Export Guidelines</CardTitle>
          <CardDescription>
            Important information about exported data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900">Data Privacy:</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Exports contain personal information (names, emails)</li>
              <li>Handle exported files securely</li>
              <li>Delete exports after use when possible</li>
              <li>Redemption logs include full audit trails</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900">File Formats:</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>All exports are UTF-8 encoded CSV files</li>
              <li>Headers included in all exports</li>
              <li>Timestamps in ISO 8601 format</li>
              <li>Compatible with Excel, Google Sheets, etc.</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900">Recommended Usage:</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Redemptions:</strong> Track event success and engagement</li>
              <li><strong>Unused Codes:</strong> Carry forward to future events</li>
              <li><strong>Attendees:</strong> Follow up with non-redeemers</li>
              <li><strong>Summary:</strong> Event reporting and analytics</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
