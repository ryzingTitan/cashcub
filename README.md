# Cash Cub

Cash Cub is a simple and intuitive budgeting application designed to help you manage your finances effectively. Track your income, expenses, and savings with ease, and gain a clearer understanding of your financial habits.

## Features

- **Secure Authentication:** User authentication and authorization are handled by Auth0, ensuring your financial data is always protected.
- **Budget Management:** Create, update, and delete budgets to keep your finances organized.
- **Expense Tracking:** Easily add, edit, and categorize your expenses.
- **Financial Analytics:** Visualize your spending habits with insightful charts and graphs.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)
- [npm](https://www.npmjs.com/)

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
4. **Create a `.env.local` file in the root of the project and add the necessary environment variables (see the "Environment Variables" section below).**

### Running the Application

```bash
npm run dev
```

Open http://localhost:3000 in your browser to see the application.

## Environment Variables

This project uses Auth0 for authentication. You will need to create a new application in the [Auth0 Dashboard](https://manage.auth0.com/) and configure the following environment variables in a `.env.local` file:

- `AUTH0_SECRET`: A long, secret value used to sign the session cookie.
- `AUTH0_BASE_URL`: The base URL of your application.
- `AUTH0_ISSUER_BASE_URL`: The URL of your Auth0 tenant domain.
- `AUTH0_CLIENT_ID`: The client ID of your Auth0 application.
- `AUTH0_CLIENT_SECRET`: The client secret of your Auth0 application.

## Technologies Used

- [Next.js](https://nextjs.org/) - A React framework for building server-side rendered and static websites.
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [Material-UI](https://mui.com/) - A popular React UI framework.
- [Auth0](https://auth0.com/) - An identity management platform for authentication and authorization.
- [SWR](https://swr.vercel.app/) - A React Hooks library for data fetching.
- [Formik](https://formik.org/) - A small library that helps you with the three most annoying parts: getting values in and out of form state, validation and error messages, and handling form submission.
- [Yup](https://github.com/jquense/yup) - A JavaScript schema builder for value parsing and validation.
- [Day.js](https://day.js.org/) - A minimalist JavaScript library that parses, validates, manipulates, and displays dates and times for modern browsers with a largely Moment.js-compatible API.

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in the development mode.
- `npm run build`: Builds the app for production to the `.next` folder.
- `npm run start`: Starts the application in production mode.
- `npm run lint`: Runs ESLint to find and fix problems in your JavaScript code.
