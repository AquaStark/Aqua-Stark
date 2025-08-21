

# 🌊Aqua Stark 🐠

**Aqua Stark** is a Web3 game on **StarkNet** where players can **collect, raise and evolve fish** in a decentralized ecosystem. 🏝️🎮

## 🚀 Features  
✔️ **Fish breeding and evolution** with unique genetics.  
✔️ **Decentralized Marketplace** to buy and sell fish and decorations.  
✔️ **True asset ownership** thanks to StarkNet and Cairo.  
✔️ **Aquarium customization** with exclusive items and expansions.  
✔️ **Special events and tournaments** with rare fish and rewards.  

## 🛠️Technologies  
- **Front**: React.js + Vite + TailwindCSS  
- **Backend**: Node.js + Express + Supabase
- **Blockchain**: Dojo Engine
- **Monorepo Management**: pnpm workspaces  

## 📂Project Architecture

```sh
/AQUA-STARK
│── /client                # Web client (frontend)
│   ├── /node_modules      # Dependencies
│   ├── /public            # Static assets
│   ├── /src               # Frontend source code
│   ├── .gitignore
│   ├── README.md          # Frontend documentation
│   ├── package.json       # Dependencies and scripts
│   ├── vite.config.ts     # Vite configuration
│── /backend               # Backend API server
│   ├── /src               # Backend source code
│   ├── /tests             # Backend tests
│   ├── package.json       # Backend dependencies
│── /contract              # Smart contracts and game logic
│   ├── /src               # Smart contract source code
│   ├── .gitignore
│   ├── README.md          # Backend documentation
│   ├── LICENSE            # Project license
│   ├── Scarb.toml         # Scarb configuration
│── pnpm-workspace.yaml    # Workspace configuration
│── pnpm-lock.yaml         # Lock file
│── package.json           # Root scripts and dev dependencies
│── README.md              # This file 🚀
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 10.13.1+

### Installation
```bash
# Clone the repository
git clone https://github.com/AquaStark/Aqua-Stark.git
cd Aqua-Stark

# Install all dependencies
pnpm install
```

### Development Commands

From the repository root, you can run these commands:

```bash
# Install dependencies for all packages
pnpm install

# Run development server for frontend
pnpm dev

# Run linting for all packages
pnpm lint

# Run type checking for all packages
pnpm typecheck

# Build all packages
pnpm build

# Run tests for all packages
pnpm test

# Run tests with coverage
pnpm test:coverage

# Format code
pnpm format

# Check code formatting
pnpm format:check
```

### Package-Specific Commands

You can also run commands for specific packages:

```bash
# Frontend only
pnpm --filter client dev
pnpm --filter client build
pnpm --filter client lint

# Backend only
pnpm --filter backend dev
pnpm --filter backend test
```

## 📖 Documentation  

🔹 Frontend README: [Frontend Documentation](https://github.com/AquaStark/Aqua-Stark-V.2/blob/main/client/README.md)  

## 🌍 Connecting to StarkNet  
To play, make sure you have a StarkNet-compatible wallet like **ArgentX** or **Braavos**. Game assets are backed by **Cairo smart contracts**, ensuring authenticity and scarcity.  

## 🤝 Contributing  
Aqua Stark is an **open-source** project! To contribute, follow these steps:  

1️⃣ **Fork the repository**  
```sh
git fork https://github.com/AquaStark/Aqua-Stark.git  
```

2️⃣ **Clone your fork**
```sh
git clone https://github.com/YOUR_USERNAME/Aqua-Stark.git  
cd Aqua-Stark  
```

3️⃣ **Install dependencies**
```sh
pnpm install
```

4️⃣ **Create a new branch**
```sh
git checkout -b feature-new  
```

5️⃣ **Make your changes and commit them**
```sh
git commit -m "feat: Add new feature"  
```

6️⃣ **Push the changes to your fork**
```sh
git push origin feature-new  
```

7️⃣ **Open a Pull Request 🚀**  

### 🔀 Branch Naming Conventions

- `feat/feature-name` → For new features  
- `fix/bug-name` → For bug fixes  
- `chore/task-name` → For maintenance or refactoring  
- `docs/documentation-change` → For documentation updates  

### 📝 Commit Message Guidelines

- `feat: add new login functionality`  
- `fix: resolve issue with fish animations`  
- `chore: refactor contract logic`  
- `docs: update README with latest changes`  

## 🔧 Troubleshooting

### pnpm Store Issues
If you encounter issues with pnpm store:
```bash
# Clear pnpm store
pnpm store prune

# Reinstall dependencies
pnpm install --force
```

### Lockfile Conflicts
If you see lockfile conflicts:
```bash
# Remove lockfile and node_modules
rm pnpm-lock.yaml
rm -rf node_modules
rm -rf client/node_modules
rm -rf backend/node_modules

# Reinstall
pnpm install
```

### Build Issues
If builds fail, ensure you're running from the repository root:
```bash
# Always run from root
pnpm build

# Not from individual packages
cd client && pnpm build  # ❌ Avoid this
```

🌊🐠 **Dive into Aqua Stark and build your dream aquarium!** 🎮🚀
