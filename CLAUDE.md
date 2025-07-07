# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Onboarding" is a modern React web application for managing the onboarding process of new hires at Vestas. The app provides a visual dashboard to track progress across multiple onboarding steps with a clean, Apple/Notion-inspired interface.

## Tech Stack

- **React 19** with TypeScript (strict mode)
- **Vite** for build tooling and development server
- **Tailwind CSS** for styling with custom pastel color scheme
- **Zustand** for lightweight state management
- **Lucide React** for icons
- **Modern file structure** with organized components

## Common Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint (if configured)

# Dependencies
npm install          # Install dependencies
npm run typecheck    # Run TypeScript type checking
```

## Architecture

### Core Components

- **Dashboard**: Main view showing 12 new hires in a responsive grid
- **HireCard**: Individual hire cards with progress indicators and contact info
- **HireDetail**: Detailed view of a specific hire's onboarding progress
- **ProgressStepper**: Visual stepper component showing onboarding steps with subtasks
- **UI Components**: Reusable Card, Button, Badge components following design system

### State Management

- **Zustand store** (`src/stores/onboarding.ts`) manages:
  - Current onboarding batch
  - Selected hire details
  - Progress tracking and subtask toggling
  - Batch management operations

### Data Structure

- **OnboardingBatch**: Contains multiple hires for a specific month/year
- **NewHire**: Individual hire with personal info, progress, and steps
- **OnboardingStep**: Steps like Documentation, Security, Training, Equipment
- **Subtask**: Individual tasks within each step with completion status

### Styling

- **Tailwind CSS** with custom color scheme (primary blue, success green, warning yellow)
- **Rounded cards** (rounded-2xl) with subtle shadows
- **Pastel color palette** with good contrast ratios
- **Responsive design** with mobile-first approach

## Key Features

1. **Visual Progress Tracking**: Green progress lines connecting completed steps
2. **Subtask Management**: Nested checklists under each main step
3. **Status Indicators**: Color-coded status badges (completed, in progress, delayed)
4. **Contact Information**: Email, phone, department details
5. **Search & Filter**: Find hires by name, position, or status
6. **Deadline Tracking**: Due dates displayed as colored tags

## Development Notes

- Mock data is provided in `src/lib/mockData.ts` for development
- The app uses a single-page structure with conditional rendering
- Progress calculations are automatic when subtasks are toggled
- Components follow TypeScript strict mode with proper type definitions
- All icons are from Lucide React for consistency