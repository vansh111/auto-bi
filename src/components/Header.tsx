import { Search, Bell, User, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="text-2xl font-bold text-primary">
          verizon
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm">
          <Bell className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-muted text-foreground">
              SA
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden sm:block">Super Admin</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          CREATE NEW WORKSPACE +
        </Button>
      </div>
    </header>
  );
};