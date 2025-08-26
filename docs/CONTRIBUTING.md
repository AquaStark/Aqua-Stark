
# Contributing to Aqua Stark 🐠

Thank you for your interest in contributing to **Aqua Stark**! 🎮
We’re building a Web3 game on **StarkNet** where players can collect, raise, and evolve fish in a decentralized ecosystem.  

This guide explains everything you need to set up the project locally, follow our conventions, and submit high-quality contributions. Whether you’re fixing a typo or building a new feature, this document will help you get started.

---

## Table of Contents
1. [Code of Conduct](#-code-of-conduct)
2. [Ways to Contribute](#-ways-to-contribute)
3. [Project Setup](#-project-setup)
4. [Development Workflow](#-development-workflow)
5. [Branching Strategy](#-branching-strategy)
6. [Commit Messages](#-commit-messages)
7. [Pull Request Process](#-pull-request-process)
8. [Coding Style](#-coding-style)
9. [Testing Guidelines](#-testing-guidelines)
10. [Troubleshooting](#-troubleshooting)
11. [Getting Help](#-getting-help)

---

## Code of Conduct
By contributing, you agree to uphold our [Code of Conduct](./CODE_OF_CONDUCT.md).  
Please be respectful, inclusive, and constructive in all interactions.  

---

## Ways to Contribute
You can help improve Aqua Stark in many ways:
- Reporting bugs and suggesting improvements  
- Fixing issues and writing code  
- Improving documentation and tutorials  
- Adding tests and enhancing code quality  
- Sharing feedback about gameplay or usability  

Every contribution counts! 

---

## Project Setup

### Prerequisites
Make sure you have the following installed:
- **Node.js** 20+
- **pnpm** 10.13.1+
- **Git**

### Cloning and Installing

# Fork the repository (on GitHub)
git fork https://github.com/AquaStark/Aqua-Stark.git

# Clone your fork locally
git clone https://github.com/YOUR_USERNAME/Aqua-Stark.git
cd Aqua-Stark

# Install all dependencies
pnpm install
````

### Running the Project

From the repository root, you can run:

```
pnpm dev         # Run frontend dev server
pnpm lint        # Run linter across all packages
pnpm typecheck   # Run type checks
pnpm build       # Build all packages
pnpm test        # Run tests
pnpm test:coverage  # Run tests with coverage
pnpm format      # Format code
pnpm format:check # Check code formatting
```

👉 You can also target specific packages:


pnpm --filter client dev      # Frontend only
pnpm --filter backend dev     # Backend only


---

## Development Workflow

1. *Fork the repo to your own GitHub account.
2. *Clone your fork locally.
3. *Create a new branch for your work.
4. *Make changes and commit them with clear messages.
5. *Push your branch to your fork.
6. *Open a Pull Request (PR) to the main repo.


---

## Branching Strategy

We follow a simple naming convention for branches:

* feat/feature-name → For new features
* fix/bug-name → For bug fixes
* chore/task-name → For maintenance or refactoring
* docs/documentation-change → For documentation updates

Examples:

git checkout -b feat/fish-breeding-ui
git checkout -b fix/login-bug


---


## 📝 Commit Messages

We use (https://www.conventionalcommits.org/) to keep our history clean and meaningful.

Format:

<type>: <short description>


Types:

* feat: A new feature
* fix: A bug fix
* chore: Maintenance, build tasks, or refactors
* docs: Documentation changes
* test: Adding or modifying tests
* style: Code style/formatting changes (non-functional)

Examples:

* feat: add fish evolution logic
* fix: resolve crash when breeding rare fish
* docs: update README with setup instructions


---


## Pull Request Process

When you’re ready to submit your changes:

1. Ensure your branch is up-to-date with `main`.
2. Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` to confirm everything passes.
3. Push your branch to your fork:
   git push origin feat/fish-breeding-ui
   
4. Open a Pull Request against the main repo.

5. In the PR description:

   * Explain what the change does.
   * Describe why it’s needed.
   * Add screenshots, logs, or tests if relevant.

Our maintainers will review your PR and may request changes. Don’t worry — collaboration is part of the process!


---


## Coding Style

To keep the project consistent:

* Use **TypeScript** conventions in frontend and backend.
* Follow **ESLint** and **Prettier** formatting.
* Keep functions modular and well-documented.
* Add comments for complex logic, especially in *smart contracts*.

Run these before committing:


pnpm lint
pnpm format


---


## Testing Guidelines

* All new features should include tests when possible.
* Run tests with:

  pnpm test

* Use {pnpm test:coverage} to check overall coverage.
* Keep tests focused and descriptive.

---

## Troubleshooting


### pnpm Store Issues


pnpm store prune
pnpm install


### Lockfile Conflicts

rm pnpm-lock.yaml
rm -rf node_modules
rm -rf client/node_modules
rm -rf backend/node_modules
pnpm install


### Build Issues

Always build from the root:

pnpm build


---

## 💬 Getting Help

If you have questions:

* Open a GitHub **Discussion** or **Issue**.
* Tag your PR with `help wanted` if you’re stuck.
* Reach out to the maintainers via project channels.


🐠 Thank you for helping improve Aqua Stark!
Your contributions make the project stronger and the game more fun for everyone. 🚀
