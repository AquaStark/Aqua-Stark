# ADR-0001: Initial Architecture Decisions

## Status
Accepted

## Context
Aqua-Stark is a Web3 game built on StarkNet where players collect, raise, and evolve fish in a decentralized ecosystem. The project requires a robust, scalable architecture that can handle real-time game mechanics, blockchain interactions, and a modern user experience.

## Decision
We have adopted the following foundational architecture decisions:

### 1. Dojo Engine for Game Logic
- **Technology**: Dojo Engine (Cairo-based game engine for StarkNet)
- **Rationale**: 
  - Native StarkNet integration with Cairo smart contracts
  - Optimized for on-chain game mechanics and state management
  - Built-in support for autonomous worlds and decentralized gaming
  - Strong community and documentation support

### 2. Monorepo Structure with pnpm Workspaces
- **Structure**: 
  ```
  /client          # React frontend
  /backend         # Node.js API server
  /contract        # Dojo smart contracts
  ```
- **Package Manager**: pnpm with workspace configuration
- **Rationale**:
  - Shared dependencies and tooling
  - Atomic commits across frontend, backend, and contracts
  - Simplified CI/CD pipeline
  - Better dependency management and version control

### 3. Frontend Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: TailwindCSS for utility-first styling
- **State Management**: Zustand for lightweight state management
- **Routing**: React Router DOM for client-side routing
- **UI Components**: Radix UI for accessible, unstyled components
- **Blockchain Integration**: 
  - @dojoengine/sdk for Dojo interactions
  - @starknet-react/core for StarkNet wallet integration
  - @cartridge/connector for wallet connectivity

### 4. Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: Supabase (PostgreSQL) for relational data
- **Caching**: Redis for session management and real-time features
- **Real-time**: WebSocket support for live game updates
- **Authentication**: JWT-based authentication system

### 5. Smart Contract Architecture
- **Language**: Cairo for StarkNet compatibility
- **Framework**: Dojo Engine with component-based architecture
- **Structure**:
  - Entities: Game objects (fish, aquariums, players)
  - Components: Data structures for game state
  - Systems: Game logic and business rules
  - Models: Complex data structures and relationships

### 6. Development Workflow
- **Version Control**: Git with conventional commit messages
- **Testing**: Jest for backend, Vitest for frontend
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier for consistent code style
- **Type Safety**: TypeScript throughout the stack

## Consequences

### Positive
- **Scalability**: Dojo Engine provides horizontal scaling for game mechanics
- **Developer Experience**: Modern tooling and fast development cycles
- **Type Safety**: End-to-end TypeScript reduces runtime errors
- **Performance**: Vite provides fast hot reload and optimized builds
- **Maintainability**: Monorepo structure simplifies code sharing and updates
- **Blockchain Integration**: Native StarkNet support with Cairo contracts

### Negative
- **Learning Curve**: Dojo Engine and Cairo require specialized knowledge
- **Complexity**: Monorepo can be complex for new contributors
- **Dependencies**: Multiple technologies increase maintenance overhead
- **Blockchain Constraints**: On-chain operations have gas costs and latency

### Risks
- **Ecosystem Maturity**: Dojo Engine is relatively new and evolving
- **Talent Pool**: Cairo developers are less common than traditional web developers
- **Performance**: On-chain operations may impact user experience
- **Cost**: Gas fees for blockchain operations

## Alternatives Considered

### Game Engine Alternatives
- **Unity/Unreal**: Traditional game engines with WebGL export
  - Rejected: Limited blockchain integration, larger bundle sizes
- **Phaser.js**: JavaScript game framework
  - Rejected: No native blockchain support, requires custom integration
- **Custom Engine**: Building from scratch
  - Rejected: Significant development time, maintenance overhead

### Frontend Alternatives
- **Next.js**: Full-stack React framework
  - Rejected: Unnecessary complexity for client-side game
- **Vue.js**: Alternative frontend framework
  - Rejected: Team expertise in React, larger ecosystem for gaming
- **Vanilla JavaScript**: No framework approach
  - Rejected: Development speed and maintainability concerns

### Backend Alternatives
- **Firebase**: Backend-as-a-Service
  - Rejected: Limited control, vendor lock-in concerns
- **Django/FastAPI**: Python-based backends
  - Rejected: Team expertise in Node.js, better JavaScript ecosystem integration
- **Serverless**: AWS Lambda or similar
  - Rejected: Complexity for real-time features, cold start issues

### Smart Contract Alternatives
- **Solidity on Ethereum**: Traditional smart contract development
  - Rejected: Higher gas costs, slower transaction times
- **Move on Aptos/Sui**: Alternative blockchain platforms
  - Rejected: StarkNet's ZK-rollup benefits, Cairo's expressiveness
- **Custom L2 Solution**: Building on custom rollup
  - Rejected: Development complexity, security concerns

## Implementation Notes

### Current State
- Basic project structure established
- Dojo Engine configured with development environment
- Frontend and backend packages created
- Development tooling configured

### Next Steps
- Implement core game mechanics in Dojo
- Build frontend components and game UI
- Develop backend API endpoints
- Establish testing strategy and CI/CD pipeline

### Migration Strategy
- Incremental development with feature flags
- Comprehensive testing at each layer
- Documentation updates as architecture evolves
- Regular architecture reviews and ADR updates

## References
- [Dojo Engine Documentation](https://dojoengine.org/)
- [StarkNet Documentation](https://docs.starknet.io/)
- [Cairo Book](https://book.cairo-lang.org/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Supabase Documentation](https://supabase.com/docs)
