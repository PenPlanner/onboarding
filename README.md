# Vestas Onboarding System

A modern, comprehensive employee onboarding management system built with React 19, TypeScript, and Tailwind CSS.

## 🚀 Features

### Employee View
- **Interactive Dashboard** - Visual progress tracking for onboarding steps
- **Step-by-step Workflow** - Organized onboarding process with clear milestones
- **Progress Indicators** - Real-time completion status and next steps
- **Document Management** - File upload and tracking capabilities
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Admin Panel (Opens in New Window)
- **Employee Management** - Add, edit, delete employees with full CRUD operations
- **Batch Management** - Create and manage onboarding groups by month/year
- **Template Editor** - Customize onboarding workflows with drag-and-drop interface
- **Bulk Operations** - Import/export employee data via CSV files
- **Activity Log** - Comprehensive audit trail of all admin actions
- **Settings & Customization** - Company branding, notifications, and preferences
- **Real-time Statistics** - Dashboard with key metrics and insights

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript (strict mode)
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for lightweight, efficient state handling
- **Icons**: Lucide React for consistent iconography
- **Type Safety**: Full TypeScript implementation with strict checking

## 📦 Installation

```bash
# Navigate to project directory
cd onboarding

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint code quality checks

# Version Management
npm run version:patch   # Increment patch version (0.1.0 → 0.1.1)
npm run version:minor   # Increment minor version (0.1.0 → 0.2.0)
npm run version:major   # Increment major version (0.1.0 → 1.0.0)
```

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── admin/           # Admin panel components
│   ├── dashboard/       # Employee dashboard components
│   ├── stepper/         # Progress stepper components
│   ├── ui/             # Reusable UI components
│   ├── Login.tsx        # Authentication component
│   ├── AdminLayout.tsx  # Admin panel layout
│   └── VersionDisplay.tsx # Version information display
├── stores/              # Zustand state management
│   ├── auth.ts         # Authentication state
│   └── onboarding.ts   # Onboarding data state
├── types/              # TypeScript type definitions
├── lib/                # Utility functions and mock data
├── config/             # Configuration files
│   └── version.ts      # Version and release notes
└── App.tsx             # Main application component
```

## 🎯 Key Features Detailed

### Authentication & Security
- **Role-based Access Control** - Different permission levels for admins and HR
- **Secure Session Management** - Persistent login with automatic logout
- **Demo Credentials**:
  - Admin: `admin@vestas.com` / `admin123`
  - HR: `hr@vestas.com` / `hr123`

### Employee Management
- **Complete CRUD Operations** - Create, read, update, delete employees
- **Advanced Search & Filtering** - Find employees by name, position, batch, or status
- **Bulk Import/Export** - CSV file processing with validation and error reporting
- **System Integration** - Winda ID, SAP ID, and Employee ID management
- **Photo Management** - Profile photos with automatic generation

### Batch & Template Management
- **Batch Creation** - Organize onboarding by month/year groups
- **Template Customization** - Modify onboarding steps and subtasks
- **Drag & Drop Interface** - Reorder steps and customize workflows
- **Category System** - Documents, Security, Training, Equipment, Orientation
- **Responsible Person Assignment** - Assign different roles to each step

### Data & Analytics
- **Real-time Dashboard** - Live statistics and progress tracking
- **Activity Logging** - Complete audit trail of all system actions
- **Export Capabilities** - Download data in multiple formats (CSV, JSON)
- **Progress Tracking** - Visual indicators and completion percentages

## 📱 Version System

The application includes a comprehensive version display system accessible via the version badge in the bottom-right corner:

- **Current Version**: v0.1.0
- **Release Notes** - Detailed changelog with features, fixes, and breaking changes
- **System Information** - Build date, environment, and framework details
- **Resource Links** - Documentation and source code access

### Version Management Workflow

1. **Update version**: `npm run version:patch|minor|major`
2. **Sync version file**: `node scripts/sync-version.js`
3. **Update CHANGELOG.md** with new features and changes
4. **Build and deploy**: `npm run build`

## 🌐 Deployment

The application is built as a static SPA and can be deployed to any static hosting service:

- **Vite Build** - Optimized production bundle
- **Static Assets** - All resources bundled and optimized
- **Environment Configuration** - Ready for different deployment environments

## 📋 Configuration

### Company Customization
- **Branding** - Logo, colors, and company name
- **Default Settings** - Batch sizes, departments, workflows
- **Notifications** - Email reminders and alerts
- **Time Zones** - Multiple timezone support

### Development Configuration
- **TypeScript** - Strict mode with comprehensive type checking
- **ESLint** - Code quality and consistency rules
- **Tailwind CSS** - Utility-first styling with custom design tokens
- **Vite** - Fast build tool with optimized development experience

## 🤝 Contributing

1. **Contact development team** for contribution guidelines
2. **Create a feature branch** for your changes
3. **Follow TypeScript standards** with proper typing
4. **Add tests** if applicable
5. **Update documentation** as needed
6. **Submit changes** for review through internal process

## 📝 License

© 2025 Vestas Wind Systems A/S - All rights reserved

## 🆘 Support

For support and assistance:
- **Internal Support**: Contact your system administrator or IT support team
- **Technical Issues**: Report to IT Helpdesk
- **Training**: Contact HR department for user training

---

**Version**: 0.1.0 | **Build Date**: 2025-07-07 | **Environment**: Production