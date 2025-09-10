import React, { useState } from 'react';
import { FileSpreadsheet, Database, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CSVExcelConnection } from './CSVExcelConnection';
import { PostgreSQLConnection } from './PostgreSQLConnection';
import { usePersistentConnectionType } from '@/hooks/usePersistentState';

interface ConnectionTypeSelectorProps {
  onClose: () => void;
  onConnectionComplete: (connectionData: any) => void;
}

type ConnectionType = 'csv-excel' | 'postgresql' | null;

export const ConnectionTypeSelector: React.FC<ConnectionTypeSelectorProps> = ({
  onClose,
  onConnectionComplete
}) => {
  const [selectedType, setSelectedType] = usePersistentConnectionType();

  const connectionTypes = [
    {
      id: 'csv-excel',
      name: 'CSV/Excel Files',
      description: 'Upload CSV or Excel files directly to your workspace',
      icon: FileSpreadsheet,
      features: [
        'Drag & drop file upload',
        'Support for .csv, .xlsx, .xls, .ods',
        'Automatic data type detection',
        'Preview before connection'
      ],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'postgresql',
      name: 'PostgreSQL Database',
      description: 'Connect to an existing PostgreSQL database',
      icon: Database,
      features: [
        'Secure SSL connection',
        'Real-time data sync',
        'Schema introspection',
        'Connection testing'
      ],
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  if (selectedType === 'csv-excel') {
    return (
      <CSVExcelConnection
        onClose={() => setSelectedType(null)}
        onConnectionComplete={onConnectionComplete}
      />
    );
  }

  if (selectedType === 'postgresql') {
    return (
      <PostgreSQLConnection
        onClose={() => setSelectedType(null)}
        onConnectionComplete={onConnectionComplete}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add New Connection
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {connectionTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 hover:border-primary/50 ${type.borderColor}`}
                  onClick={() => setSelectedType(type.id as ConnectionType)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${type.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${type.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{type.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">Features:</h4>
                      <ul className="space-y-1">
                        {type.features.map((feature, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      className="w-full mt-4"
                      onClick={() => setSelectedType(type.id as ConnectionType)}
                    >
                      Connect {type.name}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h3 className="text-sm font-medium text-foreground mb-2">Need help choosing?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">CSV/Excel Files</p>
                <p>Perfect for uploading static data files, reports, or data exports. Great for one-time imports or regular file uploads.</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">PostgreSQL Database</p>
                <p>Ideal for connecting to live databases with real-time data. Best for ongoing data synchronization and analysis.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
