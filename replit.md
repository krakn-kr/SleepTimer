# Screen Time Analytics Dashboard

## Overview

This is a full-stack web application for tracking and visualizing screen lock/unlock patterns. The application provides detailed analytics on device usage, including session durations, daily statistics, and visual representations of screen time data. Built with a modern React frontend and Express backend, it follows Material Design 3 principles optimized for data-dense dashboards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript and Vite as the build tool

**UI Component System**: The application uses shadcn/ui components built on Radix UI primitives, configured with the "new-york" style variant. All components follow a consistent design system with:
- Custom Tailwind configuration for theming
- CSS variables for colors supporting light/dark modes
- Material Design 3 inspired layout patterns

**State Management**: TanStack Query (React Query) for server state management with custom query client configuration. The query client is configured with:
- Custom fetch wrapper (`apiRequest`) for API calls
- No automatic refetching on window focus or intervals
- Infinite stale time for cached data

**Routing**: wouter library for lightweight client-side routing

**Styling Approach**: 
- Tailwind CSS with custom configuration
- Design tokens defined in CSS variables (HSL color format)
- Inter and Roboto fonts for typography hierarchy
- Responsive grid system (12-column desktop, 8-column tablet, single-column mobile)
- Card-based component organization with consistent spacing

**Data Visualization**: Custom bar chart components built with native React, not relying on external charting libraries

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js

**API Design**: RESTful API with a single endpoint currently implemented:
- `GET /api/sessions` - Retrieves all screen lock sessions

**Development Setup**: The server integrates with Vite's middleware mode for hot module replacement during development, serving the built frontend in production.

**Request Logging**: Custom middleware logs all API requests with timing information, response status, and truncated response bodies for debugging.

**Data Storage Strategy**: Currently using in-memory storage (`MemStorage` class) with mock data generation for development. The storage interface (`IStorage`) is abstracted to allow easy swapping to persistent storage.

### Data Storage Solutions

**Database Schema**: Defined using Drizzle ORM with PostgreSQL dialect. The schema includes:

**Screen Lock Sessions Table**:
- `id`: UUID primary key (auto-generated)
- `lockTime`: Timestamp when device was locked
- `unlockTime`: Timestamp when device was unlocked
- `durationSeconds`: Integer representing session duration

**Database Configuration**: Drizzle Kit configured to:
- Output migrations to `./migrations` directory
- Use shared schema from `./shared/schema.ts`
- Connect via `DATABASE_URL` environment variable

**Type Safety**: Zod schemas generated from Drizzle tables for runtime validation using `drizzle-zod`

**Current State**: The application is set up to use PostgreSQL (via `@neondatabase/serverless`), but currently runs with in-memory mock data. The database infrastructure is ready but not yet actively used.

### Authentication and Authorization

No authentication or authorization mechanisms are currently implemented. The application assumes a single-user context with open access to all data.

### Key Architectural Decisions

**Monorepo Structure**: The codebase uses a monorepo pattern with three main directories:
- `client/` - Frontend React application
- `server/` - Backend Express server
- `shared/` - Shared types and schemas between frontend and backend

**Path Aliases**: TypeScript path mapping enables clean imports:
- `@/` maps to client source
- `@shared/` maps to shared directory
- `@assets/` maps to attached assets

**Build Process**:
- Client: Vite builds to `dist/public`
- Server: esbuild bundles to `dist/index.js` with ESM output
- Single start command serves bundled application in production

**Development Experience**: Replit-specific plugins integrated for enhanced development:
- Runtime error modal overlay
- Development banner
- Cartographer for code mapping

**Type Safety Philosophy**: Strict TypeScript configuration across the stack with:
- Strict mode enabled
- No emit during type checking (build tools handle output)
- ESNext module system
- DOM types for frontend compatibility

**Responsive Design**: Mobile-first approach with:
- Breakpoint at 768px for mobile detection
- Fluid typography and spacing
- Touch-friendly interface elements
- Collapsible/expandable sections for small screens

### Design System Rationale

**Material Design 3 Selection**: Chosen for its strong patterns in data visualization contexts, familiar interaction patterns for Android users, and excellent card-based layouts that create clear visual hierarchy for metrics.

**Color System**: HSL-based color tokens enable:
- Seamless light/dark mode switching
- Consistent opacity/transparency handling
- Easy programmatic color manipulation

**Component Elevation**: Uses shadow and border strategies rather than just box-shadow for depth, creating a more subtle, modern appearance

**Typography Scale**: Deliberate hierarchy from 12px chart labels to 48px primary metrics ensures data clarity at all viewport sizes

## External Dependencies

### Core Framework Dependencies

- **React 18**: UI rendering with concurrent features
- **Express**: Backend HTTP server
- **Vite**: Frontend build tool and dev server
- **TypeScript**: Type safety across the stack

### Database & ORM

- **Drizzle ORM**: Type-safe database queries and schema management
- **@neondatabase/serverless**: PostgreSQL client optimized for serverless environments
- **Drizzle Zod**: Runtime validation schema generation

### UI Component Libraries

- **Radix UI**: Headless UI primitives for ~20 component types (accordion, dialog, dropdown, etc.)
- **shadcn/ui**: Pre-styled component implementations
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management
- **Tailwind CSS**: Utility-first styling
- **cmdk**: Command menu component

### State Management & Data Fetching

- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management
- **Zod**: Schema validation

### Utility Libraries

- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional className composition
- **wouter**: Lightweight routing
- **embla-carousel-react**: Carousel components

### Development Tools

- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production server
- **Replit plugins**: Development experience enhancements (error overlay, banner, cartographer)

### Session Management

- **connect-pg-simple**: PostgreSQL session store (configured but not actively used)

### Future Integration Points

The architecture is prepared for:
- PostgreSQL database activation (configuration exists, using mock data currently)
- User authentication system (session infrastructure ready)
- Real-time data synchronization (websocket-ready server setup)
- Mobile application data ingestion (RESTful API extensible)