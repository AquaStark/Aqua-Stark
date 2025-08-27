# 🌊 Aqua Stark - Local Development Guide

Welcome to the Aqua Stark local development setup! This guide will help you get from repository clone to a fully running development environment in under 30 minutes.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [Verification](#verification)
5. [Development Workflow](#development-workflow)
6. [Troubleshooting](#troubleshooting)

## 🎯 Prerequisites

### System Requirements
- **Operating System**: macOS, Linux, or Windows (WSL2 recommended)
- **Node.js**: Version 20+ 
- **pnpm**: Version 10.13.1+
- **Git**: Latest version
- **Rust**: Latest stable version (for Cairo/Scarb)
- **Docker**: Optional, for containerized setup

### Installation Options

#### Option A: Using asdf (Recommended)
```bash
# Install asdf if not already installed
# macOS
brew install asdf

# Linux
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.13.1
echo '. "$HOME/.asdf/asdf.sh"' >> ~/.bashrc
echo '. "$HOME/.asdf/completions/asdf.bash"' >> ~/.bashrc

# Install plugins
asdf plugin add nodejs
asdf plugin add rust
asdf plugin add pnpm

# Install versions
asdf install nodejs 20.11.0
asdf install rust 1.75.0
asdf install pnpm 10.13.1

# Set global versions
asdf global nodejs 20.11.0
asdf global rust 1.75.0
asdf global pnpm 10.13.1
```

#### Option B: Manual Installation
```bash
# Node.js (using nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# pnpm
npm install -g pnpm@10.13.1

# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

### Install Dojo Toolchain

```bash
# Install Dojo CLI tools
curl -L https://install.dojoengine.org | bash

# Add to PATH (add to your shell profile)
export PATH="$HOME/.dojo/bin:$PATH"

# Verify installation
sozo --version
katana --version
torii --version
```

### Install Scarb (Cairo Build Tool)

```bash
# Using asdf (recommended)
asdf plugin add scarb
asdf install scarb latest
asdf global scarb latest

# Or manual installation
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh

# Verify installation
scarb --version
```

## 🚀 Quick Start

If you're familiar with the setup, here's the quick path:

```bash
# 1. Clone and setup
git clone https://github.com/AquaStark/Aqua-Stark.git
cd Aqua-Stark
pnpm install

# 2. Start local blockchain (Terminal 1)
katana --dev --dev.no-fee

# 3. Deploy contracts (Terminal 2)
cd aqua_contract
sozo build
sozo migrate

# 4. Start indexer (Terminal 3)
# Get WORLD_ADDRESS from sozo migrate output
torii --world <WORLD_ADDRESS> --http.cors_origins "*"

# 5. Start backend (Terminal 4)
cd ../backend
pnpm dev

# 6. Start frontend (Terminal 5)
cd ../client
pnpm dev
```

## 📝 Detailed Setup

### Step 1: Repository Setup

```bash
# Clone the repository
git clone https://github.com/AquaStark/Aqua-Stark.git
cd Aqua-Stark

# Install all workspace dependencies
pnpm install

# Verify installation
pnpm --version
node --version
```

### Step 2: Environment Configuration

Create environment files for each component:

#### Root Environment (`.env`)
```bash
# Copy example file
cp .env.example .env

# Edit with your local settings
nano .env
```

#### Backend Environment (`backend/.env`)
```bash
# Copy example file
cp backend/.env.example backend/.env

# Edit with your settings
nano backend/.env
```

#### Frontend Environment (`client/.env`)
```bash
# Copy example file
cp client/.env.example client/.env

# Edit with your settings
nano client/.env
```

### Step 3: Local Blockchain Setup

#### Start Katana (Local StarkNet Devnet)
```bash
# Terminal 1: Start Katana
katana --dev --dev.no-fee

# You should see output like:
# Account #0: 0x517ececd29116499f4a1b64b094da79ba08dfd54a3edaa316134c41f8160973
# Account #1: 0x35c9b55d0578068c4b6c8c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4
# ...
# Listening on 127.0.0.1:5050
```

#### Deploy Contracts
```bash
# Terminal 2: Navigate to contract directory
cd aqua_contract

# Build contracts
sozo build

# Deploy to local blockchain
sozo migrate

# Note the WORLD_ADDRESS from output
# Example: World deployed at: 0x02239f77d69e7782b73516b1e0f8ab58fbb50d4f75efa47d5bd0e83781dc1363
```

#### Start Torii (Indexer)
```bash
# Terminal 3: Start Torii with your world address
torii --world 0x02239f77d69e7782b73516b1e0f8ab58fbb50d4f75efa47d5bd0e83781dc1363 --http.cors_origins "*"

# You should see:
# Torii listening on 127.0.0.1:8080
# GraphQL endpoint: http://127.0.0.1:8080/graphql
```

### Step 4: Backend Setup

```bash
# Terminal 4: Start backend server
cd backend

# Install dependencies (if not already done)
pnpm install

# Start development server
pnpm dev

# You should see:
# Server running on http://localhost:3000
```

### Step 5: Frontend Setup

```bash
# Terminal 5: Start frontend
cd client

# Install dependencies (if not already done)
pnpm install

# Start development server
pnpm dev

# You should see:
# Local:   http://localhost:5173/
# Network: http://192.168.1.100:5173/
```

## ✅ Verification

Run through this checklist to ensure everything is working:

### 1. Dependencies Check
```bash
# Verify all tools are installed
node --version          # Should be 20+
pnpm --version          # Should be 10.13.1+
sozo --version          # Should show Dojo version
katana --version        # Should show Katana version
torii --version         # Should show Torii version
scarb --version         # Should show Scarb version
```

### 2. Blockchain Check
```bash
# Check if Katana is running
curl http://localhost:5050

# Check if Torii is running
curl http://localhost:8080/graphql
```

### 3. Services Check
```bash
# Check backend
curl http://localhost:3000/health

# Check frontend
curl http://localhost:5173
```

### 4. Contract Verification
```bash
# Check deployed world
cd aqua_contract
sozo inspect

# Should show your deployed contracts and models
```

### 5. Frontend Connection
1. Open http://localhost:5173 in your browser
2. Connect your wallet (ArgentX or Braavos)
3. Verify you can see the game interface
4. Check that blockchain interactions work

## 🔄 Development Workflow

### Daily Development Cycle

#### 1. Start Development Environment
```bash
# Terminal 1: Blockchain
katana --dev --dev.no-fee

# Terminal 2: Indexer
cd aqua_contract
torii --world <WORLD_ADDRESS> --http.cors_origins "*"

# Terminal 3: Backend
cd backend
pnpm dev

# Terminal 4: Frontend
cd client
pnpm dev
```

#### 2. Contract Development
```bash
# Make changes to contracts in aqua_contract/src/
# Rebuild and redeploy
sozo build
sozo migrate

# Run tests
sozo test
```

#### 3. Frontend Development
```bash
# Make changes to client/src/
# Hot reload should work automatically
# If not, restart with pnpm dev
```

#### 4. Backend Development
```bash
# Make changes to backend/src/
# Hot reload should work automatically
# If not, restart with pnpm dev
```

### Testing Workflow

```bash
# Contract tests
cd aqua_contract
sozo test

# Frontend tests
cd client
pnpm test

# Backend tests
cd backend
pnpm test
```

### Building for Production

```bash
# Build contracts
cd aqua_contract
sozo build --release

# Build frontend
cd client
pnpm build

# Build backend
cd backend
pnpm build
```

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### Port Conflicts
**Problem**: Ports 5050, 8080, 5173, or 3000 are already in use

**Solution**:
```bash
# Find processes using ports
lsof -i :5050
lsof -i :8080
lsof -i :5173
lsof -i :3000

# Kill processes
kill -9 <PID>

# Or use different ports
katana --dev --dev.no-fee --port 5051
torii --world <ADDRESS> --http.port 8081
```

#### Dependency Issues
**Problem**: pnpm install fails or packages are missing

**Solution**:
```bash
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install --force

# Check for version conflicts
pnpm list
```

#### Blockchain Sync Issues
**Problem**: Torii not syncing with Katana

**Solution**:
```bash
# Restart both services
# Terminal 1: Stop Katana (Ctrl+C), restart
katana --dev --dev.no-fee

# Terminal 2: Stop Torii (Ctrl+C), restart with fresh world
sozo migrate  # Get new world address
torii --world <NEW_ADDRESS> --http.cors_origins "*"
```

#### Environment Variable Issues
**Problem**: Services can't connect to each other

**Solution**:
```bash
# Verify all .env files have correct values
cat .env
cat backend/.env
cat client/.env

# Check for typos in URLs and addresses
# Ensure WORLD_ADDRESS matches sozo migrate output
```

#### Wallet Connection Issues
**Problem**: Frontend can't connect to wallet

**Solution**:
1. Ensure you have ArgentX or Braavos installed
2. Check that you're on the correct network (localhost:5050)
3. Try refreshing the page
4. Check browser console for errors

#### Build Failures
**Problem**: sozo build or pnpm build fails

**Solution**:
```bash
# For contract builds
cd aqua_contract
sozo clean
sozo build

# For frontend builds
cd client
rm -rf dist
pnpm build

# Check for TypeScript errors
pnpm typecheck
```

### Debug Commands

```bash
# Check Dojo world status
sozo inspect

# Check Torii logs
# Look for sync status and errors

# Check Katana logs
# Look for transaction processing

# Check backend logs
# Look for connection errors

# Check frontend console
# Open browser dev tools
```

### Reset Local Environment

If everything is broken, here's how to reset:

```bash
# Stop all services (Ctrl+C in all terminals)

# Reset contracts
cd aqua_contract
sozo clean
sozo build
sozo migrate

# Reset frontend
cd client
rm -rf node_modules
pnpm install

# Reset backend
cd backend
rm -rf node_modules
pnpm install

# Start fresh
# Follow the Quick Start section again
```

## 📚 Additional Resources

- [Dojo Getting Started Guide](https://dojoengine.org/getting-started)
- [Dojo Toolchain Documentation](https://dojoengine.org/getting-started/understanding-the-toolchain)
- [Dojo Book](https://book.dojoengine.org/)
- [Scarb Documentation](https://docs.swmansion.com/scarb/)
- [StarkNet Documentation](https://docs.starknet.io/)

## 🤝 Getting Help

If you're still having issues:

1. **Check the troubleshooting section above**
2. **Search existing issues** on GitHub
3. **Create a new issue** with:
   - Your operating system and versions
   - Exact error messages
   - Steps you followed
   - What you expected vs what happened

## 🎉 Success!

If you've made it this far, congratulations! You now have a fully functional Aqua Stark development environment. You can:

- ✅ Develop smart contracts with Cairo/Dojo
- ✅ Build and test the frontend
- ✅ Work on the backend API
- ✅ Deploy and interact with local blockchain
- ✅ Connect wallets and test game functionality

Happy coding! 🐠🚀
