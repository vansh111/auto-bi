import React, { useState, useEffect } from 'react';
import { Upload, FileSpreadsheet, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePersistentState, usePersistentFileUpload } from '@/hooks/usePersistentState';

interface CSVExcelConnectionProps {
  onClose: () => void;
  onConnectionComplete: (connectionData: any) => void;
}

interface FileData {
  name: string;
  size: number;
  type: string;
  preview?: string;
}

interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  id: string;
}

export const CSVExcelConnection: React.FC<CSVExcelConnectionProps> = ({
  onClose,
  onConnectionComplete
}) => {
  // Generate a unique connection ID for this session
  const connectionId = `csv-excel-${Date.now()}`;
  
  // Use persistent state for form data
  const [connectionName, setConnectionName] = usePersistentState({
    key: `csv-excel-name-${connectionId}`,
    defaultValue: ''
  });
  
  const [uploadedFiles, setUploadedFiles] = usePersistentState({
    key: `csv-excel-files-${connectionId}`,
    defaultValue: [] as FileMetadata[]
  });
  
  const [isUploading, setIsUploading] = usePersistentState({
    key: `csv-excel-uploading-${connectionId}`,
    defaultValue: false
  });
  
  const [uploadProgress, setUploadProgress] = usePersistentState({
    key: `csv-excel-progress-${connectionId}`,
    defaultValue: 0
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Separate state for actual File objects (not persisted)
  const [actualFiles, setActualFiles] = useState<File[]>([]);
  const [showFileRecoveryMessage, setShowFileRecoveryMessage] = useState(false);

  // Cleanup function to clear persistent state
  const clearPersistentState = () => {
    localStorage.removeItem(`csv-excel-name-${connectionId}`);
    localStorage.removeItem(`csv-excel-files-${connectionId}`);
    localStorage.removeItem(`csv-excel-uploading-${connectionId}`);
    localStorage.removeItem(`csv-excel-progress-${connectionId}`);
  };

  // Clear state when component unmounts or connection is completed
  useEffect(() => {
    return () => {
      // Only clear if not uploading (to preserve state during upload)
      if (!isUploading) {
        clearPersistentState();
      }
    };
  }, [isUploading, connectionId]);

  // Check if files were restored from persistence but actual files are missing
  useEffect(() => {
    if (uploadedFiles.length > 0 && actualFiles.length === 0) {
      setShowFileRecoveryMessage(true);
    } else {
      setShowFileRecoveryMessage(false);
    }
  }, [uploadedFiles.length, actualFiles.length]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: FileMetadata[] = [];
    const newActualFiles: File[] = [];

    Array.from(files).forEach(file => {
      const fileMetadata: FileMetadata = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        id: `${file.name}-${file.lastModified}-${Date.now()}`
      };
      
      newFiles.push(fileMetadata);
      newActualFiles.push(file);
    });

    // Validate file types
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.oasis.opendocument.spreadsheet'
    ];

    const invalidFiles = newFiles.filter(file => 
      !validTypes.some(type => file.type.includes(type.split('/')[1]))
    );

    if (invalidFiles.length > 0) {
      setErrors({ files: 'Please upload only CSV or Excel files (.csv, .xlsx, .xls, .ods)' });
      return;
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setActualFiles(prev => [...prev, ...newActualFiles]);
    setErrors({});
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setActualFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearRestoredFiles = () => {
    setUploadedFiles([]);
    setShowFileRecoveryMessage(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('csv') || type.includes('text')) {
      return <FileText className="h-5 w-5 text-blue-600" />;
    }
    return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
  };

  const handleSubmit = async () => {
    // Validation
    const newErrors: Record<string, string> = {};
    if (!connectionName.trim()) {
      newErrors.name = 'Connection name is required';
    }
    if (actualFiles.length === 0) {
      newErrors.files = 'Please upload at least one file';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate upload completion
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(100);
      
      const connectionData = {
        id: `csv-excel-${Date.now()}`,
        name: connectionName,
        type: 'csv-excel',
        source: 'File Upload',
        files: actualFiles.length,
        tables: actualFiles.map(file => ({
          name: file.name.split('.')[0],
          type: file.type.includes('csv') ? 'CSV' : 'Excel',
          size: formatFileSize(file.size)
        })),
        status: 'connected',
        createdAt: new Date().toISOString()
      };

      onConnectionComplete(connectionData);
      clearPersistentState(); // Clear persistent state after successful connection
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Connect CSV/Excel Files
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connection Name */}
          <div className="space-y-2">
            <Label htmlFor="connectionName">Connection Name *</Label>
            <Input
              id="connectionName"
              value={connectionName}
              onChange={(e) => setConnectionName(e.target.value)}
              placeholder="Enter connection name"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* File Recovery Message */}
          {showFileRecoveryMessage && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-yellow-800">
                    Files Restored from Previous Session
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    We found {uploadedFiles.length} file(s) from your previous session, but the actual files are no longer available. 
                    Please re-upload your files to continue.
                  </p>
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearRestoredFiles}
                      className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                    >
                      Clear Restored Files
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Upload Files *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Drag and drop your CSV or Excel files here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: .csv, .xlsx, .xls, .ods
                </p>
                <Input
                  type="file"
                  multiple
                  accept=".csv,.xlsx,.xls,.ods"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Choose Files
                </Button>
              </div>
            </div>
            {errors.files && (
              <p className="text-sm text-destructive">{errors.files}</p>
            )}
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Uploaded Files ({uploadedFiles.length})</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {uploadedFiles.map((file, index) => {
                  const hasActualFile = index < actualFiles.length;
                  return (
                    <div key={file.id || index} className={`flex items-center justify-between p-3 rounded-lg ${
                      hasActualFile ? 'bg-muted' : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          {!hasActualFile && (
                            <p className="text-xs text-yellow-600">File needs to be re-uploaded</p>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => { clearPersistentState(); onClose(); }} disabled={isUploading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isUploading || actualFiles.length === 0 || !connectionName.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Connect Files
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
