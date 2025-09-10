import { Heart, CheckCircle, Calendar, Clock, Database, Globe, Users, AlertCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWorkspaces } from "@/contexts/WorkspaceContext";
import { DeleteWorkspaceDialog } from "@/components/DeleteWorkspaceDialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface WorkspaceCardProps {
  id?: string;
  name: string;
  organization: string;
  tags: string[];
  description: string;
  publishedDate: string;
  lastModified: string;
  stats: {
    dataSource: number;
    domain: number;
    user: number;
    pendingApproval: number;
  };
  isFavorite?: boolean;
  isApproved?: boolean;
}

export const WorkspaceCard = ({ 
  id,
  name, 
  organization, 
  tags, 
  description, 
  publishedDate, 
  lastModified, 
  stats,
  isFavorite = false,
  isApproved = true 
}: WorkspaceCardProps) => {
  const navigate = useNavigate();
  const { toggleFavorite, deleteWorkspace } = useWorkspaces();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCardClick = () => {
    if (id) {
      navigate(`/workspace/${id}`);
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      toggleFavorite(id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const deletedWorkspace = deleteWorkspace(id);
      if (deletedWorkspace) {
        toast({
          title: "Workspace Deleted",
          description: `"${deletedWorkspace.name}" has been permanently deleted.`,
        });
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

  return (
    <>
      <DeleteWorkspaceDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        workspaceName={name}
        isLoading={isDeleting}
      />
      <Card className="group hover:shadow-soft transition-all duration-200 border-border/50 hover:border-border overflow-hidden cursor-pointer" onClick={handleCardClick}>
        <CardContent className="p-0">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {name}
                </h3>
                {isApproved && (
                  <Badge variant="outline" className="text-success border-success/30 bg-success/10 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Approved
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span className="font-medium">{organization}</span>
                <span className="text-border">•</span>
                <span>Organization</span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">Published {publishedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">Modified {lastModified}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 hover:bg-accent transition-colors ${
                  isFavorite ? "text-destructive hover:text-destructive" : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={handleFavoriteToggle}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-4 border-t border-border/50">
            <div className="text-center group/stat">
              <div className="flex items-center justify-center mb-1">
                <Database className="h-4 w-4 text-primary/60 group-hover/stat:text-primary transition-colors" />
              </div>
              <div className="text-base sm:text-lg font-bold text-foreground group-hover/stat:text-primary transition-colors truncate">
                {stats.dataSource}
              </div>
              <div className="text-xs text-muted-foreground truncate px-1">Data Sources</div>
            </div>
            
            <div className="text-center group/stat">
              <div className="flex items-center justify-center mb-1">
                <Globe className="h-4 w-4 text-success/60 group-hover/stat:text-success transition-colors" />
              </div>
              <div className="text-base sm:text-lg font-bold text-foreground group-hover/stat:text-success transition-colors truncate">
                {stats.domain}
              </div>
              <div className="text-xs text-muted-foreground truncate px-1">Domains</div>
            </div>
            
            <div className="text-center group/stat">
              <div className="flex items-center justify-center mb-1">
                <Users className="h-4 w-4 text-warning/60 group-hover/stat:text-warning transition-colors" />
              </div>
              <div className="text-base sm:text-lg font-bold text-foreground group-hover/stat:text-warning transition-colors truncate">
                {stats.user}
              </div>
              <div className="text-xs text-muted-foreground truncate px-1">Users</div>
            </div>
            
            <div className="text-center group/stat">
              <div className="flex items-center justify-center mb-1">
                <AlertCircle className="h-4 w-4 text-destructive/60 group-hover/stat:text-destructive transition-colors" />
              </div>
              <div className="text-base sm:text-lg font-bold text-foreground group-hover/stat:text-destructive transition-colors truncate">
                {stats.pendingApproval}
              </div>
              <div className="text-xs text-muted-foreground truncate px-1">Pending</div>
            </div>
          </div>
        </div>
        
        {/* Action Bar */}
        <div className="px-6 py-3 bg-muted/30 border-t border-border/50">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8 hover:bg-background"
              onClick={(e) => e.stopPropagation()}
            >
              View Details
            </Button>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8 border-border/50 hover:border-border"
                onClick={(e) => e.stopPropagation()}
              >
                Edit
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
};