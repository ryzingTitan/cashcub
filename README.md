# Cash Cub

Cash Cub is a modern budgeting application built with Next.js 15 that helps you manage your finances effectively. Track your budgets, transactions, and gain insights into your spending habits through intuitive analytics.

## Features

- **Secure Authentication:** User authentication and authorization handled by Auth0, ensuring your financial data is protected
- **Budget Management:** Create, update, and delete budgets with detailed tracking of budget items
- **Transaction Tracking:** Easily add, edit, and categorize your transactions
- **Financial Analytics:** Visualize your spending habits with insightful charts and graphs
- **Dark Mode Support:** Built-in dark mode for comfortable viewing
- **Real-time Updates:** SWR-powered data fetching with automatic revalidation

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)
- [npm](https://www.npmjs.com/)
- An Auth0 account for authentication
- Access to the Cash Cub backend API

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/cashcub.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd cashcub
   ```
3. **Install the dependencies:**
   ```bash
   npm install
   ```
4. **Set up your environment variables:**
   Copy the example environment file and update it with your Auth0 credentials.
   ```bash
   cp .env.example .env
   ```
   See the "Environment Variables" section below for more details.

### Running the Application

```bash
npm run dev
```

Open http://localhost:3000 in your browser to see the application.

## Environment Variables

This project uses Auth0 for authentication. You will need to create a new "Regular Web Application" in the [Auth0 Dashboard](https://manage.auth0.com/). Once created, you will find the necessary credentials in your application's "Settings" tab. Populate your `.env` file with the following values:

- `AUTH0_DOMAIN`: Your Auth0 application's domain
- `AUTH0_CLIENT_ID`: The Client ID of your Auth0 application
- `AUTH0_SECRET`: A long, secret value used to sign the session cookie. Generate with `openssl rand -hex 32`
- `AUTH0_CLIENT_SECRET`: The Client Secret of your Auth0 application
- `APP_BASE_URL`: The base URL of your application (e.g., `http://localhost:3000`) for Auth0 callbacks
- `API_BASE_URL`: The base URL of the Cash Cub backend API
- `AUTH0_SESSION_NAME`: Custom name for the Auth0 session cookie (used to avoid cookie collisions)
- `AUTH0_AUDIENCE`: The Auth0 API audience identifier for token validation

## Technologies Used

- [Next.js 15](https://nextjs.org/) - React framework with App Router and Turbopack for fast builds
- [React 19](https://reactjs.org/) - JavaScript library for building user interfaces
- [Material-UI v7](https://mui.com/) - Comprehensive React UI framework with dark mode support
- [Auth0](https://auth0.com/) - Identity management platform for authentication and authorization
- [SWR](https://swr.vercel.app/) - React Hooks library for data fetching and caching
- [Formik](https://formik.org/) - Form state management and validation
- [Yup](https://github.com/jquense/yup) - Schema builder for value parsing and validation
- [Day.js](https://day.js.org/) - Lightweight date/time library
- [Vitest](https://vitest.dev/) - Fast unit testing framework
- [React Testing Library](https://testing-library.com/react) - Testing utilities for React components
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

## Available Scripts

In the project directory, you can run:

**Development:**

- `npm run dev`: Runs the app in development mode with Turbopack
- `npm run build`: Builds the app for production with Turbopack
- `npm start`: Starts the application in production mode

**Testing:**

- `npm test`: Runs all tests with Vitest
- `vitest`: Runs tests in watch mode
- `npm run test:coverage`: Runs tests with coverage report

**Code Quality:**

- `npm run lint`: Runs ESLint to find and fix problems
- `npm run format`: Formats code with Prettier

## Project Structure

```
cashcub/
├── app/                    # Next.js App Router pages
│   ├── analytics/         # Analytics dashboard
│   ├── budgets/          # Budget pages
│   └── error/            # Error handling
├── components/            # React components
│   ├── features/         # Feature-specific components
│   ├── layout/           # Layout components (Header, Footer)
│   └── ui/               # Shared UI components
├── hooks/                # Custom React hooks
│   ├── features/         # Feature-specific hooks
│   └── ui/               # UI-related hooks
├── lib/                  # Server-side logic and API functions
│   ├── api.ts           # Core fetchWithAuth wrapper
│   ├── auth0.ts         # Auth0 utilities
│   ├── budgets.ts       # Budget API functions
│   ├── transactions.ts  # Transaction API functions
│   ├── categories.ts    # Category API functions
│   └── analytics.ts     # Analytics API functions
├── types/               # TypeScript type definitions
└── config/              # Application configuration
```

## Architecture

- **Authentication:** Auth0 with JWT token-based API authentication
- **Data Fetching:** Server actions in `lib/` + SWR hooks on client
- **Styling:** Material-UI with CSS variables and dark mode support
- **Testing:** Vitest + React Testing Library with co-located test files
- **Path Aliases:** `@/*` resolves to repository root

For more detailed architecture information, see [CLAUDE.md](./CLAUDE.md).
