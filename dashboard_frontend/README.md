# Creator Hub Dashboard Frontend

React-based dashboard for content creators to manage social accounts, publish posts, analyze engagement, and handle audience.

## Ocean Professional Theme
Blue and amber accents, minimalist, with rounded corners and subtle shadows.

## Features
- Authentication pages (Login/Signup) with email/password (demo)
- Route protection for private pages with redirect to intended destination after auth
- Sidebar navigation and top action bar
- Dashboard analytics (placeholder data if backend not available)
- Post publishing modal
- Account linking UI (placeholder)
- Audience management view (placeholders)
- Responsive layout

## Environment Variables
Create a `.env` file in the project root with (optional):
```
REACT_APP_API_BASE=<backend-api-base-url>
```

## Scripts
- npm start
- npm run build
- npm test

## Routes
- Public: `/login`, `/signup`
- Private (guarded): `/`, `/posts`, `/audience`, `/accounts`, `/settings`

## Project Structure
- src/auth: Auth context and route guard
- src/services: API wrapper (with graceful fallbacks)
- src/components: Reusable UI components (modals)
- src/pages: Login, Signup, Dashboard, Posts, Audience, Accounts, Settings

## Security
This build uses only basic email/password authentication for demo purposes.
