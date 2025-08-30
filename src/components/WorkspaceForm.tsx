import { useState } from "react";
import { X, Plus, Eye, EyeOff, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface WorkspaceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workspaceData: WorkspaceFormData) => void;
}

export interface WorkspaceFormData {
  name: string;
  organization: string;
  description: string;
  tags: string[];
  embeddingProvider: string;
  defaultLLMProvider: string;
  visibility: 'private' | 'public';
}

const embeddingProviders = [
  "OpenAI Embeddings",
  "Cohere Embeddings", 
  "Hugging Face Embeddings",
  "Anthropic Embeddings",
  "Custom Embeddings"
];

const llmProviders = [
  "OpenAI GPT-4",
  "OpenAI GPT-3.5",
  "Anthropic Claude",
  "Google Gemini",
  "Meta Llama",
  "Custom LLM"
];

export const WorkspaceForm = ({ isOpen, onClose, onSubmit }: WorkspaceFormProps) => {
  const [formData, setFormData] = useState<WorkspaceFormData>({
    name: "",
    organization: "",
    description: "",
    tags: [],
    embeddingProvider: "",
    defaultLLMProvider: "",
    visibility: 'private'
  });
  
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Partial<WorkspaceFormData>>({});

  const handleInputChange = (field: keyof WorkspaceFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Partial<WorkspaceFormData> = {};
    if (!formData.name.trim()) newErrors.name = "Workspace name is required";
    if (!formData.organization.trim()) newErrors.organization = "Organization is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.embeddingProvider) newErrors.embeddingProvider = "Embedding provider is required";
    if (!formData.defaultLLMProvider) newErrors.defaultLLMProvider = "Default LLM provider is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      name: "",
      organization: "",
      description: "",
      tags: [],
      embeddingProvider: "",
      defaultLLMProvider: "",
      visibility: 'private'
    });
    setErrors({});
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Create New Workspace
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Workspace Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Workspace Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter workspace name"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Organization */}
          <div className="space-y-2">
            <Label htmlFor="organization" className="text-sm font-medium">
              Organization *
            </Label>
            <Input
              id="organization"
              value={formData.organization}
              onChange={(e) => handleInputChange('organization', e.target.value)}
              placeholder="Enter organization name"
              className={errors.organization ? "border-destructive" : ""}
            />
            {errors.organization && (
              <p className="text-sm text-destructive">{errors.organization}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your workspace"
              rows={3}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium">
              Tags
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag and press Enter"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={addTag}
                variant="outline"
                size="sm"
              >
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Embedding Provider */}
          <div className="space-y-2">
            <Label htmlFor="embeddingProvider" className="text-sm font-medium">
              Embedding Provider *
            </Label>
            <Select
              value={formData.embeddingProvider}
              onValueChange={(value) => handleInputChange('embeddingProvider', value)}
            >
              <SelectTrigger className={errors.embeddingProvider ? "border-destructive" : ""}>
                <SelectValue placeholder="Select embedding provider" />
              </SelectTrigger>
              <SelectContent>
                {embeddingProviders.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.embeddingProvider && (
              <p className="text-sm text-destructive">{errors.embeddingProvider}</p>
            )}
          </div>

          {/* Default LLM Provider */}
          <div className="space-y-2">
            <Label htmlFor="defaultLLMProvider" className="text-sm font-medium">
              Default LLM Provider *
            </Label>
            <Select
              value={formData.defaultLLMProvider}
              onValueChange={(value) => handleInputChange('defaultLLMProvider', value)}
            >
              <SelectTrigger className={errors.defaultLLMProvider ? "border-destructive" : ""}>
                <SelectValue placeholder="Select LLM provider" />
              </SelectTrigger>
              <SelectContent>
                {llmProviders.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.defaultLLMProvider && (
              <p className="text-sm text-destructive">{errors.defaultLLMProvider}</p>
            )}
          </div>

          {/* Workspace Visibility */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Workspace Visibility</Label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={formData.visibility === 'private'}
                  onChange={(e) => handleInputChange('visibility', e.target.value as 'private' | 'public')}
                  className="text-primary"
                />
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Private</span>
                </div>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={formData.visibility === 'public'}
                  onChange={(e) => handleInputChange('visibility', e.target.value as 'private' | 'public')}
                  className="text-primary"
                />
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Public</span>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Workspace
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
