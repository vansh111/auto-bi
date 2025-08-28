import { Heart, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WorkspaceCardProps {
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
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span>Organization: {organization}</span>
              <span>|</span>
              <span>Tags:</span>
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
            <p className="text-xs text-muted-foreground">
              Published on {publishedDate} | Last modified on {lastModified}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={isApproved ? "text-success hover:text-success" : "text-muted-foreground"}
            >
              <CheckCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={isFavorite ? "text-destructive hover:text-destructive" : "text-muted-foreground"}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.dataSource}</div>
            <div className="text-xs text-muted-foreground">Data source</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.domain}</div>
            <div className="text-xs text-muted-foreground">Domain</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.user}</div>
            <div className="text-xs text-muted-foreground">User</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.pendingApproval}</div>
            <div className="text-xs text-muted-foreground">Pending Approval</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};