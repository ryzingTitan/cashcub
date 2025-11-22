CashCub – Development Guidelines

Audience: Advanced Next.js/TypeScript developers working on this repository.

1. Build and Configuration

- Node/Package Manager
  - Node 22.x is assumed (Dockerfile uses node:22-alpine). Use Corepack-enabled package managers if needed, but this repo is configured for npm by default.
  - Scripts:
    - npm run dev → next dev --turbopack
    - npm run build → next build --turbopack
    - npm start → next start

- Next.js
  - Next 15, React 19, output: "standalone" (see next.config.ts). Docker build expects standalone output (server.js is emitted by Next in .next/standalone).
  - Turbopack is used for both dev and build. Some webpack-only plugins/loaders won’t apply.

- TypeScript
  - Strict mode enabled. Path alias: @/\* → project root.
  - ModuleResolution: bundler. Keep imports ESM-compatible.

- Environment Variables
  - Required at runtime (server actions in lib/\*):
    - API_BASE_URL: Base URL of the CashCub backend API (e.g., https://api.example.com).
    - Auth0 config (via lib/auth0). Ensure the necessary Auth0 environment is provided as used by your local lib/auth0 module (domain, client id/secret, secrets, callback URLs). This repo references auth0 and expects a valid session for server-side fetches.
  - Local .env example (do not commit):
    API_BASE_URL=https://api.example.com
    AUTH0_SECRET=replace-me
    AUTH0_BASE_URL=http://localhost:3000
    AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
    AUTH0_CLIENT_ID=replace-me
    AUTH0_CLIENT_SECRET=replace-me
  - In Docker: propagate the above via docker run -e ... or compose.

- Middleware and Auth
  - Server-side fetchers in lib/budgets.ts, lib/transactions.ts, lib/categories.ts call auth0.getSession(). If session is missing, they redirect to loginUrl. When exercising these functions from UI, ensure an authenticated browser session exists.

2. Running Locally / Building

- Local Dev
  - Create .env with API_BASE_URL and Auth0 secrets.
  - npm install (if not already installed).
  - npm run dev and browse http://localhost:3000. You must authenticate to hit API-backed pages.

- Production Build
  - npm run build then npm start.
  - Or build the Docker image:
    docker build -t cashcub:local .
    docker run --rm -p 3000:3000 ^
    -e API_BASE_URL=https://api.example.com ^
    -e AUTH0_SECRET=... ^
    -e AUTH0_BASE_URL=http://localhost:3000 ^
    -e AUTH0_ISSUER_BASE_URL=... ^
    -e AUTH0_CLIENT_ID=... ^
    -e AUTH0_CLIENT_SECRET=... cashcub:local

3. Data Fetching Patterns

- SWR + Server Actions
  - UI components call useSWR(key, fetcher). The fetcher is a server function that requires an authenticated session and calls the API with Bearer token (idToken from Auth0).
  - Example: components/Transactions.tsx → useSWR('/budgets/{id}/items/{itemId}/transactions', getAllTransactions)
  - All server fetchers use API_BASE_URL and expect JSON.

- Error Handling
  - On non-OK responses, fetchers log to console and reject with a concise error string. Client code should handle loading and error states via SWR.

4. UI/Component Notes

- MUI v7 and X-Data-Grid are used. Keep column definitions stable to avoid re-renders; memoize where appropriate when changing.
- Day.js formats dates; amounts are formatted via lib/utils.formatToCurrency.

5. Linting/Style

- ESLint 9 with eslint-config-next. Run npm run lint.
- Types are strict; prefer explicit types on exported functions. Keep imports using the @/\* alias where appropriate.

6. Testing Guidance

There is no dedicated test runner configured in this repo. Until a full test stack is added, use lightweight Node-based smoke tests for project-specific assertions (config, utilities) and keep them out of the final commits.

- Where to place ad-hoc tests during development
  - Create short-lived scripts under scripts/ (ignored before committing) and run them with Node. Remove them after validation.

- Example: add a smoke test that validates package scripts and utility behavior
  - Create scripts/smoke.test.mjs with assertions (see below). Run with: node scripts/smoke.test.mjs
  - Remove the file after it passes to keep the repo clean.

- Adding a proper test setup later
  - Recommended: Vitest + @vitejs/plugin-react or Jest with next/jest. Given ESM and React 19, prefer Vitest with ts-node/esbuild for TS support. Configure tsconfig paths (tsconfigPaths) or jest-moduleNameMapper for @/\* alias.

7. Example Temporary Test Used for Verification

During preparation of these guidelines, a temporary smoke test was executed to verify basic repository invariants without touching app runtime:

- scripts/smoke.test.mjs
  - Verifies that expected npm scripts (dev, build, start, lint) exist in package.json.
  - Optionally checks that formatToCurrency("USD") formatting is stable by duplicating the same Intl.NumberFormat call inline (kept local to the temp script to avoid TS import friction).
  - The script exits with code 0 on success. It was executed and then removed.

Example contents used temporarily for this repository validation (do not commit permanently):

// scripts/smoke.test.mjs
// Run: node scripts/smoke.test.mjs
import fs from 'node:fs';
import path from 'node:path';
const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'));
for (const s of ['dev','build','start','lint']) {
if (!pkg.scripts?.[s]) { throw new Error(`Missing script: ${s}`); }
}
const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(1234.5);
if (formatted !== '$1,234.50') { throw new Error('Unexpected currency formatting'); }
console.log('SMOKE TEST PASSED');

8. Adding New API Calls

- Follow existing patterns in lib/\*.ts:
  - Read API_BASE_URL from process.env.
  - Acquire session via auth0.getSession(); redirect to loginUrl if absent.
  - Include Authorization: Bearer idToken header.
  - Use JSON content type and parse response.json().
  - Reject with a concise error message and log status when !response.ok.

9. Troubleshooting

- 401/redirect loops during SWR fetch
  - Ensure you are authenticated; server actions will redirect if session is missing. In dev, open the page after logging in via the Auth0 route.
- CJS/ESM import errors
  - This repository is ESM-first. Keep new files ESM and avoid mixing require() in client code.
- Path alias not resolving
  - Ensure tsconfig paths are preserved in your toolchain. Next handles it automatically; external tooling (tests, scripts) may need plugin support.
