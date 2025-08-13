# Aqua Stark Deployment Guide

This guide covers the parameterized deployment system for Aqua Stark smart contracts using Dojo on Starknet.

## Overview

The deployment system supports:
- 🏗️ **Environment-based deployments** (dev/sepolia)
- 🔒 **Secure credential management** with .env files
- 🧪 **Dry-run mode** for safe testing
- 📊 **Verbose logging** options
- ⚡ **Multiple deployment methods** (scripts/Scarb)

## Quick Start

### 1. Setup Environment

Copy the appropriate environment file template:

```bash
# For local development
cp .env.dev.example .env.dev

# For sepolia testnet
cp .env.sepolia.example .env.sepolia
```

### 2. Configure Credentials

Edit `.env.sepolia` with your actual credentials:

```bash
# Replace with your actual account address and private key
DOJO_ACCOUNT_ADDRESS=0x1234...
DOJO_PRIVATE_KEY=0xabcd...
```

### 3. Deploy

```bash
# Dry run first (recommended)
./migrate.sh --profile sepolia --dry-run

# Actual deployment
./migrate.sh --profile sepolia
```

## Environment Variables

### Required for Sepolia Deployment

| Variable | Description | Example |
|----------|-------------|---------|
| `DOJO_ACCOUNT_ADDRESS` | Your Starknet account address | `0x1234...` |
| `DOJO_PRIVATE_KEY` | Your account's private key | `0xabcd...` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `STARKNET_RPC_URL` | Custom RPC endpoint | Uses profile default |
| `DOJO_WORLD_ADDRESS` | Deployed world address | Set after deployment |

## Deployment Methods

### Method 1: Enhanced Shell Script (Recommended)

The `migrate.sh` script provides the most features and safety checks.

```bash
# Show help
./migrate.sh --help

# Development deployment (local katana)
./migrate.sh --profile dev

# Sepolia dry run (build and inspect only)
./migrate.sh --profile sepolia --dry-run

# Sepolia deployment with verbose output
./migrate.sh --profile sepolia --verbose

# Quick sepolia deployment
./migrate.sh --profile sepolia
```

### Method 2: Scarb Scripts

Use the predefined scripts in `Scarb.toml` (these now call `migrate.sh` internally):

```bash
# Development (calls ./migrate.sh --profile dev)
scarb run dev

# Sepolia deployment (calls ./migrate.sh --profile sepolia)  
scarb run sepolia

# Dry run (calls ./migrate.sh --profile sepolia --dry-run)
scarb run sepolia-dry

# Build only
scarb run sepolia-build
```

**Note:** The Scarb scripts for `dev`, `sepolia`, and `sepolia-dry` now use the enhanced `migrate.sh` script internally, which automatically loads the appropriate `.env` files. This ensures consistent behavior and security across all deployment methods.

## Safety Features

### 🔒 Credential Protection

- Environment files are auto-excluded from git
- Private keys are never exposed in command line arguments
- Environment variables are used securely (sozo reads DOJO_ACCOUNT_ADDRESS and DOJO_PRIVATE_KEY)
- Automatic cleanup on script exit

### 🧪 Dry Run Mode

Always test first with dry run:

```bash
./migrate.sh --profile sepolia --dry-run
```

This will:
- ✅ Clean previous builds
- ✅ Build the project
- ✅ Inspect contracts
- ❌ Skip actual deployment

### ⚠️ Pre-deployment Validation

The script validates:
- Profile selection (dev/sepolia)
- Required environment variables
- Credential format and presence

## Deployment Profiles

### Development Profile (`dev`)

- **Target**: Local Katana node
- **RPC**: `http://localhost:5050`
- **Account**: Default Katana account (seed=0)
- **Credentials**: Pre-configured, no setup needed

**Prerequisites:**
```bash
# Start Katana in another terminal
katana --dev --dev.no-fee
```

### Sepolia Profile (`sepolia`)

- **Target**: Starknet Sepolia testnet
- **RPC**: `https://free-rpc.nethermind.io/sepolia-juno/v0_7`
- **Account**: Your own account
- **Credentials**: Must be configured

**Prerequisites:**
- Funded Sepolia account
- Account private key and address

## Post-Deployment

After successful deployment:

1. **Save the World Address** - Copy from deployment output
2. **Update Client Config** - Configure your frontend
3. **Start Torii Indexer**:
   ```bash
   torii --world <WORLD_ADDRESS> --http.cors_origins "*"
   ```

## Troubleshooting

### Common Issues

**❌ "Environment file not found"**
```bash
# Solution: Copy the example file
cp .env.sepolia.example .env.sepolia
# Then edit with your credentials
```

**❌ "DOJO_ACCOUNT_ADDRESS is required"**
```bash
# Solution: Set in .env.sepolia
DOJO_ACCOUNT_ADDRESS=0x1234...
DOJO_PRIVATE_KEY=0xabcd...
```

**❌ "Profile must be 'dev' or 'sepolia'"**
```bash
# Solution: Use correct profile name
./migrate.sh --profile sepolia  # ✅
./migrate.sh --profile testnet  # ❌
```

### Debug Mode

Enable verbose output for troubleshooting:

```bash
./migrate.sh --profile sepolia --verbose --dry-run
```

## Security Best Practices

### 🔑 Private Key Management

- **Never** commit `.env.*` files (except `.example`)
- Use hardware wallets or key management systems
- Rotate keys periodically
- Use different keys for different environments

### 🌐 RPC Endpoints

- Use trusted RPC providers
- Consider rate limits for free endpoints
- Have backup RPC endpoints ready

### 📝 Access Control

- Limit deployment access to authorized personnel
- Use CI/CD with secret management for production
- Review all configuration changes

## Advanced Usage

### Custom RPC Endpoint

```bash
# In .env.sepolia
STARKNET_RPC_URL=https://your-custom-rpc.com/v1
```

### CI/CD Integration

```bash
# Example GitHub Actions usage
- name: Deploy to Sepolia
  env:
    DOJO_ACCOUNT_ADDRESS: ${{ secrets.SEPOLIA_ACCOUNT }}
    DOJO_PRIVATE_KEY: ${{ secrets.SEPOLIA_PRIVATE_KEY }}
  run: ./migrate.sh --profile sepolia
```

### Multiple Deployments

Each deployment creates a unique world. To deploy multiple instances:

1. Change the `seed` in `dojo_sepolia.toml`
2. Run deployment
3. Note the different World address

## Support

For deployment issues:
- Check the [Dojo Documentation](https://dojoengine.org/)
- Review script output with `--verbose` flag
- Verify network connectivity and RPC endpoints
- Ensure account has sufficient balance for gas fees

---

**⚡ Quick Reference:**

```bash
# Copy environment file
cp .env.sepolia.example .env.sepolia

# Edit credentials (required!)
# DOJO_ACCOUNT_ADDRESS=0x...
# DOJO_PRIVATE_KEY=0x...

# Test deployment
./migrate.sh --profile sepolia --dry-run

# Deploy for real
./migrate.sh --profile sepolia
```