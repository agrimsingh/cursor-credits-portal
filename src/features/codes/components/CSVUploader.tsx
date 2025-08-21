/**
 * CSV file uploader component
 * 
 * Handles uploading and processing both codes and attendees CSV files.
 * Provides preview and validation before processing.
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { parseCodesCSV, parseAttendeesCSV } from '@/lib/csv-parser';

type CSVType = 'codes' | 'attendees';

interface ParsedData {
  type: CSVType;
  count: number;
  preview: Array<Record<string, string>>;
  file: File;
}

export function CSVUploader() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: CSVType) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setParsedData(null);

    try {
      const text = await file.text();
      
      if (type === 'codes') {
        const codes = parseCodesCSV(text);
        setParsedData({
          type: 'codes',
          count: codes.length,
          preview: codes.slice(0, 3),
          file,
        });
      } else {
        const attendees = parseAttendeesCSV(text);
        setParsedData({
          type: 'attendees',
          count: attendees.length,
          preview: attendees.slice(0, 3),
          file,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessData = async () => {
    if (!parsedData) return;

    setIsProcessing(true);
    try {
      // TODO: Implement actual Firebase upload and processing
      console.log(`Processing ${parsedData.count} ${parsedData.type}...`);
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Successfully processed ${parsedData.count} ${parsedData.type}!`);
      setParsedData(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process data');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Codes Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Upload Codes CSV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="codes-file">Codes File (cursor.com URLs)</Label>
              <Input
                id="codes-file"
                type="file"
                accept=".csv"
                onChange={(e) => handleFileUpload(e, 'codes')}
                disabled={isProcessing}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Expected format: https://cursor.com/referral?code=ABC123,Creator,Date,Role
            </p>
          </CardContent>
        </Card>

        {/* Attendees Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Upload Attendees CSV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="attendees-file">Attendees File (Luma export)</Label>
              <Input
                id="attendees-file"
                type="file"
                accept=".csv"
                onChange={(e) => handleFileUpload(e, 'attendees')}
                disabled={isProcessing}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Luma export with name, email, approval_status columns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Section */}
      {parsedData && (
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle className="w-5 h-5" />
              Preview: {parsedData.count} {parsedData.type} found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preview Data */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-2">Sample {parsedData.type}:</h4>
              <div className="space-y-2 text-sm font-mono">
                {parsedData.preview.map((item, index) => (
                  <div key={index} className="text-gray-600 dark:text-gray-300">
                    {parsedData.type === 'codes' 
                      ? `${index + 1}. ${item.code} → ${item.cursorUrl}`
                      : `${index + 1}. ${item.name} (${item.email})`
                    }
                  </div>
                ))}
                {parsedData.count > 3 && (
                  <div className="text-gray-500">
                    ... and {parsedData.count - 3} more
                  </div>
                )}
              </div>
            </div>

            {/* Process Button */}
            <div className="flex gap-2">
              <Button 
                onClick={handleProcessData}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Process {parsedData.count} {parsedData.type}
                  </>
                )}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setParsedData(null)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            CSV Upload Instructions
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p><strong>Codes CSV:</strong> Export from your cursor.com referral system</p>
            <p><strong>Attendees CSV:</strong> Export from Luma event management</p>
            <p><strong>Processing:</strong> Only approved attendees will be imported</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
