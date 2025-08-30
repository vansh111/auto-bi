import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Grid3X3, 
  Users, 
  Settings, 
  User,
  X,
  Home,
  Briefcase,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { icon: Home, label: "Home", active: false },
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Grid3X3, label: "Applications", active: false },
  { icon: Briefcase, label: "Workspaces", active: false },
  { icon: Users, label: "Teams", active: false },
  { icon: Settings, label: "Settings", active: false },
  { icon: User, label: "Profile", active: false },
];

export const Sidebar = ({ isOpen, onClose, collapsed, onToggleCollapse }: SidebarProps) => {
  return (
    <TooltipProvider>
      <>
        {/* Mobile overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-200"
            onClick={onClose}
          />
        )}
        
        {/* Sidebar */}
        <aside className={cn(
          "fixed left-0 top-0 h-full bg-sidebar/95 backdrop-blur-md border-r border-sidebar-border transform transition-all duration-300 ease-out z-50 shadow-soft",
          "lg:relative lg:translate-x-0 lg:z-auto lg:shadow-none",
          collapsed ? "w-16" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Mobile header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border/50 lg:hidden">
            <span className="text-lg font-semibold text-sidebar-foreground">Menu</span>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-sidebar-accent">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Desktop collapse toggle */}
          <div className="hidden lg:flex items-center justify-end p-2 border-b border-sidebar-border/50">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleCollapse}
                  className="h-8 w-8 p-0 hover:bg-sidebar-accent"
                >
                  {collapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {collapsed ? "Expand sidebar" : "Collapse sidebar"}
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="p-4">
            <div className="mb-6">
              {!collapsed && (
                <h2 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
                  Navigation
                </h2>
              )}
              <nav className="space-y-1">
                {menuItems.map((item, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={item.active ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3 h-11 text-sm font-medium transition-all duration-200",
                          collapsed && "justify-center px-0",
                          item.active 
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" 
                            : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                        )}
                      >
                        <item.icon className={cn(
                          "h-4 w-4 transition-transform duration-200 flex-shrink-0",
                          item.active && "scale-110"
                        )} />
                        {!collapsed && item.label}
                      </Button>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </nav>
            </div>
          </div>
        </aside>
      </>
    </TooltipProvider>
  );
};