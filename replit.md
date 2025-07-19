# Discord Security Bot - Project Overview

## Overview

This is a full-stack Discord security bot application built with React (frontend), Express.js (backend), and PostgreSQL database. The project implements a comprehensive Discord moderation and security solution with AI-powered threat detection, automated moderation features, and a web dashboard for configuration and monitoring.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure
The application follows a monorepo architecture with clear separation of concerns:
- `client/` - React frontend with modern UI components
- `server/` - Express.js backend API
- `shared/` - Shared schemas and types between frontend and backend

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom Discord-themed design tokens
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Discord Integration**: Discord.js for bot functionality
- **API Design**: RESTful API with structured error handling
- **Development**: Hot reload with tsx

## Key Components

### Database Layer (Drizzle + PostgreSQL)
- **Schema Location**: `shared/schema.ts`
- **Migration Management**: Drizzle Kit for schema migrations
- **Tables**:
  - `users` - User management
  - `discord_servers` - Server configurations
  - `moderation_logs` - Audit trail for moderation actions
  - `threat_detections` - AI-powered threat detection logs
  - `bot_stats` - Bot performance metrics

### Discord Bot Service
- **Location**: `server/services/discord-bot.ts`
- **Features**:
  - Real-time message monitoring
  - Automated moderation actions (ban, kick, mute)
  - Slash command interface
  - Threat detection and response
  - Server analytics and reporting

### Storage Abstraction
- **Interface**: `IStorage` in `server/storage.ts`
- **Implementation**: Memory storage for development, database storage for production
- **Features**: CRUD operations for all entities with type safety

### API Routes
- **Location**: `server/routes.ts`
- **Endpoints**:
  - `/api/stats` - Bot statistics and metrics
  - `/api/server/:serverId` - Server configuration management
  - Configuration updates and threat monitoring

## Data Flow

1. **Discord Events** → Discord Bot Service → Storage Layer → Database
2. **Web Dashboard** → React Frontend → API Routes → Storage Layer → Database
3. **Configuration Changes** → API → Bot Service → Discord Server Updates
4. **Real-time Monitoring** → Bot Service → Threat Detection → Automated Response

## External Dependencies

### Core Dependencies
- **Discord.js**: Discord API integration and bot functionality
- **@neondatabase/serverless**: PostgreSQL database driver optimized for serverless
- **Drizzle ORM**: Type-safe database operations
- **React Query**: Server state management and caching

### UI Dependencies
- **Radix UI**: Headless UI components for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library

### Development Dependencies
- **Vite**: Fast build tool with HMR
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast bundling for production builds

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with proxy to backend
- **Backend**: Express server with hot reload via tsx
- **Database**: PostgreSQL with Drizzle migrations

### Production Build
- **Frontend**: Static build output to `dist/public`
- **Backend**: ESBuild bundle to `dist/index.js`
- **Database**: Drizzle push for schema updates

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **DISCORD_BOT_TOKEN**: Discord bot authentication
- **NODE_ENV**: Environment detection (development/production)

### Key Architectural Decisions

1. **Monorepo Structure**: Simplifies shared type definitions and reduces deployment complexity
2. **Drizzle ORM**: Provides type safety while maintaining flexibility for complex queries
3. **Memory Storage Interface**: Allows for easy testing and development without database dependency
4. **Component-based UI**: Radix UI + shadcn/ui provides accessible, customizable components
5. **Discord.js Integration**: Handles complex Discord API interactions with built-in event management
6. **Express.js Backend**: Simple, flexible API server with middleware support for logging and error handling

The application is designed for scalability with clear separation between Discord bot functionality, web dashboard, and data persistence layers.