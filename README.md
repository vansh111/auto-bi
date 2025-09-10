# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/5d45f736-0cc5-4dfd-b2ba-f0f15d85d209

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5d45f736-0cc5-4dfd-b2ba-f0f15d85d209) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Router
- React Query (TanStack Query)

## Features

### Create Workspace Functionality

The application includes a comprehensive workspace creation system with the following features:

#### Workspace Management
- **Create New Workspaces**: Users can create new workspaces through a modal form
- **Delete Workspaces**: Users can delete workspaces with confirmation dialog
- **Workspace State Management**: Centralized state management using React Context
- **Persistent Storage**: All workspace data persists across browser refreshes using localStorage
- **Real-time Updates**: Dashboard stats and workspace lists update automatically
- **Favorite Toggle**: Users can mark workspaces as favorites
- **Search & Filter**: Search workspaces by name or description

#### Data Connections
- **CSV/Excel File Upload**: Upload and connect CSV or Excel files directly
- **PostgreSQL Database**: Connect to PostgreSQL databases with secure authentication
- **Connection Management**: View, manage, and monitor all workspace connections
- **File Type Support**: Supports .csv, .xlsx, .xls, .ods file formats
- **Database Features**: SSL support, connection testing, schema introspection
- **Visual Connection Types**: Different icons and colors for different connection types

#### Workspace Form Fields
- **Workspace Name**: Required field for workspace identification
- **Organization**: Required field for organizational grouping
- **Description**: Required field for workspace details
- **Tags**: Optional tags for categorization (add/remove functionality)
- **Embedding Provider**: Required selection from available providers
- **LLM Provider**: Required selection from available language models
- **Visibility**: Choose between private or public workspace

#### Dashboard Features
- **Dynamic Stats**: Real-time statistics showing:
  - Total workspaces count
  - Approved workspaces count
  - Favorite workspaces count
  - Pending approval count
- **Tabbed Interface**: Separate views for favorites, all workspaces, and users
- **Responsive Design**: Mobile-friendly interface with adaptive layouts

#### Technical Implementation
- **Context API**: Centralized workspace state management
- **Persistent Storage**: localStorage integration for data persistence
- **Form State Persistence**: All connection forms maintain state across page refreshes
- **Upload Progress Persistence**: File upload progress is preserved during interruptions
- **Connection State Recovery**: Automatic recovery of connection forms and progress
- **Type Safety**: Full TypeScript support with proper interfaces
- **Form Validation**: Client-side validation with error handling
- **Toast Notifications**: User feedback for successful operations
- **Error Handling**: Graceful error handling with user-friendly messages
- **Confirmation Dialogs**: Safe delete operations with user confirmation
- **Loading States**: Visual feedback during async operations

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5d45f736-0cc5-4dfd-b2ba-f0f15d85d209) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
