# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cash Cub is a Next.js 15 budgeting application with Auth0 authentication. The frontend communicates with an external backend API (configured via `API_BASE_URL`) to manage budgets, transactions, and analytics.

## Development Commands

**Development:**

```bash
npm run dev          # Start dev server with Turbopack
```

**Testing:**

```bash
npm test             # Run all tests with Vitest
vitest run           # Same as npm test
vitest               # Run tests in watch mode
```

**Build & Production:**

```bash
npm run build        # Build for production with Turbopack
npm start            # Start production server
```

**Code Quality:**

```bash
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## Architecture

### Directory Structure

- **`app/`** - Next.js App Router pages and layouts
  - `analytics/` - Analytics dashboard page
  - `budgets/` - Budget listing and detail pages (`[slug]` for individual budgets)
  - `error/` - Error page
  - All pages include co-located `.test.tsx` files

- **`components/`** - React components organized by purpose
  - `features/` - Feature-specific components (analytics, budgets)
  - `layout/` - App layout components (Header, Footer)
  - `ui/` - Shared UI components (AddTransactionModal, Transactions)

- **`hooks/`** - Custom React hooks organized by feature
  - `features/analytics/` - Analytics-related hooks
  - `features/budgets/` - Budget management hooks (useBudgetSummary, useAddBudget, etc.)
  - `ui/` - UI-related hooks (useTransactions, useAddTransactionForm)

- **`lib/`** - Server-side business logic and API functions
  - `api.ts` - Core `fetchWithAuth()` wrapper for authenticated API calls
  - `auth0.ts` - Auth0 client setup and session validation utilities
  - `budgets.ts`, `transactions.ts`, `categories.ts`, `analytics.ts` - Domain-specific API functions
  - All functions are marked `"use server"`

- **`types/`** - TypeScript type definitions
  - `api.ts` - Core domain types (Budget, BudgetItem, Transaction, Category, etc.)

- **`config/`** - Application configuration
  - `theme.ts` - Material-UI theme with dark mode support

### Key Architectural Patterns

**Authentication Flow:**

- Auth0 handles authentication via `@auth0/nextjs-auth0/server`
- Middleware (`middleware.ts`) runs on all routes except static assets
- `lib/auth0.ts` provides session validation with JWT expiration checking
- All API calls use `fetchWithAuth()` which attaches the Auth0 ID token as Bearer token

**Data Fetching:**

- Server actions (`"use server"`) in `lib/` handle all external API communication
- Client components use SWR for data fetching and caching
- SWR configured globally in `app/layout.tsx` with 3s refresh interval
- Custom hooks (in `hooks/`) encapsulate SWR logic and provide clean interfaces

**Component Organization:**

- Pages in `app/` are minimal and delegate to feature components
- Feature components in `components/features/` handle specific domain logic
- Shared UI components in `components/ui/` are reusable across features
- All components have co-located test files

**Testing:**

- Vitest + React Testing Library for all tests
- Test files co-located with source files (`.test.ts`, `.test.tsx`)
- Setup in `vitest.setup.ts` includes `@testing-library/jest-dom` matchers
- MSW (Mock Service Worker) available for API mocking

### Important Implementation Details

**Path Aliases:**

- `@/*` resolves to repository root (configured in `tsconfig.json`)
- Example: `import { theme } from "@/config/theme"`

**Environment Variables:**
Required in `.env` (see `.env.example`):

- `AUTH0_DOMAIN` - Auth0 tenant domain
- `AUTH0_CLIENT_ID` - Auth0 application client ID
- `AUTH0_SECRET` - Session cookie signing secret (generate with `openssl rand -hex 32`)
- `AUTH0_CLIENT_SECRET` - Auth0 application client secret
- `APP_BASE_URL` - Application base URL (e.g., `http://localhost:3000`)
- `API_BASE_URL` - External backend API base URL (not in .env.example but required for API calls)

**Material-UI Integration:**

- Uses MUI v7 with Next.js App Router integration (`@mui/material-nextjs`)
- Theme supports CSS variables and dark mode (see `config/theme.ts`)
- `AppRouterCacheProvider` wraps app in `layout.tsx` for proper SSR

**Turbopack:**
Both `dev` and `build` scripts use `--turbopack` flag for faster builds.

## Common Development Tasks

**Running a Single Test:**

```bash
vitest run path/to/file.test.ts
```

**Building for Docker:**
The Dockerfile uses multi-stage builds with standalone output mode configured in `next.config.ts`.
