import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { WorkspaceFormData } from '@/components/WorkspaceForm';

export interface Workspace {
  id: string;
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
  isFavorite: boolean;
  isApproved: boolean;
  embeddingProvider: string;
  defaultLLMProvider: string;
  visibility: 'private' | 'public';
}

interface WorkspaceContextType {
  workspaces: Workspace[];
  addWorkspace: (workspaceData: WorkspaceFormData) => Workspace;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => Workspace | null;
  toggleFavorite: (id: string) => void;
  getWorkspaceById: (id: string) => Workspace | undefined;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Initial sample data
const initialWorkspaces: Workspace[] = [
  {
    id: "sample-123",
    name: "sample",
    organization: "D&AI",
    tags: ["sample"],
    description: "Sample workspace for testing",
    publishedDate: "Aug 26, 2025",
    lastModified: "May 22, 2025",
    stats: { dataSource: 0, domain: 0, user: 1, pendingApproval: 0 },
    isFavorite: true,
    isApproved: true,
    embeddingProvider: "OpenAI Embeddings",
    defaultLLMProvider: "OpenAI GPT-4",
    visibility: 'private'
  },
  {
    id: "kaurav-123",
    name: "Kaurav",
    organization: "D&AI",
    tags: ["test", "dummy"],
    description: "Some Desc, something",
    publishedDate: "Apr 10, 2025",
    lastModified: "Apr 10, 2025",
    stats: { dataSource: 11, domain: 2, user: 1, pendingApproval: 1 },
    isFavorite: true,
    isApproved: true,
    embeddingProvider: "Cohere Embeddings",
    defaultLLMProvider: "Anthropic Claude",
    visibility: 'private'
  },
  {
    id: "shilpa-456",
    name: "Shilpa",
    organization: "D&AI",
    tags: ["sampleschemas"],
    description: "My own workspace",
    publishedDate: "Apr 10, 2025",
    lastModified: "May 15, 2025",
    stats: { dataSource: 355, domain: 1, user: 1, pendingApproval: 2 },
    isFavorite: true,
    isApproved: true,
    embeddingProvider: "Hugging Face Embeddings",
    defaultLLMProvider: "Google Gemini",
    visibility: 'public'
  },
  {
    id: "bq-workspace-789",
    name: "BQ workspace",
    organization: "D&AI",
    tags: ["def"],
    description: "dslfireyvugsiufbdj",
    publishedDate: "May 19, 2025",
    lastModified: "May 19, 2025",
    stats: { dataSource: 3, domain: 1, user: 1, pendingApproval: 0 },
    isFavorite: true,
    isApproved: true,
    embeddingProvider: "Anthropic Embeddings",
    defaultLLMProvider: "Meta Llama",
    visibility: 'private'
  },
  {
    id: "luffy-012",
    name: "Luffy",
    organization: "D&AI",
    tags: ["autobi"],
    description: "This is autoBi DB workspace",
    publishedDate: "Apr 10, 2025",
    lastModified: "May 19, 2025",
    stats: { dataSource: 93, domain: 5, user: 2, pendingApproval: 0 },
    isFavorite: true,
    isApproved: true,
    embeddingProvider: "Custom Embeddings",
    defaultLLMProvider: "Custom LLM",
    visibility: 'public'
  }
];

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  // Load workspaces from localStorage on component mount
  useEffect(() => {
    const savedWorkspaces = localStorage.getItem('workspaces');
    if (savedWorkspaces) {
      try {
        const parsedWorkspaces = JSON.parse(savedWorkspaces);
        setWorkspaces(parsedWorkspaces);
      } catch (error) {
        console.error('Error parsing saved workspaces:', error);
        // Fallback to initial workspaces if parsing fails
        setWorkspaces(initialWorkspaces);
      }
    } else {
      // First time user - set initial workspaces
      setWorkspaces(initialWorkspaces);
    }
  }, []);

  // Save workspaces to localStorage whenever workspaces change
  useEffect(() => {
    if (workspaces.length > 0) {
      localStorage.setItem('workspaces', JSON.stringify(workspaces));
    }
  }, [workspaces]);

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const addWorkspace = (workspaceData: WorkspaceFormData) => {
    const newWorkspace: Workspace = {
      id: generateId(),
      name: workspaceData.name,
      organization: workspaceData.organization,
      tags: workspaceData.tags,
      description: workspaceData.description,
      publishedDate: formatDate(new Date()),
      lastModified: formatDate(new Date()),
      stats: { 
        dataSource: 0, 
        domain: 0, 
        user: 1, 
        pendingApproval: 0 
      },
      isFavorite: false,
      isApproved: false, // New workspaces need approval
      embeddingProvider: workspaceData.embeddingProvider,
      defaultLLMProvider: workspaceData.defaultLLMProvider,
      visibility: workspaceData.visibility
    };

    setWorkspaces(prev => [newWorkspace, ...prev]);
    
    // In a real app, you would make an API call here
    console.log('Workspace created:', newWorkspace);
    
    return newWorkspace;
  };

  const updateWorkspace = (id: string, updates: Partial<Workspace>) => {
    setWorkspaces(prev => 
      prev.map(workspace => 
        workspace.id === id 
          ? { ...workspace, ...updates, lastModified: formatDate(new Date()) }
          : workspace
      )
    );
  };

  const deleteWorkspace = (id: string) => {
    const workspaceToDelete = workspaces.find(workspace => workspace.id === id);
    if (workspaceToDelete) {
      setWorkspaces(prev => prev.filter(workspace => workspace.id !== id));
      return workspaceToDelete;
    }
    return null;
  };

  const toggleFavorite = (id: string) => {
    setWorkspaces(prev => 
      prev.map(workspace => 
        workspace.id === id 
          ? { ...workspace, isFavorite: !workspace.isFavorite }
          : workspace
      )
    );
  };

  const getWorkspaceById = (id: string) => {
    return workspaces.find(workspace => workspace.id === id);
  };

  const value: WorkspaceContextType = {
    workspaces,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
    toggleFavorite,
    getWorkspaceById
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaces = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspaces must be used within a WorkspaceProvider');
  }
  return context;
};
