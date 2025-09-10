import React, { useState, useEffect } from 'react';
import { Database, Eye, EyeOff, CheckCircle, AlertCircle, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { usePersistentState } from '@/hooks/usePersistentState';

interface PostgreSQLConnectionProps {
  onClose: () => void;
  onConnectionComplete: (connectionData: any) => void;
}

interface PostgreSQLFormData {
  connectionName: string;
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  useSSL: boolean;
}

export const PostgreSQLConnection: React.FC<PostgreSQLConnectionProps> = ({
  onClose,
  onConnectionComplete
}) => {
  // Generate a unique connection ID for this session
  const connectionId = `postgresql-${Date.now()}`;
  
  // Use persistent state for form data
  const [formData, setFormData] = usePersistentState<PostgreSQLFormData>({
    key: `postgresql-form-${connectionId}`,
    defaultValue: {
      connectionName: '',
      host: 'localhost',
      port: '5432',
      database: '',
      username: '',
      password: '',
      useSSL: false
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  
  const [testResult, setTestResult] = usePersistentState<{ success: boolean; message: string } | null>({
    key: `postgresql-test-${connectionId}`,
    defaultValue: null
  });
  
  const [isTesting, setIsTesting] = usePersistentState<boolean>({
    key: `postgresql-testing-${connectionId}`,
    defaultValue: false
  });
  
  const [isConnecting, setIsConnecting] = usePersistentState<boolean>({
    key: `postgresql-connecting-${connectionId}`,
    defaultValue: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cleanup function to clear persistent state
  const clearPersistentState = () => {
    localStorage.removeItem(`postgresql-form-${connectionId}`);
    localStorage.removeItem(`postgresql-test-${connectionId}`);
    localStorage.removeItem(`postgresql-testing-${connectionId}`);
    localStorage.removeItem(`postgresql-connecting-${connectionId}`);
  };

  // Clear state when component unmounts or connection is completed
  useEffect(() => {
    return () => {
      // Only clear if not testing or connecting (to preserve state during operations)
      if (!isTesting && !isConnecting) {
        clearPersistentState();
      }
    };
  }, [isTesting, isConnecting, connectionId]);

  // Helper functions to update form data
  const updateFormData = (field: keyof PostgreSQLFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTestConnection = async () => {
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.host.trim()) newErrors.host = 'Host is required';
    if (!formData.port.trim()) newErrors.port = 'Port is required';
    if (!formData.database.trim()) newErrors.database = 'Database name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    // Simulate connection test
    setTimeout(() => {
      setIsTesting(false);
      // Simulate success for demo purposes
      setTestResult({
        success: true,
        message: 'Connection successful! Found 12 tables in the database.'
      });
    }, 2000);
  };

  const handleSubmit = async () => {
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.connectionName.trim()) newErrors.name = 'Connection name is required';
    if (!formData.host.trim()) newErrors.host = 'Host is required';
    if (!formData.port.trim()) newErrors.port = 'Port is required';
    if (!formData.database.trim()) newErrors.database = 'Database name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsConnecting(true);

    // Simulate connection
    setTimeout(() => {
      setIsConnecting(false);
      
      const connectionData = {
        id: `postgresql-${Date.now()}`,
        name: formData.connectionName,
        type: 'postgresql',
        source: 'PostgreSQL Database',
        host: formData.host,
        port: formData.port,
        database: formData.database,
        username: formData.username,
        ssl: formData.useSSL,
        tables: [
          { name: 'users', type: 'table', rows: 1250 },
          { name: 'orders', type: 'table', rows: 3420 },
          { name: 'products', type: 'table', rows: 890 },
          { name: 'categories', type: 'table', rows: 45 },
          { name: 'payments', type: 'table', rows: 5670 },
          { name: 'inventory', type: 'table', rows: 2340 },
          { name: 'customers', type: 'table', rows: 1890 },
          { name: 'suppliers', type: 'table', rows: 120 },
          { name: 'transactions', type: 'table', rows: 8900 },
          { name: 'logs', type: 'table', rows: 15600 },
          { name: 'settings', type: 'table', rows: 15 },
          { name: 'reports', type: 'table', rows: 340 }
        ],
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
            <Database className="h-5 w-5 text-primary" />
            Connect PostgreSQL Database
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connection Name */}
          <div className="space-y-2">
            <Label htmlFor="connectionName">Connection Name *</Label>
            <Input
              id="connectionName"
              value={formData.connectionName}
              onChange={(e) => updateFormData('connectionName', e.target.value)}
              placeholder="Enter connection name"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Host and Port */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host">Host *</Label>
              <Input
                id="host"
              value={formData.host}
              onChange={(e) => updateFormData('host', e.target.value)}
                placeholder="localhost"
                className={errors.host ? "border-destructive" : ""}
              />
              {errors.host && (
                <p className="text-sm text-destructive">{errors.host}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port *</Label>
              <Input
                id="port"
              value={formData.port}
              onChange={(e) => updateFormData('port', e.target.value)}
                placeholder="5432"
                className={errors.port ? "border-destructive" : ""}
              />
              {errors.port && (
                <p className="text-sm text-destructive">{errors.port}</p>
              )}
            </div>
          </div>

          {/* Database */}
          <div className="space-y-2">
            <Label htmlFor="database">Database Name *</Label>
            <Input
              id="database"
              value={formData.database}
              onChange={(e) => updateFormData('database', e.target.value)}
              placeholder="Enter database name"
              className={errors.database ? "border-destructive" : ""}
            />
            {errors.database && (
              <p className="text-sm text-destructive">{errors.database}</p>
            )}
          </div>

          {/* Username and Password */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
              value={formData.username}
              onChange={(e) => updateFormData('username', e.target.value)}
                placeholder="Enter username"
                className={errors.username ? "border-destructive" : ""}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
                  placeholder="Enter password"
                  className={errors.password ? "border-destructive" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
          </div>

          {/* SSL */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ssl">Use SSL</Label>
              <p className="text-sm text-muted-foreground">
                Enable SSL connection for enhanced security
              </p>
            </div>
            <Switch
              id="ssl"
              checked={formData.useSSL}
              onCheckedChange={(checked) => updateFormData('useSSL', checked)}
            />
          </div>

          {/* Test Connection */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="w-full"
            >
              {isTesting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Testing Connection...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>

            {testResult && (
              <div className={`p-3 rounded-lg flex items-center gap-2 ${
                testResult.success 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span className="text-sm">{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => { clearPersistentState(); onClose(); }} disabled={isConnecting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isConnecting || !formData.connectionName.trim() || !formData.host.trim() || !formData.database.trim() || !formData.username.trim() || !formData.password.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Connect Database
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
