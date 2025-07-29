# Admin Dashboard

A comprehensive React + Vite admin dashboard for managing transactions, projects, vendors, workers, partners, and dues.

## Features

- **Dashboard**: KPI cards, charts, and recent transactions overview
- **Transactions**: Full transaction management with filtering and PDF export
- **Projects**: Project tracking with related transactions
- **Vendors/Workers/Partners**: Entity management with transaction history
- **Dues**: Due payment tracking with payment management
- **PDF Export**: Comprehensive PDF generation for all entities
- **Responsive Design**: Mobile-first design with collapsible sidebar

## Tech Stack

- React 18 with functional components and hooks
- Vite for fast development and building
- Zustand for state management
- Tailwind CSS for styling
- Chart.js + react-chartjs-2 for data visualization
- jsPDF + jspdf-autotable for PDF generation
- Lucide React for icons
- date-fns for date utilities

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Build for production:
\`\`\`bash
npm run build
\`\`\`

## Project Structure

- \`src/components/\` - Reusable UI components
- \`src/pages/\` - Page components organized by feature
- \`src/stores/\` - Zustand store for state management
- \`src/utils/\` - Utility functions and mock data
- \`src/assets/\` - Static assets

## Key Features

### State Management
- Single Zustand store with all application state
- Actions for CRUD operations on all entities
- Computed values for due amounts and statuses

### PDF Export
- Entity-specific PDF reports
- Transaction reports with filtering
- Styled tables with company branding placeholder

### Responsive Design
- Desktop: Fixed sidebar navigation
- Mobile: Bottom tab bar + overlay menu
- Tablet: Responsive grid layouts

### Data Visualization
- Inflow vs Outflow donut chart
- Transaction type bar chart
- Partner activity visualization

## Mock Data

The application includes comprehensive mock data:
- 20+ transactions across all types
- 5 projects with various statuses
- 10 vendors and workers
- 8 partners across different types
- Account categories and users

## Development

The project uses modern React patterns:
- Functional components with hooks
- Custom hooks for reusable logic
- Component composition
- Responsive design principles

All components are built with accessibility in mind and follow React best practices.
