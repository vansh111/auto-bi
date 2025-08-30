import { Search, Bell, User, ChevronDown, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleSidebarCollapse: () => void;
  sidebarCollapsed: boolean;
}

export const Header = ({ onToggleSidebar, onToggleSidebarCollapse, sidebarCollapsed }: HeaderProps) => {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50 shadow-soft">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="lg:hidden hover:bg-accent transition-colors"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
          incedo
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:flex relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-10 w-64 border-border/50 focus:border-primary transition-colors"
          />
        </div>
        
        <Button variant="ghost" size="sm" className="hover:bg-accent transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>
        
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 ring-2 ring-border/50 hover:ring-primary/50 transition-all">
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
              SA
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden sm:block">Super Admin</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
        </div>
      </div>
    </header>
  );
};