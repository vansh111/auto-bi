import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Users, Database, Globe, Key, CheckCircle, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock workspace data - in real app this would come from API
const mockWorkspace = {
  id: "kaurav-123",
  name: "Kaurav",
  organization: "D&AI",
  tags: ["test", "dummy"],
  description: "Some Desc, something",
  publishedDate: "Apr 10, 2025",
  lastModified: "May 19, 2025",
  stats: { dataSource: 11, domain: 2, user: 1, pendingApproval: 1 },
  isFavorite: true,
  isApproved: true,
  embeddingProvider: "OpenAI Embeddings",
  defaultLLMProvider: "OpenAI GPT-4",
  visibility: "private"
};

export default function WorkspaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("connection");
  const [connectionStatus, setConnectionStatus] = useState<'pending' | 'connected' | 'error'>('pending');

  const handleBack = () => {
    navigate("/");
  };

  const handleAddDataSource = () => {
    navigate(`/workspace/${id}/add-data-source`);
  };

  // Simulate connection check on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectionStatus('connected');
    }, 3000); // Change to connected after 3 seconds

    return () => clearTimeout(timer);
  }, []);

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
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-border"></div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{mockWorkspace.name}</h1>
              <p className="text-sm text-muted-foreground">{mockWorkspace.organization}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
              <CheckCircle className="h-3 w-3 mr-1" />
              Approved
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Workspace Overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Workspace Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{mockWorkspace.stats.dataSource}</div>
                  <div className="text-sm text-muted-foreground">Data Sources</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-success">{mockWorkspace.stats.domain}</div>
                  <div className="text-sm text-muted-foreground">Domains</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-warning">{mockWorkspace.stats.user}</div>
                  <div className="text-sm text-muted-foreground">Users</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-destructive">{mockWorkspace.stats.pendingApproval}</div>
                  <div className="text-sm text-muted-foreground">Pending Approval</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{mockWorkspace.description}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Configuration</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Embedding Provider:</span>
                        <span>{mockWorkspace.embeddingProvider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Default LLM:</span>
                        <span>{mockWorkspace.defaultLLMProvider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Visibility:</span>
                        <Badge variant={mockWorkspace.visibility === 'private' ? 'secondary' : 'outline'}>
                          {mockWorkspace.visibility === 'private' ? 'Private' : 'Public'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex flex-wrap gap-2">
                    {mockWorkspace.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="connection" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Connection
            </TabsTrigger>
            <TabsTrigger value="data-sources" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Sources
            </TabsTrigger>
            <TabsTrigger value="domains" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Domains
            </TabsTrigger>
            <TabsTrigger value="api-tokens" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Client API Tokens
            </TabsTrigger>
          </TabsList>

          {/* Connection Tab */}
          <TabsContent value="connection" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Connection Status
                  <Button size="sm" onClick={handleAddDataSource}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Data Source
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`flex items-center justify-between p-4 rounded-lg border ${
                    connectionStatus === 'connected' 
                      ? 'bg-success/10 border-success/20' 
                      : connectionStatus === 'error'
                      ? 'bg-destructive/10 border-destructive/20'
                      : 'bg-warning/10 border-warning/20'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        connectionStatus === 'connected' 
                          ? 'bg-success animate-pulse' 
                          : connectionStatus === 'error'
                          ? 'bg-destructive'
                          : 'bg-warning animate-pulse'
                      }`}></div>
                      <span className="font-medium">Database Connection</span>
                    </div>
                    <Badge variant="outline" className={
                      connectionStatus === 'connected' 
                        ? 'border-success text-success' 
                        : connectionStatus === 'error'
                        ? 'border-destructive text-destructive'
                        : 'border-warning text-warning'
                    }>
                      {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'error' ? 'Error' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Sources Tab */}
          <TabsContent value="data-sources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Data Sources
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Data Source
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Database className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">Data Source {i + 1}</div>
                          <div className="text-sm text-muted-foreground">Last updated: 2 hours ago</div>
                        </div>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Domains Tab */}
          <TabsContent value="domains" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Domains
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Domain
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-success" />
                        <div>
                          <div className="font-medium">Domain {i + 1}</div>
                          <div className="text-sm text-muted-foreground">Schema: {i + 1} tables</div>
                        </div>
                      </div>
                      <Badge variant="outline">Configured</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tokens Tab */}
          <TabsContent value="api-tokens" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Client API Tokens
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Token
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 2 }, (_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Key className="h-5 w-5 text-warning" />
                        <div>
                          <div className="font-medium">API Token {i + 1}</div>
                          <div className="text-sm text-muted-foreground">Created: {i + 1} day ago</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Active</Badge>
                        <Button variant="ghost" size="sm">Revoke</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
