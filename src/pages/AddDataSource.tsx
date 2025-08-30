import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Database, FileSpreadsheet, Plus, Eye, EyeOff, Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export default function AddDataSource() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const [activeTab, setActiveTab] = useState("postgresql");
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  // PostgreSQL form state
  const [postgresForm, setPostgresForm] = useState({
    name: "",
    host: "",
    port: "5432",
    database: "",
    username: "",
    password: "",
    description: ""
  });

  // Excel form state
  const [excelForm, setExcelForm] = useState({
    name: "",
    description: "",
    file: null as File | null
  });

  const handleBack = () => {
    navigate(`/workspace/${workspaceId}`);
  };

  const handlePostgresInputChange = (field: string, value: string) => {
    setPostgresForm(prev => ({ ...prev, [field]: value }));
  };

  const handleExcelInputChange = (field: string, value: string) => {
    setExcelForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setExcelForm(prev => ({ ...prev, file }));
    }
  };

  const testConnection = async () => {
    setConnectionStatus('testing');
    setIsConnecting(true);
    
    // Simulate connection test
    setTimeout(() => {
      setConnectionStatus('success');
      setIsConnecting(false);
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsConnecting(false);
      navigate(`/workspace/${workspaceId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Workspace
            </Button>
            <div className="h-6 w-px bg-border"></div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Add Data Source</h1>
              <p className="text-sm text-muted-foreground">Connect your data to the workspace</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="postgresql" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              PostgreSQL
            </TabsTrigger>
            <TabsTrigger value="excel" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Excel File
            </TabsTrigger>
          </TabsList>

          {/* PostgreSQL Tab */}
          <TabsContent value="postgresql" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  PostgreSQL Connection
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Connect to your PostgreSQL database to import data into your workspace.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Data Source Name *</Label>
                        <Input
                          id="name"
                          value={postgresForm.name}
                          onChange={(e) => handlePostgresInputChange('name', e.target.value)}
                          placeholder="Enter a name for this data source"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          value={postgresForm.description}
                          onChange={(e) => handlePostgresInputChange('description', e.target.value)}
                          placeholder="Brief description of this data source"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Connection Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Connection Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="host">Host *</Label>
                        <Input
                          id="host"
                          value={postgresForm.host}
                          onChange={(e) => handlePostgresInputChange('host', e.target.value)}
                          placeholder="localhost"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="port">Port *</Label>
                        <Input
                          id="port"
                          value={postgresForm.port}
                          onChange={(e) => handlePostgresInputChange('port', e.target.value)}
                          placeholder="5432"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="database">Database Name *</Label>
                        <Input
                          id="database"
                          value={postgresForm.database}
                          onChange={(e) => handlePostgresInputChange('database', e.target.value)}
                          placeholder="your_database"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username *</Label>
                        <Input
                          id="username"
                          value={postgresForm.username}
                          onChange={(e) => handlePostgresInputChange('username', e.target.value)}
                          placeholder="your_username"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={postgresForm.password}
                            onChange={(e) => handlePostgresInputChange('password', e.target.value)}
                            placeholder="your_password"
                            required
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
                      </div>
                    </div>
                  </div>

                  {/* Connection Test */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Test Connection</h3>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={testConnection}
                        disabled={isConnecting || !postgresForm.host || !postgresForm.database}
                      >
                        {isConnecting ? "Testing..." : "Test Connection"}
                      </Button>
                    </div>
                    
                    {connectionStatus === 'success' && (
                      <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="text-success font-medium">Connection successful!</span>
                      </div>
                    )}
                    
                    {connectionStatus === 'error' && (
                      <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <span className="text-destructive font-medium">Connection failed. Please check your credentials.</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isConnecting || !postgresForm.name || !postgresForm.host}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isConnecting ? "Adding..." : "Add Data Source"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Excel Tab */}
          <TabsContent value="excel" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-success" />
                  Excel File Upload
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload an Excel file to import data into your workspace.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="excel-name">Data Source Name *</Label>
                        <Input
                          id="excel-name"
                          value={excelForm.name}
                          onChange={(e) => handleExcelInputChange('name', e.target.value)}
                          placeholder="Enter a name for this data source"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="excel-description">Description</Label>
                        <Input
                          id="excel-description"
                          value={excelForm.description}
                          onChange={(e) => handleExcelInputChange('description', e.target.value)}
                          placeholder="Brief description of this data source"
                        />
                      </div>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">File Upload</h3>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center">
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Upload Excel File</p>
                          <p className="text-xs text-muted-foreground">
                            Supported formats: .xlsx, .xls (Max size: 10MB)
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('file-upload')?.click()}
                            className="mt-4"
                          >
                            Choose File
                          </Button>
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                      
                      {excelForm.file && (
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <FileSpreadsheet className="h-5 w-5 text-success" />
                          <div className="flex-1">
                            <p className="font-medium">{excelForm.file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(excelForm.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Badge variant="outline">Ready</Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isConnecting || !excelForm.name || !excelForm.file}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isConnecting ? "Uploading..." : "Upload Data Source"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
