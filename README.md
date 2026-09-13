# College Management System — Frontend

The React interface for EduSuite ERP, a school and college management application with academic administration, student and faculty records, attendance, examinations, fees, and operations screens.

**Backend repository:** [college-management-system-backend](https://github.com/iammahesh123/college-management-system-backend)

## Technology

React 19, TypeScript 6, Vite 8, Tailwind CSS 3, React Router, Axios, TanStack Query, Zustand, React Hook Form, Zod, Recharts, and Lucide icons. Exact dependency versions are recorded in `package-lock.json`.

## Included screens

- Public landing page and login.
- Dashboard, academics, admissions, students, and faculty.
- Timetable, attendance, assignments, and examinations.
- Finance, notices, and operations.
- Printable fee receipts and report cards.

The application includes an API client and token handling for the companion Spring Boot server. Run the backend to use authenticated API-backed workflows.

## Requirements

- Node.js 22.12+ in the Node 22 line, or another version supported by the installed Vite release.
- npm and Git.
- The companion backend running at `http://localhost:8080`.

## Quick start

```sh
git clone https://github.com/iammahesh123/college-management-system-frontend.git
cd college-management-system-frontend
npm ci
npm run dev
```

Open the URL printed by Vite, normally http://localhost:5173. Start and configure the backend using its README before signing in.

For a freshly seeded backend, use `admin@apex.edu` with `password123`. These are development demo credentials, not credentials for a deployed institution.

## API configuration

The API origin is currently defined directly in [src/api/client.ts](src/api/client.ts):

```ts
export const API_BASE_URL = 'http://localhost:8080/api/v1';
```

Change that constant to target a different backend. The current Vite configuration does not define an API proxy, and the client does not read a `VITE_API_URL` variable.

The backend must allow the browser's frontend origin through its `APP_CORS_ALLOWED_ORIGINS` configuration. If Vite chooses another port, update the allowed origins or free port 5173.

The Axios client attaches bearer tokens, attempts a token refresh after a 401 response, and clears saved credentials if refresh fails. Authentication state is stored in local storage under `edusuite_token`, `edusuite_refresh_token`, and `edusuite_user`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install dependencies from the lockfile |
| `npm run dev` | Start the development server |
| `npm run lint` | Run Oxlint |
| `npm run build` | Type-check and build the application |
| `npm run preview` | Preview the built bundle locally |

```sh
npm run lint
npm run build
npm run preview
```

The production bundle is generated in `dist/`. No automated test script is currently defined in `package.json`.

## Project structure

```text
src/
  App.tsx             Application composition and routing
  main.tsx            React entry point
  api/client.ts       API origin, Axios client, and token interceptors
  stores/authStore.ts Authentication and campus/year selection state
  pages/              Application screens
  components/layout/  Navigation and page layout
  components/common/  Shared dialogs, badges, and printable documents
  types/              API and domain types
```

## Deploying the frontend

Build with `npm run build` and serve `dist/` from a static web host. Configure the host to return `index.html` for application routes so direct navigation and browser refresh work with client-side routing.

Set the API origin to a reachable backend before building, and configure the backend to allow the deployed frontend origin. A deployed browser's `localhost` refers to that user's machine, so the development URL must be replaced for shared hosting. Serve both frontend and backend over HTTPS.

## Troubleshooting

- **Login or data requests fail:** check that the backend is running and that the API origin is correct.
- **CORS errors:** verify the exact browser origin in the backend configuration.
- **Expired session:** sign in again; stale demo credentials may need to be cleared after a database reset.
- **Blank page after changing authentication data:** clear this application's local storage and reload.
- **Direct route returns 404 on hosting:** configure a fallback to `index.html`.
- **Build fails:** review the TypeScript error and confirm your Node version supports the installed toolchain.

Demo data and role selectors are intended for development. Validate backend authorization and your deployment's authentication/storage requirements before using real student records.
