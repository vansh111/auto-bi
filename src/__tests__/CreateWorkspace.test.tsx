import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';
import { Dashboard } from '@/components/Dashboard';
import { Toaster } from '@/components/ui/toaster';

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <WorkspaceProvider>
    {children}
    <Toaster />
  </WorkspaceProvider>
);

describe('Create Workspace Functionality', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('should open workspace form when New Workspace button is clicked', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    const newWorkspaceButton = screen.getByText('New Workspace');
    fireEvent.click(newWorkspaceButton);

    expect(screen.getByText('Create New Workspace')).toBeInTheDocument();
  });

  test('should create a new workspace with form data', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    // Open the form
    const newWorkspaceButton = screen.getByText('New Workspace');
    fireEvent.click(newWorkspaceButton);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/workspace name/i), {
      target: { value: 'Test Workspace' },
    });
    fireEvent.change(screen.getByLabelText(/organization/i), {
      target: { value: 'Test Org' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test description' },
    });

    // Select providers
    fireEvent.click(screen.getByText('Select embedding provider'));
    fireEvent.click(screen.getByText('OpenAI Embeddings'));

    fireEvent.click(screen.getByText('Select LLM provider'));
    fireEvent.click(screen.getByText('OpenAI GPT-4'));

    // Submit the form
    const createButton = screen.getByText('Create Workspace');
    fireEvent.click(createButton);

    // Wait for the form to close and workspace to be created
    await waitFor(() => {
      expect(screen.queryByText('Create New Workspace')).not.toBeInTheDocument();
    });

    // Check if the new workspace appears in the dashboard
    expect(screen.getByText('Test Workspace')).toBeInTheDocument();
  });

  test('should show validation errors for required fields', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    // Open the form
    const newWorkspaceButton = screen.getByText('New Workspace');
    fireEvent.click(newWorkspaceButton);

    // Try to submit without filling required fields
    const createButton = screen.getByText('Create Workspace');
    fireEvent.click(createButton);

    // Check for validation errors
    expect(screen.getByText('Workspace name is required')).toBeInTheDocument();
    expect(screen.getByText('Organization is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
  });

  test('should navigate to workspace detail when workspace card is clicked', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    // Find a workspace card and click it
    const workspaceCards = screen.getAllByText(/sample|Kaurav|Shilpa|BQ workspace|Luffy/);
    if (workspaceCards.length > 0) {
      fireEvent.click(workspaceCards[0].closest('[data-testid="workspace-card"]') || workspaceCards[0]);
      
      // Check if navigate was called with the correct workspace ID
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringMatching(/^\/workspace\/.+/));
    }
  });

  test('should persist workspaces in localStorage', () => {
    // Clear localStorage before test
    localStorage.clear();
    
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    // Create a new workspace
    const newWorkspaceButton = screen.getByText('New Workspace');
    fireEvent.click(newWorkspaceButton);

    fireEvent.change(screen.getByLabelText(/workspace name/i), {
      target: { value: 'Persistent Workspace' },
    });
    fireEvent.change(screen.getByLabelText(/organization/i), {
      target: { value: 'Test Org' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test description' },
    });

    fireEvent.click(screen.getByText('Select embedding provider'));
    fireEvent.click(screen.getByText('OpenAI Embeddings'));

    fireEvent.click(screen.getByText('Select LLM provider'));
    fireEvent.click(screen.getByText('OpenAI GPT-4'));

    fireEvent.click(screen.getByText('Create Workspace'));

    // Check if workspace was saved to localStorage
    const savedWorkspaces = localStorage.getItem('workspaces');
    expect(savedWorkspaces).toBeTruthy();
    
    const parsedWorkspaces = JSON.parse(savedWorkspaces!);
    expect(parsedWorkspaces).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Persistent Workspace',
          organization: 'Test Org'
        })
      ])
    );
  });

  test('should delete workspace and update localStorage', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    // Find delete button and click it
    const deleteButtons = screen.getAllByText('Delete');
    if (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[0]);
      
      // Confirm deletion in dialog
      const confirmButton = screen.getByText('Delete Workspace');
      fireEvent.click(confirmButton);
      
      // Check that workspace was removed from localStorage
      const savedWorkspaces = localStorage.getItem('workspaces');
      if (savedWorkspaces) {
        const parsedWorkspaces = JSON.parse(savedWorkspaces);
        // The workspace should be removed from the array
        expect(parsedWorkspaces.length).toBeLessThan(5); // Initial workspaces count
      }
    }
  });
});
