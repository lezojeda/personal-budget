# Personal Budget Express App

This is a project created as part of the Codecademy back-end engineer path. It is built using Express and TypeScript mainly.

## Getting Started

### Prerequisites

- Node.js
- Docker

1. Clone the repository:

```bash
git clone https://github.com/<username>/personal-budget.git
```

2. Install dependencies:

```bash
npm install
```

3. Create an .env file and provide values for the following environment variables:

```makefile
DATABASE_URL=<your_database_url>
SESSION_SECRET=<your_session_secret>
NODE_ENV=<development_or_testing>

# If you want to enable github OAuth
GITHUB_CLIENT_ID=<your_github_client_id>
GITHUB_CLIENT_SECRET=<your_github_client_secret>
```

4. Start Docker if it's not already running, and run `npm run db:dev:up` or `npm run db:dev:restart` to set up the development database.

5. Run the app:

```bash
npm run dev
```

This will start the development server with hot-reloading enabled. You can access the app at http://localhost:3000.

## Testing

This app uses Jest for testing. To run the tests, make sure docker is running, env variables set and use `npm test`. There are pretest and posttest scripts which restart the test database and remove it respectively.