# Overview

This is a multi-role management system built with React frontend and Express backend. The application provides different dashboards and functionality for three user roles: administrators, clients, and team members. Administrators can manage clients and team members, clients can view their invoices and project history, and team members can manage their assigned projects. The system includes authentication via Replit Auth, a PostgreSQL database with Drizzle ORM, and a modern UI built with Radix UI components and Tailwind CSS.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with hot module replacement

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Replit OpenID Connect integration with Passport.js
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful API with role-based access control
- **Error Handling**: Centralized error middleware
- **Request Logging**: Custom middleware for API request logging

## Database Design
- **ORM**: Drizzle ORM with PostgreSQL adapter
- **Connection**: Neon serverless PostgreSQL with connection pooling
- **Schema**: Type-safe database schema with relations
- **Migrations**: Drizzle Kit for schema migrations
- **Tables**: Users, clients, team members, projects, invoices, project assignments, and sessions

## Authentication & Authorization
- **Provider**: Replit Auth using OpenID Connect
- **Strategy**: Passport.js with custom OpenID Connect strategy
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Role-Based Access**: Three roles (admin, client, team) with route protection
- **Security**: Secure cookies, CSRF protection, and proper session management

## Project Structure
- **Monorepo**: Single repository with client, server, and shared code
- **Client**: React application in `/client` directory
- **Server**: Express API in `/server` directory  
- **Shared**: Common types and schemas in `/shared` directory
- **Build**: Separate build processes for client (Vite) and server (esbuild)

# External Dependencies

## Database Services
- **Neon**: Serverless PostgreSQL database hosting
- **Connection**: WebSocket-based connection with fallback support

## Authentication Services
- **Replit Auth**: OpenID Connect provider for user authentication
- **Session Store**: PostgreSQL-based session persistence

## UI Component Libraries
- **Radix UI**: Accessible UI primitives for complex components
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework

## Development Tools
- **TypeScript**: Type safety across the entire stack
- **Drizzle Kit**: Database migration and introspection tools
- **Vite**: Fast development server with HMR for frontend
- **esbuild**: Fast bundler for server-side code