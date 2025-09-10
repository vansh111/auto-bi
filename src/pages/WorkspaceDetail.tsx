import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Settings, 
  Users, 
  Database, 
  Globe, 
  Key, 
  CheckCircle, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Heart,
  User,
  Edit,
  Trash,
  Zap,
  Loader2,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DatasourceOnboarding from "@/components/DatasourceOnboarding";
import { useWorkspaces } from "@/contexts/WorkspaceContext";
import { useToast } from "@/hooks/use-toast";
import { DeleteWorkspaceDialog } from "@/components/DeleteWorkspaceDialog";
import { ConnectionTypeSelector } from "@/components/ConnectionTypeSelector";

export default function WorkspaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getWorkspaceById, toggleFavorite, updateWorkspace, deleteWorkspace } = useWorkspaces();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("connections");
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showConnectionSelector, setShowConnectionSelector] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [connections, setConnections] = useState<any[]>([]);
  const [dataSources, setDataSources] = useState<any[]>([
    {
      id: "ds-1",
      name: "workspace",
      tags: ["configurat...", "embedding", "llm"],
      description: "Stores configurations, including default LLM and embedding settings, for organizations within the sy... Show more",
      lastUpdate: "26th Aug 2025, 7:42AM",
      sampleTest: "sample-test",
      visibility: "public",
      score: 75,
      metadataStatus: {
        testConnectivity: "success",
        fetchedSchemaDefinition: "success",
        columnMetadataStatus: "success",
        generateEmbeddings: "success"
      },
      lastMetadataRefresh: "26th Aug 2025, 7:42AM"
    },
    {
      id: "ds-2",
      name: "datasource",
      tags: ["metadata", "refresh", "sources"],
      description: "Tracks data sources, their configuration, and refresh schedules within a workspace, including metada.... Show more",
      lastUpdate: "26th Aug 2025, 7:42AM",
      sampleTest: "sample-test",
      visibility: "public",
      score: 75,
      metadataStatus: {
        testConnectivity: "success",
        fetchedSchemaDefinition: "success",
        columnMetadataStatus: "success",
        generateEmbeddings: "loading"
      },
      lastMetadataRefresh: "26th Aug 2025, 7:42AM"
    },
    {
      id: "ds-3",
      name: "domain",
      tags: ["connection", "metadata", "workspace"],
      description: "Stores configurations, validation statuses, and metadata refresh information for workspace connectio... Show more",
      lastUpdate: "26th Aug 2025, 7:42AM",
      sampleTest: "sample-test",
      visibility: "public",
      score: 75,
      metadataStatus: {
        testConnectivity: "success",
        fetchedSchemaDefinition: "success",
        columnMetadataStatus: "success",
        generateEmbeddings: "success"
      },
      lastMetadataRefresh: "26th Aug 2025, 7:42AM"
    },
    {
      id: "ds-4",
      name: "user",
      tags: ["account", "authentica...", "user"],
      description: "Stores user account information, including credentials, status, and roles, for system access and aut... Show more",
      lastUpdate: "26th Aug 2025, 7:42AM",
      sampleTest: "sample-test",
      visibility: "public",
      score: 75,
      metadataStatus: {
        testConnectivity: "success",
        fetchedSchemaDefinition: "success",
        columnMetadataStatus: "success",
        generateEmbeddings: "success"
      },
      lastMetadataRefresh: "26th Aug 2025, 7:42AM"
    },
    {
      id: "ds-5",
      name: "user_workspace_link",
      tags: ["access", "permission...", "workspaces"],
      description: "Tracks user roles and access permissions within specific workspaces, including domain-level privileg... Show more",
      lastUpdate: "26th Aug 2025, 7:42AM",
      sampleTest: "sample-test",
      visibility: "public",
      score: 75,
      metadataStatus: {
        testConnectivity: "success",
        fetchedSchemaDefinition: "success",
        columnMetadataStatus: "success",
        generateEmbeddings: "success"
      },
      lastMetadataRefresh: "26th Aug 2025, 7:42AM"
    },
    {
      id: "ds-6",
      name: "column_embedding_768",
      tags: ["column", "embeddings", "vectors"],
      description: "Stores vector embeddings for data elements, associating them with specific data sources and columns.Show more",
      lastUpdate: "26th Aug 2025, 7:42AM",
      sampleTest: "sample-test",
      visibility: "public",
      score: 75,
      metadataStatus: {
        testConnectivity: "success",
        fetchedSchemaDefinition: "success",
        columnMetadataStatus: "success",
        generateEmbeddings: "success"
      },
      lastMetadataRefresh: "26th Aug 2025, 7:42AM"
    }
  ]);

  // Get the workspace data based on the ID from URL
  const workspace = id ? getWorkspaceById(id) : null;

  // Redirect to dashboard if workspace not found
  useEffect(() => {
    if (id && !workspace) {
      toast({
        title: "Workspace Not Found",
        description: "The requested workspace could not be found.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [id, workspace, navigate, toast]);

  if (!workspace) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Loading...</h2>
          <p className="text-muted-foreground">Fetching workspace details...</p>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate("/");
  };

  const handleEdit = () => {
    console.log("Edit workspace");
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!workspace?.id) return;
    
    setIsDeleting(true);
    try {
      const deletedWorkspace = deleteWorkspace(workspace.id);
      if (deletedWorkspace) {
        toast({
          title: "Workspace Deleted",
          description: `"${deletedWorkspace.name}" has been permanently deleted.`,
        });
        navigate("/");
      } else {
        toast({
          title: "Error",
          description: "Failed to delete workspace. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the workspace.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleFavorite = () => {
    if (workspace.id) {
      toggleFavorite(workspace.id);
      toast({
        title: workspace.isFavorite ? "Removed from Favorites" : "Added to Favorites",
        description: `"${workspace.name}" has been ${workspace.isFavorite ? 'removed from' : 'added to'} your favorites.`,
      });
    }
  };

  const handleConnectionComplete = (connectionData: any) => {
    setConnections(prev => [...prev, connectionData]);
  };

  const handleEditDataSource = (dataSourceId: string) => {
    console.log("Edit data source:", dataSourceId);
  };

  const handleDeleteDataSource = (dataSourceId: string) => {
    console.log("Delete data source:", dataSourceId);
    setDataSources(prev => prev.filter(ds => ds.id !== dataSourceId));
  };

  return (
    <>
      {showOnboarding && (
        <DatasourceOnboarding 
          onClose={() => setShowOnboarding(false)} 
          onConnectionComplete={handleConnectionComplete}
        />
      )}
      
      {showConnectionSelector && (
        <ConnectionTypeSelector
          onClose={() => setShowConnectionSelector(false)}
          onConnectionComplete={handleConnectionComplete}
        />
      )}
      
      <DeleteWorkspaceDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        workspaceName={workspace?.name || ""}
        isLoading={isDeleting}
      />
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-border"></div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Owned Workspace</span>
              <span>•</span>
              <span className="text-foreground font-medium">{workspace.name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleEdit}>
              <User className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
          {/* Workspace Details */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{workspace.name}</h1>
                  <Badge variant="secondary" className="text-sm">
                    {workspace.organization}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-2">
                  Organization: <span className="font-semibold text-foreground">{workspace.organization}</span>
                </p>
                <p className="text-muted-foreground mb-2">{workspace.description}</p>
                <p className="text-sm text-muted-foreground">
                  Published on: {workspace.publishedDate} | Last modified on: {workspace.lastModified}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavorite}
                className={`h-10 w-10 p-0 ${
                  workspace.isFavorite ? "text-destructive hover:text-destructive" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Heart className={`h-5 w-5 ${workspace.isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {workspace.stats.dataSource}
                </div>
                <div className="text-sm text-muted-foreground">Data source</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {workspace.stats.domain}
                </div>
                <div className="text-sm text-muted-foreground">Domain</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {workspace.stats.user}
                </div>
                <div className="text-sm text-muted-foreground">User</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {workspace.stats.pendingApproval}
                </div>
                <div className="text-sm text-muted-foreground">Pending Approval</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="workspace-tabs space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="connections" className="flex items-center gap-2">
                CONNECTIONS ({workspace.stats.dataSource})
              </TabsTrigger>
              <TabsTrigger value="data-sources" className="flex items-center gap-2">
                DATA SOURCES ({dataSources.length})
              </TabsTrigger>
              <TabsTrigger value="domains" className="flex items-center gap-2">
                DOMAINS ({workspace.stats.domain})
              </TabsTrigger>
              <TabsTrigger value="api-tokens" className="flex items-center gap-2">
                CLIENT API TOKENS
              </TabsTrigger>
              <TabsTrigger value="approval" className="flex items-center gap-2">
                MY APPROVAL
              </TabsTrigger>
            </TabsList>

            {/* Connections Tab */}
            <TabsContent value="connections" className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={() => setShowConnectionSelector(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Connection
                  </Button>
                </div>
              </div>

              {connections.length === 0 ? (
                <Card className="empty-state-card">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="empty-state-icon">
                      <Zap className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      No Connections yet!
                    </h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                      Get started by adding your first connection to this workspace. You can connect CSV/Excel files or PostgreSQL databases.
                    </p>
                    <Button onClick={() => setShowConnectionSelector(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Connection
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {connections.map((connection) => (
                    <Card key={connection.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              connection.type === 'postgresql' 
                                ? 'bg-green-100' 
                                : connection.type === 'csv-excel'
                                ? 'bg-blue-100'
                                : 'bg-gray-100'
                            }`}>
                              {connection.type === 'postgresql' ? (
                                <Database className="h-6 w-6 text-green-600" />
                              ) : connection.type === 'csv-excel' ? (
                                <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                              ) : (
                                <Database className="h-6 w-6 text-gray-600" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{connection.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {connection.source} • {connection.tables?.length || connection.files || 0} {connection.type === 'csv-excel' ? 'files' : 'tables'}
                              </p>
                              {connection.type === 'postgresql' && connection.host && (
                                <p className="text-xs text-muted-foreground">
                                  {connection.host}:{connection.port}/{connection.database}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              Connected
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Data Sources Tab */}
            <TabsContent value="data-sources" className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Data Source
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dataSources.map((dataSource) => (
                  <Card key={dataSource.id} className="hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Database className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground text-lg">{dataSource.name}</h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {dataSource.tags.map((tag: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-gray-100 text-gray-700">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">{dataSource.score}</span>
                        </div>
                      </div>

                      {/* Information Section */}
                      <div className="space-y-3 mb-4">
                        <div className="text-sm text-muted-foreground">
                          Last update: {dataSource.lastUpdate}
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">
                          {dataSource.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{dataSource.sampleTest}</span>
                          <Badge variant="outline" className="text-xs">
                            {dataSource.visibility}
                          </Badge>
                        </div>
                      </div>

                      {/* Metadata Retrieval Status */}
                      <div className="space-y-3 mb-4">
                        <div className="text-sm font-medium text-foreground">
                          Metadata Retrieval Status:
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Last Metadata Refresh: {dataSource.lastMetadataRefresh}
                        </div>
                        <div className="space-y-2">
                          {Object.entries(dataSource.metadataStatus).map(([key, status]) => (
                            <div key={key} className="flex items-center gap-2">
                              {status === 'success' ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : status === 'loading' ? (
                                <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                              ) : (
                                <Clock className="h-4 w-4 text-gray-400" />
                              )}
                              <span className="text-sm text-foreground capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-4 border-t border-border">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleEditDataSource(dataSource.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          EDIT
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteDataSource(dataSource.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          DELETE
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Domains Tab */}
            <TabsContent value="domains" className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search domains"
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Domain
                </Button>
              </div>
              <Card className="empty-state-card">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="empty-state-icon">
                    <Globe className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No Domains yet!
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    Add your first domain to organize your data sources.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Tokens Tab */}
            <TabsContent value="api-tokens" className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search tokens"
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Token
                </Button>
              </div>
              <Card className="empty-state-card">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="empty-state-icon">
                    <Key className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No API Tokens yet!
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    Generate your first API token to access this workspace programmatically.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Approval Tab */}
            <TabsContent value="approval" className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search approvals"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <Card className="empty-state-card">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="empty-state-icon">
                    <CheckCircle className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No Pending Approvals!
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    All items are up to date. No approvals needed at this time.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};
