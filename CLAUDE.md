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
- Proxy (`proxy.ts`) runs on all routes except static assets
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
- `API_BASE_URL` - External backend API base URL
- `AUTH0_SESSION_NAME` - Custom name for the Auth0 session cookie (to avoid cookie collisions)
- `AUTH0_AUDIENCE` - Auth0 API audience identifier for token validation

**Material-UI Integration:**

- Uses MUI v7 with Next.js App Router integration (`@mui/material-nextjs`)
- Theme supports CSS variables and dark mode (see `config/theme.ts`)
- `AppRouterCacheProvider` wraps app in `layout.tsx` for proper SSR

**Turbopack:**
Both `dev` and `build` scripts use `--turbopack` flag for faster builds.

## Common Development Tasks

### Running Tests

**Run a single test file:**

```bash
vitest run path/to/file.test.ts
```

**Run tests in watch mode:**

```bash
vitest
```

**Run tests with coverage:**

```bash
npm run test:coverage
```

**Run specific test by name:**

```bash
vitest run -t "test name pattern"
```

### Adding a New Feature

When adding a new feature, follow this pattern:

1. **Define types** in `types/api.ts`
2. **Create server action** in `lib/` (e.g., `lib/feature.ts`)
3. **Create custom hook** in `hooks/features/` to wrap SWR
4. **Create UI components** in `components/features/`
5. **Add tests** co-located with each file
6. **Create page** in `app/` if needed

**Example: Adding a new "Goals" feature**

```typescript
// 1. types/api.ts
export interface Goal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
}

// 2. lib/goals.ts
"use server";
import { fetchWithAuth } from "./api";

export async function getGoals() {
  return fetchWithAuth<Goal[]>("/goals");
}

// 3. hooks/features/goals/useGoals.ts
import useSWR from "swr";
import { getGoals } from "@/lib/goals";

export function useGoals() {
  return useSWR("goals", getGoals);
}

// 4. components/features/goals/GoalsList.tsx
"use client";
import { useGoals } from "@/hooks/features/goals/useGoals";

export default function GoalsList() {
  const { data: goals, error, isLoading } = useGoals();
  // ... component implementation
}

// 5. app/goals/page.tsx
import GoalsList from "@/components/features/goals/GoalsList";

export default function GoalsPage() {
  return <GoalsList />;
}
```

### Working with Forms

Forms use Formik + Yup for validation. Pattern:

```typescript
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  amount: Yup.number().positive().required("Amount is required"),
});

const formik = useFormik({
  initialValues: { name: "", amount: 0 },
  validationSchema,
  onSubmit: async (values) => {
    await submitData(values);
  },
});
```

### API Error Handling

All API calls through `fetchWithAuth()` handle:

- 401 Unauthorized → Redirects to login
- 403 Forbidden → Returns error
- Network errors → Throws error
- Success → Returns typed data

Example error handling in hooks:

```typescript
const { data, error, isLoading } = useSWR("budgets", getBudgets);

if (error) {
  // Show error UI
  return <Alert severity="error">{error.message}</Alert>;
}
```

### Building for Docker

The Dockerfile uses multi-stage builds with standalone output mode configured in `next.config.ts`.

```bash
docker build -t cashcub .
docker run -p 3000:3000 cashcub
```

## Code Patterns and Best Practices

### Server Actions Pattern

All server-side API calls must:

1. Use `"use server"` directive
2. Use `fetchWithAuth()` wrapper
3. Return typed data
4. Handle errors appropriately

```typescript
"use server";
import { fetchWithAuth } from "./api";
import type { Budget } from "@/types/api";

export async function getBudgetById(id: number) {
  return fetchWithAuth<Budget>(`/budgets/${id}`);
}
```

### Client Component Pattern

Client components that fetch data should:

1. Use custom hooks from `hooks/`
2. Handle loading and error states
3. Use Material-UI components
4. Be co-located with tests

```typescript
"use client";
import { useBudgets } from "@/hooks/features/budgets/useBudgets";
import { CircularProgress, Alert } from "@mui/material";

export default function BudgetsList() {
  const { data: budgets, error, isLoading } = useBudgets();

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <div>
      {budgets?.map(budget => (
        <div key={budget.id}>{budget.name}</div>
      ))}
    </div>
  );
}
```

### Custom Hook Pattern

Custom hooks should:

1. Wrap SWR for data fetching
2. Call server actions
3. Provide clean interface
4. Handle mutations with `mutate()`

```typescript
import useSWR from "swr";
import { getBudgets, addBudget } from "@/lib/budgets";
import type { Budget } from "@/types/api";

export function useBudgets() {
  const { data, error, isLoading, mutate } = useSWR("budgets", getBudgets);

  const addNewBudget = async (budget: Omit<Budget, "id">) => {
    const newBudget = await addBudget(budget);
    mutate(); // Revalidate
    return newBudget;
  };

  return {
    budgets: data,
    error,
    isLoading,
    addBudget: addNewBudget,
  };
}
```

### Testing Patterns

**Component tests:**

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });
});
```

**Hook tests:**

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useMyHook } from "./useMyHook";

describe("useMyHook", () => {
  it("fetches data correctly", async () => {
    const { result } = renderHook(() => useMyHook());

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

## Debugging Tips

### Common Issues

**1. Session expired / 401 errors:**

- Check if Auth0 tokens are valid
- Verify `AUTH0_SECRET` is set correctly
- Session cookies expire after configured time

**2. API calls failing:**

- Verify `API_BASE_URL` is correct
- Check network tab for actual error responses
- Ensure Auth0 token is being sent

**3. Build errors:**

- Clear `.next` folder: `rm -rf .next`
- Check TypeScript errors: `npx tsc --noEmit`
- Verify all imports are correct

**4. Test failures:**

- Check for async timing issues
- Use `waitFor` for async operations
- Mock external dependencies properly

### Useful Debugging Commands

```bash
# Check TypeScript errors
npx tsc --noEmit

# View environment variables (be careful with secrets)
npm run dev -- --show-config

# Clear all caches
rm -rf .next node_modules/.cache

# Check bundle size
npm run build && npx @next/bundle-analyzer
```

## Git Workflow

Current branch: `1.7.0`
Main branch: `main`

**Modified files (as of last check):**

- `lib/analytics.ts`
- `lib/api.ts`
- `lib/auth0.ts`
- `lib/budgets.ts`
- `lib/categories.ts`
- `lib/transactions.ts`

When committing:

1. Test your changes: `npm test`
2. Run linter: `npm run lint`
3. Format code: `npm run format`
4. Create descriptive commit messages
5. Reference issue numbers if applicable

## Performance Considerations

### SWR Configuration

Global SWR config in `app/layout.tsx`:

- `refreshInterval: 3000` - Polls every 3 seconds
- Adjust for your use case (longer intervals = less API calls)

### Image Optimization

Use Next.js Image component for optimized images:

```typescript
import Image from "next/image";

<Image src="/logo.png" alt="Logo" width={100} height={100} />
```

### Code Splitting

Next.js automatically code-splits by route. For additional splitting:

```typescript
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <CircularProgress />,
});
```

## Security Notes

### Authentication

- Never expose `AUTH0_CLIENT_SECRET` or `AUTH0_SECRET` in client code
- All server actions run server-side only
- JWT tokens are validated on every API call
- Sessions expire based on Auth0 configuration

### API Security

- All API calls require authentication via Bearer token
- CSRF protection handled by Next.js
- Sensitive data only in server components/actions

### Environment Variables

- Never commit `.env` file
- Use `.env.example` as template
- Rotate secrets regularly in production
