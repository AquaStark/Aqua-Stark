# 🛠️ Aqua Stark - Troubleshooting Guide

This guide helps you resolve common issues when setting up and developing Aqua Stark locally.

## 📋 Quick Navigation

- [Setup Issues](#setup-issues)
- [Blockchain Issues](#blockchain-issues)
- [Frontend Issues](#frontend-issues)
- [Backend Issues](#backend-issues)
- [Environment Issues](#environment-issues)
- [Performance Issues](#performance-issues)
- [Platform-Specific Issues](#platform-specific-issues)

## 🔧 Setup Issues

### Issue: "Command not found" errors

**Symptoms**: `sozo: command not found`, `katana: command not found`, etc.

**Solutions**:

1. **Check PATH configuration**:
```bash
echo $PATH
which sozo
which katana
which torii
```

2. **Reinstall Dojo tools**:
```bash
curl -L https://install.dojoengine.org | bash
export PATH="$HOME/.dojo/bin:$PATH"
```

3. **Add to shell profile** (add to `~/.bashrc`, `~/.zshrc`, or `~/.profile`):
```bash
export PATH="$HOME/.dojo/bin:$PATH"
```

### Issue: pnpm install fails

**Symptoms**: Dependency installation errors, lockfile conflicts

**Solutions**:

1. **Clear cache and reinstall**:
```bash
pnpm store prune
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install --force
```

2. **Check Node.js version**:
```bash
node --version  # Should be 20+
pnpm --version  # Should be 10.13.1+
```

3. **Update pnpm**:
```bash
npm install -g pnpm@latest
```

### Issue: Rust/Cairo installation problems

**Symptoms**: `cargo: command not found`, Scarb build failures

**Solutions**:

1. **Reinstall Rust**:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

2. **Reinstall Scarb**:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh
```

3. **Check versions**:
```bash
rustc --version
cargo --version
scarb --version
```
