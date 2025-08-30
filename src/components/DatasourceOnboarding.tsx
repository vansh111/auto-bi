import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface DatasourceOnboardingProps {
  onClose: () => void;
  onConnectionComplete?: (connectionData: any) => void;
}

export default function DatasourceOnboarding({ onClose, onConnectionComplete }: DatasourceOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSource, setSelectedSource] = useState("External Data");
  const [selectedDatabase, setSelectedDatabase] = useState("");

  const steps = [
    { id: 1, title: "Select Source", icon: "🔧" },
    { id: 2, title: "Validate Connectivity", icon: "..." },
    { id: 3, title: "Define Schema Definition", icon: "..." }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    const connectionData = {
      id: `conn_${Date.now()}`,
      name: `${selectedDatabase} Connection`,
      type: selectedDatabase,
      source: selectedSource,
      status: 'connected',
      createdAt: new Date().toISOString(),
      tables: ['Datasource_embedding_768', 'Column_embedding_768', 'Domain_embedding_768']
    };
    
    if (onConnectionComplete) {
      onConnectionComplete(connectionData);
    }
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Source</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sources" className="text-gray-700">Sources</Label>
                  <Select value={selectedSource} onValueChange={setSelectedSource}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="External Data">External Data</SelectItem>
                      <SelectItem value="Internal Data">Internal Data</SelectItem>
                      <SelectItem value="API Data">API Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedDatabase === "postgres" ? "ring-2 ring-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedDatabase("postgres")}
                  >
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <div className="w-16 h-16 mb-4 flex items-center justify-center">
                        <div className="text-4xl">🐘</div>
                      </div>
                      <span className="font-medium text-gray-900">Postgres</span>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedDatabase === "bigquery" ? "ring-2 ring-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedDatabase("bigquery")}
                  >
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <div className="w-16 h-16 mb-4 flex items-center justify-center">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">Q</span>
                        </div>
                      </div>
                      <span className="font-medium text-gray-900">BigQuery</span>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Validate Connectivity</h2>
              <p className="text-gray-600 mb-6">
                Configure your database connection settings to validate connectivity.
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="host" className="text-gray-700">Host</Label>
                  <Input id="host" placeholder="Enter host address" />
                </div>
                
                <div>
                  <Label htmlFor="port" className="text-gray-700">Port</Label>
                  <Input id="port" placeholder="5432" />
                </div>
                
                <div>
                  <Label htmlFor="database" className="text-gray-700">Database</Label>
                  <Input id="database" placeholder="Enter database name" />
                </div>
                
                <div>
                  <Label htmlFor="username" className="text-gray-700">Username</Label>
                  <Input id="username" placeholder="Enter username" />
                </div>
                
                <div>
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <Input id="password" type="password" placeholder="Enter password" />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Define Schema Definition</h2>
              <p className="text-gray-600 mb-6">
                Select the tables you want to import and configure their metadata settings.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Tables</h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input placeholder="Search tables by name..." className="pl-10" />
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="table1" className="rounded" defaultChecked />
                          <Label htmlFor="table1" className="text-sm font-medium text-blue-700">Datasource_embedding_768</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="table2" className="rounded" />
                          <Label htmlFor="table2" className="text-sm font-medium">Column_embedding_768</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="table3" className="rounded" />
                          <Label htmlFor="table3" className="text-sm font-medium">Domain_embedding_768</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700">Table Description</Label>
                      <textarea
                        id="description"
                        className="w-full min-h-[80px] p-3 border rounded-md resize-none"
                        placeholder="Describe what this table contains..."
                        defaultValue="Stores vector embeddings associated with data sources."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="tags" className="text-sm font-medium text-gray-700">Tags</Label>
                      <Input id="tags" placeholder="Add tags..." />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoRefresh" className="text-sm font-medium text-gray-700">Auto Refresh</Label>
                      <input type="checkbox" id="autoRefresh" className="rounded" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">Datasource Onboarding</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200">
          <div className="flex items-center gap-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  currentStep >= step.id 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {currentStep >= step.id ? step.icon : "..."}
                </div>
                <span className={`text-sm font-medium ${
                  currentStep >= step.id ? "text-gray-900" : "text-gray-500"
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-8 h-px bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            BACK
          </Button>
          
          <Button 
            onClick={currentStep === 3 ? handleFinish : handleNext}
            className="flex items-center gap-2"
          >
            {currentStep === 3 ? "FINISH" : "NEXT"}
            {currentStep !== 3 && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
