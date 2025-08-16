# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Aqua Stark is a Web3 game on StarkNet where players collect, raise and evolve fish in a decentralized ecosystem. It's built as a monorepo using pnpm workspaces with three main components:

- **client**: React frontend with Vite, TypeScript, and TailwindCSS
- **backend**: Node.js API server with Express, Supabase, and WebSocket support
- **contract/aqua_contract**: Cairo smart contracts using Dojo Engine v1.5.0

## Development Commands

All commands should be run from the repository root unless specified otherwise.

### Primary Commands
```bash
# Install all dependencies
pnpm install

# Start frontend development server
pnpm dev

# Build all packages
pnpm build

# Run linting for frontend
pnpm lint

# Run linting for backend specifically  
pnpm lint:backend

# Run TypeScript type checking
pnpm typecheck

# Format code across all packages
pnpm format

# Check code formatting
pnpm format:check

# Run tests (currently disabled in frontend)
pnpm test
```

### Package-Specific Commands
```bash
# Frontend only
pnpm --filter client dev
pnpm --filter client build
pnpm --filter client lint

# Backend only  
pnpm --filter backend dev
pnpm --filter backend test
pnpm --filter backend start
```

### Smart Contract Commands
```bash
cd aqua_contract

# Local development deployment
scarb run dev

# Sepolia testnet deployment
scarb run sepolia

# Dry-run mode for sepolia
scarb run sepolia-dry

# Build only for sepolia
scarb run sepolia-build
```

## Architecture Overview

### Frontend (client/)
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: TailwindCSS with custom animations
- **State Management**: Zustand for local state, Dojo SDK for blockchain state
- **Blockchain Integration**: Dojo Engine SDK, StarkNet React, Cartridge Connector
- **Key Libraries**: Framer Motion, Radix UI components, React Router DOM

**Important Files:**
- `dojoConfig.ts`: Dojo configuration pointing to Sepolia testnet
- `src/DojoContext.tsx`: Main Dojo provider and context
- `src/useSystemCalls.ts`: Blockchain interaction layer
- `src/types/`: TypeScript type definitions for game entities

### Backend (backend/)
- **Framework**: Node.js + Express
- **Database**: Supabase PostgreSQL
- **Caching**: Redis
- **Real-time**: WebSocket support for live game updates
- **Testing**: Jest with coverage reporting

**Key Services:**
- `src/services/`: Core business logic (aquarium, fish, player management)
- `src/controllers/`: API endpoint handlers
- `src/websocket/`: Real-time game communication

### Smart Contracts (aqua_contract/)
- **Language**: Cairo 2.10.1
- **Framework**: Dojo Engine v1.5.0
- **Deployment**: Sepolia testnet via Cartridge

**Core Systems:**
- `src/systems/AquaStark.cairo`: Main game logic
- `src/models/`: Game entity definitions (fish, aquarium, player)
- `src/interfaces/`: Contract interfaces

## Key Development Patterns

### Frontend State Management
- Use Zustand stores for UI state (`src/store/`)
- Use Dojo hooks for blockchain state (`src/hooks/dojo/`)
- Component structure follows feature-based organization

### Blockchain Integration
- All contract interactions go through `useSystemCalls.ts`
- Dojo entities are typed in `src/types/dojo.ts`
- Generated types are in `src/typescript/` (auto-generated, don't edit)

### Styling Conventions
- TailwindCSS with custom design system
- Component variants using `class-variance-authority`
- Consistent use of Radix UI primitives

## Testing Strategy

- Frontend tests are currently disabled (focusing on development)
- Backend uses Jest with coverage reporting
- Smart contracts use Cairo test framework
- Manual testing guides in individual package READMs

## Environment Configuration

- Frontend connects to Sepolia testnet via Cartridge
- Backend requires Supabase and Redis configuration
- Smart contracts deploy to local Katana (dev) or Sepolia (production)

## Known Patterns

### Component Organization
Components are organized by feature/page with shared UI components in `src/components/ui/`

### Type Safety
Heavy use of TypeScript throughout with generated types from smart contracts

### Performance
- React.memo and useMemo used for expensive operations
- Lazy loading for route components
- Efficient state updates with Zustand and Immer