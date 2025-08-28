import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkspaceCard } from "./WorkspaceCard";

const workspaces = [
  {
    name: "Kaurav",
    organization: "D&AI",
    tags: ["test", "dummy"],
    description: "Some Desc, something",
    publishedDate: "Apr 10, 2025",
    lastModified: "Apr 10, 2025",
    stats: { dataSource: 11, domain: 2, user: 1, pendingApproval: 1 },
    isFavorite: true,
    isApproved: true
  },
  {
    name: "Shilpa",
    organization: "D&AI",
    tags: ["sampleschemas"],
    description: "My own workspace",
    publishedDate: "Apr 10, 2025",
    lastModified: "May 15, 2025",
    stats: { dataSource: 355, domain: 1, user: 1, pendingApproval: 2 },
    isFavorite: true,
    isApproved: true
  },
  {
    name: "BQ workspace",
    organization: "D&AI",
    tags: ["def"],
    description: "dslfireyvugsiufbdj",
    publishedDate: "May 19, 2025",
    lastModified: "May 19, 2025",
    stats: { dataSource: 3, domain: 1, user: 1, pendingApproval: 0 },
    isFavorite: true,
    isApproved: true
  },
  {
    name: "Luffy",
    organization: "D&AI",
    tags: ["autobi"],
    description: "This is autoBi DB workspace",
    publishedDate: "Apr 10, 2025",
    lastModified: "May 19, 2025",
    stats: { dataSource: 93, domain: 5, user: 2, pendingApproval: 0 },
    isFavorite: true,
    isApproved: true
  }
];

export const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workspace.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex-1 p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <Tabs defaultValue="favourite" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="favourite" className="text-sm">
              FAVOURITE WORKSPACE(6)
            </TabsTrigger>
            <TabsTrigger value="all" className="text-sm">
              ALL WORKSPACE(38)
            </TabsTrigger>
            <TabsTrigger value="users" className="text-sm">
              USERS(25)
            </TabsTrigger>
          </TabsList>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <TabsContent value="favourite" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredWorkspaces.map((workspace, index) => (
                <WorkspaceCard key={index} {...workspace} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredWorkspaces.map((workspace, index) => (
                <WorkspaceCard key={index} {...workspace} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <div className="text-center py-12 text-muted-foreground">
              Users management coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};