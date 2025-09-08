# Prettier Configuration

This project uses Prettier for consistent code formatting across the codebase.

## Configuration Files

- `.prettierrc` - Main Prettier configuration
- `.prettierignore` - Files to ignore during formatting
- `client/.prettierignore` - Client-specific ignore rules

## Available Scripts

### Root Directory
```bash
# Format all files
pnpm format

# Check formatting without making changes
pnpm format:check

# Format using workspace command
pnpm -w format:check
```

### Client Directory
```bash
cd client

# Format client files
pnpm format

# Check client formatting
pnpm format:check
```

## CI Integration

The project includes Prettier checks in CI workflows:

- `.github/workflows/client.yml` - Frontend-specific CI with format checks
- `.github/workflows/aqua_stark.yml` - Combined CI with both contracts and frontend checks

## Pre-commit Setup

To ensure code is always formatted before commits, consider setting up a pre-commit hook:

1. Install husky: `pnpm add -D husky`
2. Add to package.json scripts:
   ```json
   "prepare": "husky install",
   "pre-commit": "pnpm format:check"
   ```
3. Create pre-commit hook: `npx husky add .husky/pre-commit "pnpm pre-commit"`

## IDE Integration

### VS Code
1. Install Prettier extension
2. Enable "Format on Save" in settings
3. Set Prettier as default formatter

### Other IDEs
Most IDEs support Prettier integration. Check your IDE's documentation for setup instructions.

## Configuration Details

The current Prettier configuration includes:
- Single quotes for strings
- Semicolons at the end of statements
- 80 character line width
- 2 spaces for indentation
- Trailing commas in objects and arrays
- JSX single quotes enabled
