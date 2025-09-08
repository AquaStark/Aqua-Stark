# Contributing to Aqua Stark 🐠

Thank you for your interest in contributing to **Aqua Stark**! 🎮
We’re building a Web3 game on **StarkNet** where players can collect, raise, and evolve fish in a decentralized ecosystem.

This guide explains everything you need to set up the project locally, follow our conventions, and submit high‑quality contributions. Whether you’re fixing a typo or building a new feature, this document will help you get started.

---

## Table of Contents

- [Contributing to Aqua Stark 🐠](#contributing-to-aqua-stark-)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [Ways to Contribute](#ways-to-contribute)
  - [Project Setup](#project-setup)
    - [Prerequisites](#prerequisites)
    - [Cloning and Installing](#cloning-and-installing)
    - [Running the Project](#running-the-project)
  - [Development Workflow](#development-workflow)
  - [Branching Strategy](#branching-strategy)
  - [📝 Commit Messages](#-commit-messages)
  - [Pull Request Process](#pull-request-process)
  - [🔒 Dependency Updates \& Security](#-dependency-updates--security)
    - [What runs automatically](#what-runs-automatically)
    - [Merge policy for dependency bumps (Dependabot)](#merge-policy-for-dependency-bumps-dependabot)
  - [Coding Style](#coding-style)
  - [Testing Guidelines](#testing-guidelines)
  - [Troubleshooting](#troubleshooting)
    - [pnpm Store Issues](#pnpm-store-issues)
    - [Lockfile Conflicts](#lockfile-conflicts)
    - [Build Issues](#build-issues)
  - [🏗️ Architecture Decisions](#️-architecture-decisions)
  - [💬 Getting Help](#-getting-help)

---

## Code of Conduct

By contributing, you agree to uphold our [Code of Conduct](../CODE_OF_CONDUCT.md).
Please be respectful, inclusive, and constructive in all interactions.

---

## Ways to Contribute

You can help improve Aqua Stark in many ways:

* Reporting bugs and suggesting improvements
* Fixing issues and writing code
* Improving documentation and tutorials
* Adding tests and enhancing code quality
* Sharing feedback about gameplay or usability

Every contribution counts!

---

## Project Setup

### Prerequisites

Make sure you have the following installed:

* **Node.js** 20+
* **pnpm** 10.13.1+
* **Git**

### Cloning and Installing

**Option A (recommended): GitHub CLI**

```bash
gh repo fork AquaStark/Aqua-Stark --clone=true
cd Aqua-Stark
pnpm install
```

**Option B: Fork via GitHub UI**

```bash
git clone git@github.com:YOUR_USERNAME/Aqua-Stark.git
cd Aqua-Stark
pnpm install
```

### Running the Project

From the repository root:

```bash
pnpm dev          # Run frontend dev server
pnpm lint         # Lint across all packages
pnpm typecheck    # Type checks
pnpm build        # Build all packages
pnpm test         # Run tests
pnpm test:coverage  # Run tests with coverage
pnpm format       # Format code
pnpm format:check # Check formatting
```

Target specific packages:

```bash
pnpm --filter client dev      # Frontend only
pnpm --filter backend dev     # Backend only
```

---

## Development Workflow

1. Fork the repo to your own GitHub account.
2. Clone your fork locally.
3. Create a new branch for your work.
4. Make changes and commit them with clear messages.
5. Push your branch to your fork.
6. Open a Pull Request (PR) to the main repo.

---

## Branching Strategy

We follow a simple naming convention for branches:

* `feat/feature-name` → new features
* `fix/bug-name` → bug fixes
* `chore/task-name` → maintenance or refactoring
* `docs/documentation-change` → documentation updates

Examples:

```bash
git checkout -b feat/fish-breeding-ui
git checkout -b fix/login-bug
```

---

## 📝 Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/).

**Format:**

```
<type>: <short description>
```

**Types:**

* `feat`: A new feature
* `fix`: A bug fix
* `chore`: Maintenance, build tasks, or refactors
* `docs`: Documentation changes
* `test`: Adding or modifying tests
* `style`: Code style/formatting changes (non‑functional)

**Examples:**

* `feat: add fish evolution logic`
* `fix: resolve crash when breeding rare fish`
* `docs: update README with setup instructions`

---

## Pull Request Process

When you’re ready to submit your changes:

1. Ensure your branch is up‑to‑date with `main`.
2. Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` to confirm everything passes.
3. Push your branch to your fork:

   ```bash
   git push origin feat/fish-breeding-ui
   ```
4. Open a Pull Request against the main repo.
5. In the PR description:

   * Explain what the change does.
   * Describe why it’s needed.
   * Add screenshots, logs, or tests if relevant.

Maintainers will review your PR and may request changes. Collaboration is part of the process!

---

## 🔒 Dependency Updates & Security

This repository uses **Dependabot** for automated dependency updates and **CodeQL** for static code scanning.

### What runs automatically

* **Dependabot** opens weekly PRs to update dependencies in:

  * `./` (root, `pnpm-lock.yaml`)
  * `./client`
  * `./backend`
  * **GitHub Actions** in `.github/workflows`
* **CodeQL** runs on every PR and on `main` (plus a weekly scheduled scan).

### Merge policy for dependency bumps (Dependabot)

**Minimum requirements (always):**

1. ✅ CI green (lint/typecheck/build/tests as applicable).
2. ✅ **No new high‑severity CodeQL alerts** introduced by the PR.
3. ✅ Builds successfully from the repo root:

   ```bash
   pnpm -w install
   pnpm -w -r build
   ```

**Auto‑merge allowed (if the minimum requirements are met):**

* `patch` and `minor` updates to **devDependencies** (e.g., eslint, vite, types, testing libs).
* `patch`/`minor` updates to **GitHub Actions**.

**Human review required (no auto‑merge):**

* Any **major** update.
* Changes affecting core or security‑sensitive libraries:
  `react*`, `express`, `vite`, `tailwindcss`, `zustand`, `ws`, `jsonwebtoken`, `helmet`, `cors`, or equivalents.
* PRs that introduce new security alerts (CodeQL or GitHub Advisory).

**Quick checklist before merging:**

* [ ] Change type: `patch` | `minor` | `major`
* [ ] CI is green (lint/typecheck/build/tests)
* [ ] No new high‑severity CodeQL alerts
* [ ] Root build OK (`pnpm -w -r build`)
* [ ] (If applicable) quick smoke test of the affected package

**Monorepo notes (pnpm):**

* Dependabot uses `package-ecosystem: npm` but respects `pnpm-lock.yaml`.
* When adding new workspaces, also add their directories to `updates` in `.github/dependabot.yml`.

**Repository settings (recommended):**

* Enable **branch protection** on `main` requiring green checks (CI + CodeQL).
* Enable **Allow auto‑merge** for the repository.
* Use **CODEOWNERS** so that “major” bumps request review from the appropriate team.

**(Optional) Pull Request template**
Create `.github/pull_request_template.md` with:

```md
### Update type
- [ ] patch
- [ ] minor
- [ ] major

### Validations
- [ ] CI green (lint/typecheck/build/tests)
- [ ] No new high‑severity CodeQL alerts
- [ ] `pnpm -w install && pnpm -w -r build` OK

### Does this touch core or security‑sensitive libs?
- [ ] Yes (React/Express/Vite/Tailwind/Zustand/ws/JWT/Helmet/CORS/…)
- [ ] No

### Notes
Briefly describe impact, breaking changes (if any), and test steps.
```

---

## Coding Style

To keep the project consistent:

* Use **TypeScript** conventions in frontend and backend.
* Follow **ESLint** and **Prettier** formatting.
* Keep functions modular and well‑documented.
* Add comments for complex logic, especially in *smart contracts*.

Before committing:

```bash
pnpm lint
pnpm format
```

---

## Testing Guidelines

* New features should include tests when possible.
* Run tests with:

  ```bash
  pnpm test
  ```
* Use `pnpm test:coverage` to review coverage.
* Keep tests focused and descriptive.

---

## Troubleshooting

### pnpm Store Issues

```bash
pnpm store prune
pnpm install
```

### Lockfile Conflicts

```bash
rm pnpm-lock.yaml
rm -rf node_modules
rm -rf client/node_modules
rm -rf backend/node_modules
pnpm install
```

### Build Issues

Always build from the root:

```bash
pnpm build
```

---

## 🏗️ Architecture Decisions

When making significant architectural changes or proposing new technologies:

* Review existing [Architecture Decision Records (ADRs)](docs/adr/README.md)
* Create a new ADR using the [template](docs/adr/template.md) for major changes
* Follow the ADR process: Proposed → Review → Accepted → Implementation
* Update existing ADRs if they become deprecated or superseded

---

## 💬 Getting Help

If you have questions:

* Open a GitHub **Discussion** or **Issue**.
* Tag your PR with `help wanted` if you’re stuck.
* Reach out to the maintainers via project channels.

🐠 Thank you for helping improve Aqua Stark!
Your contributions make the project stronger and the game more fun for everyone. 🚀
