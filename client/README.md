# 🌊 Aqua Stark - Frontend 🖥️  

This is the **frontend** of **Aqua Stark**, a Web3 aquarium game built with **React, Vite, and TailwindCSS**. It provides an interactive interface for managing and customizing virtual aquariums.  

## 🚀 Features  
✔️ **Dynamic aquarium customization** with fish, decorations, and expansions.  
✔️ **Seamless Web3 integration** with StarkNet wallets.  
✔️ **Optimized UI** with TailwindCSS and responsive design.  
✔️ **Fast and modular architecture** using Vite.  

## 🛠️ Tech Stack  
- **Framework**: React + Vite  
- **Styling**: TailwindCSS  
- **State Management**: Context API + Zustand
- **Testing**: Vitest + React Testing Library
- **Package Manager**: pnpm  
- **Alias Support**: Uses `@/` instead of relative paths  

## 📂 Project Structure  
```sh
/client
│── /public                 # Static assets (images, icons)
│── /src
│   ├── /components         # Reusable React components
│   │   ├── /ui            # Base UI components (Button, Card, etc.)
│   │   ├── /aquarium      # Aquarium-related components
│   │   ├── /game          # Game interface components
│   │   ├── /market        # Trading marketplace components
│   │   ├── /mini-games    # Mini-game implementations
│   │   └── ...
│   ├── /pages             # Main application routes/screens
│   ├── /hooks             # Custom React hooks
│   ├── /store             # Zustand state management
│   ├── /lib               # Utility libraries
│   ├── /data              # Mock data and configurations
│   ├── /types             # TypeScript type definitions
│   └── /test              # Test setup and utilities
│── .gitignore
│── package.json
│── pnpm-lock.yaml
│── vite.config.ts          # Vite build configuration
│── vitest.config.ts        # Vitest test configuration
│── tailwind.config.js     # TailwindCSS configuration
│── tsconfig.json          # TypeScript configuration
│── dojoConfig.ts          # Dojo/StarkNet configuration
│── README.md
```
## 📦 Installation & Running  

### Prerequisites
Before starting the frontend, ensure you have:
- **Local blockchain running** (Katana + Torii)
- **Contracts deployed** (sozo migrate completed)
- **Backend server running** (optional, for full functionality)

### 1️⃣ Navigate to the Client Directory  
Before installing dependencies, make sure you are in the correct directory:  
```sh
cd client
```

### 2️⃣ Install Dependencies  
Make sure you have **pnpm** installed. If not, install it globally:  
```sh
npm install -g pnpm  
```
Now, install the project dependencies:  

```sh
pnpm install  
```

### 3️⃣ Configure Environment Variables
Copy the environment template and update with your local settings:
```sh
cp .env.example .env
# Edit .env with your local blockchain addresses
```

### 4️⃣ Start the Development Server  
Run the following command to start the frontend in development mode:  

```sh
pnpm dev  
```

The application will be available at http://localhost:5173/ (default Vite port).

### 🔗 Connecting to Local Blockchain

The frontend connects to local blockchain services:

- **Katana RPC**: `http://localhost:5050` (StarkNet devnet)
- **Torii Indexer**: `http://localhost:8080` (GraphQL endpoint)
- **World Address**: Your deployed contract address

For complete setup instructions, see the [Local Development Guide](../docs/local-development.md).

## 🧪 Testing  

The project uses **Vitest** and **React Testing Library** for comprehensive testing:

### Run Tests
```sh
# Run all tests once
pnpm test

# Run tests in watch mode (reruns on file changes)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Open Vitest UI for interactive testing
pnpm test:ui
```

### Test Coverage
- **Minimum Coverage**: 15% configured in `vitest.config.ts`
- **Hook Testing**: Game logic tests for food systems, fish movement, and aquarium management
- **Component Testing**: UI component tests for Button, Card, MetricDisplay, etc.
- **CI Integration**: Tests run automatically on PRs and pushes

### Writing Tests
- Place test files next to the component/hook being tested
- Use `.test.ts` or `.test.tsx` extension
- Follow the existing test patterns in `/src/hooks/` and `/src/components/ui/`  

## 🔄 Code Guidelines  
- **Component & file naming**: Use **kebab-case** for consistency.  
- **Import paths**: Always use `@/` instead of relative paths.  

✅ Example:  
```ts
import FishCard from '@/components/fish-card';  
```
❌ Avoid:  
```ts
import FishCard from '../../components/FishCard';  
```

🎮 **Get ready to build and expand your aquarium in Aqua Stark!** 🐠🚀  
