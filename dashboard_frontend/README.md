# Creator Hub Dashboard Frontend

React-based dashboard for content creators to manage social accounts, publish posts, analyze engagement, and handle audience.

## Ocean Professional Theme
Blue and amber accents, minimalist, with rounded corners and subtle shadows.

## Features
- Authentication pages (Login/Signup) with email/password (demo) and Instagram OAuth option
- Route protection for private pages with redirect to intended destination after auth
- Instagram OAuth login using environment variables
- Sidebar navigation and top action bar
- Dashboard analytics (placeholder data if backend not available)
- Post publishing modal
- Account linking UI (Instagram)
- Audience management view (placeholders)
- Responsive layout

## Environment Variables
Create a `.env` file in the project root with:
```
REACT_APP_INSTAGRAM_CLIENT_ID=<your_instagram_app_client_id>
REACT_APP_INSTAGRAM_REDIRECT_URI=<https://your-app-domain/oauth/callback> 
# Optional:
REACT_APP_API_BASE=<backend-api-base-url>
```
Notes:
- Never expose client secrets in the frontend. The code exchange should be done by a backend endpoint at `/api/auth/instagram/exchange`.

## Scripts
- npm start
- npm run build
- npm test

## OAuth Flow
1. User clicks "Continue with Instagram" ➜ redirected to Instagram authorize URL.
2. Instagram redirects back to `REACT_APP_INSTAGRAM_REDIRECT_URI?code=...`.
3. App detects `code` on either the auth pages or in the app shell and calls `/api/auth/instagram/exchange` (stub), falling back to demo token if backend is absent.
4. After success, users are redirected to the originally requested route or dashboard.

## Routes
- Public: `/login`, `/signup`
- Private (guarded): `/`, `/posts`, `/audience`, `/accounts`, `/settings`

## Project Structure
- src/auth: Auth context, guard, and Instagram OAuth helpers
- src/services: API wrapper (with graceful fallbacks)
- src/components: Reusable UI components (modals)
- src/pages: Login, Signup, Dashboard, Posts, Audience, Accounts, Settings

## Security
Do not include REACT_APP_INSTAGRAM_CLIENT_SECRET in the frontend. Handle token exchange on backend.
