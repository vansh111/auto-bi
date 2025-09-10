import { useState } from "react";
import { Search, Filter, Plus, TrendingUp, Users, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkspaceCard } from "./WorkspaceCard";
import { WorkspaceForm, WorkspaceFormData } from "./WorkspaceForm";
import { useWorkspaces } from "@/contexts/WorkspaceContext";
import { useToast } from "@/hooks/use-toast";

export const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { workspaces, addWorkspace } = useWorkspaces();
  const { toast } = useToast();

  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workspace.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoriteWorkspaces = workspaces.filter(workspace => workspace.isFavorite);
  const filteredFavoriteWorkspaces = favoriteWorkspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workspace.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateWorkspace = (workspaceData: WorkspaceFormData) => {
    try {
      const newWorkspace = addWorkspace(workspaceData);
      toast({
        title: "Workspace Created Successfully!",
        description: `"${newWorkspace.name}" has been created and is pending approval.`,
      });
      setIsFormOpen(false);
    } catch (error) {
      toast({
        title: "Error Creating Workspace",
        description: "There was an error creating the workspace. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your workspaces and applications</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow hover:shadow-none transition-all duration-200"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Workspace
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Workspaces</p>
              <p className="text-2xl font-bold text-foreground">{workspaces.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved Workspaces</p>
              <p className="text-2xl font-bold text-foreground">{workspaces.filter(w => w.isApproved).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Users className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Favorite Workspaces</p>
              <p className="text-2xl font-bold text-foreground">{workspaces.filter(w => w.isFavorite).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <Database className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Approval</p>
              <p className="text-2xl font-bold text-foreground">{workspaces.filter(w => !w.isApproved).length}</p>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="favourite" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="grid w-full max-w-md grid-cols-3 h-auto p-1">
            <TabsTrigger value="favourite" className="text-xs font-medium px-2 py-3 h-auto min-h-[4rem] tab-multiline">
              <div className="flex flex-col items-center gap-1">
                <span className="leading-tight tab-text-safe">FAVOURITE</span>
                <span className="leading-tight tab-text-safe">WORKSPACE</span>
                <Badge variant="secondary" className="text-xs tab-badge-safe">{favoriteWorkspaces.length}</Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs font-medium px-2 py-3 h-auto min-h-[4rem] tab-multiline">
              <div className="flex flex-col items-center gap-1">
                <span className="leading-tight tab-text-safe">ALL</span>
                <span className="leading-tight tab-text-safe">WORKSPACE</span>
                <Badge variant="secondary" className="text-xs tab-badge-safe">{workspaces.length}</Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs font-medium px-2 py-3 h-auto min-h-[4rem] tab-multiline">
              <div className="flex flex-col items-center gap-1">
                <span className="leading-tight tab-text-safe">USERS</span>
                <Badge variant="secondary" className="text-xs tab-badge-safe">{workspaces.reduce((sum, w) => sum + w.stats.user, 0)}</Badge>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search workspaces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-48 sm:w-64 border-border/50 focus:border-primary transition-colors"
              />
            </div>
            <Button variant="outline" size="icon" className="border-border/50 hover:border-border">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value="favourite" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFavoriteWorkspaces.map((workspace, index) => (
              <WorkspaceCard key={workspace.id} {...workspace} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredWorkspaces.map((workspace) => (
              <WorkspaceCard key={workspace.id} {...workspace} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">Users Management</h3>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* WorkspaceForm */}
      <WorkspaceForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleCreateWorkspace} 
      />
    </div>
  );
};