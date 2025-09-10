import { useState, useEffect, useCallback } from 'react';

interface PersistentStateOptions {
  key: string;
  defaultValue: any;
  storage?: 'localStorage' | 'sessionStorage';
}

export const usePersistentState = <T>(
  options: PersistentStateOptions
): [T, (value: T | ((prev: T) => T)) => void, () => void] => {
  const { key, defaultValue, storage = 'localStorage' } = options;
  const storageObj = storage === 'localStorage' ? localStorage : sessionStorage;

  // Get initial value from storage or use default
  const getStoredValue = useCallback(() => {
    try {
      const stored = storageObj.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Error reading from ${storage}:`, error);
      return defaultValue;
    }
  }, [key, defaultValue, storageObj]);

  const [state, setState] = useState<T>(getStoredValue);

  // Save to storage whenever state changes
  useEffect(() => {
    try {
      storageObj.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error saving to ${storage}:`, error);
    }
  }, [state, key, storageObj]);

  // Enhanced setState function that handles both values and functions
  const setPersistentState = (value: T | ((prev: T) => T)) => {
    if (typeof value === 'function') {
      setState(prev => {
        const newValue = (value as (prev: T) => T)(prev);
        return newValue;
      });
    } else {
      setState(value);
    }
  };

  // Clear storage function
  const clearState = useCallback(() => {
    try {
      storageObj.removeItem(key);
      setState(defaultValue);
    } catch (error) {
      console.error(`Error clearing ${storage}:`, error);
    }
  }, [key, defaultValue, storageObj]);

  return [state, setPersistentState, clearState];
};

// Specialized hook for file uploads
export const usePersistentFileUpload = (connectionId: string) => {
  const [files, setFiles] = usePersistentState({
    key: `csv-excel-files-${connectionId}`,
    defaultValue: [],
    storage: 'sessionStorage' // Use sessionStorage for files as they can't be serialized
  });

  const [uploadProgress, setUploadProgress] = usePersistentState({
    key: `csv-excel-progress-${connectionId}`,
    defaultValue: 0
  });

  const [isUploading, setIsUploading] = usePersistentState({
    key: `csv-excel-uploading-${connectionId}`,
    defaultValue: false
  });

  return {
    files,
    setFiles,
    uploadProgress,
    setUploadProgress,
    isUploading,
    setIsUploading
  };
};

// Specialized hook for PostgreSQL connection state
export const usePersistentPostgreSQLState = (connectionId: string) => {
  const [formData, setFormData] = usePersistentState({
    key: `postgresql-form-${connectionId}`,
    defaultValue: {
      connectionName: '',
      host: 'localhost',
      port: '5432',
      database: '',
      username: '',
      password: '',
      useSSL: false
    }
  });

  const [testResult, setTestResult] = usePersistentState({
    key: `postgresql-test-${connectionId}`,
    defaultValue: null
  });

  const [isTesting, setIsTesting] = usePersistentState({
    key: `postgresql-testing-${connectionId}`,
    defaultValue: false
  });

  const [isConnecting, setIsConnecting] = usePersistentState({
    key: `postgresql-connecting-${connectionId}`,
    defaultValue: false
  });

  return {
    formData,
    setFormData,
    testResult,
    setTestResult,
    isTesting,
    setIsTesting,
    isConnecting,
    setIsConnecting
  };
};

// Hook for managing connection type selection
export const usePersistentConnectionType = () => {
  const [selectedType, setSelectedType] = usePersistentState({
    key: 'connection-type-selection',
    defaultValue: null,
    storage: 'sessionStorage'
  });

  return [selectedType, setSelectedType];
};
