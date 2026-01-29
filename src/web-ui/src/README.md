# Web UI Architecture Summary

This UI uses a clean, layered structure to keep responsibilities separate and easy to explain during a diploma defense.

## Folder Structure

- components/ → Reusable UI building blocks (e.g., LoadingSpinner, shared layout widgets).
- features/ → Business logic per domain (auth/, parsers/, etc.).
- api/ → HTTP clients and request/response handling (Axios instance).
- store/ → Global state (Zustand) with explicit persistence rules.
- types/ → Shared TypeScript interfaces and DTOs.

## Authentication Flow (High Level)

1. Login
   - Google login returns an ID token.
   - The backend verifies it and returns accessToken + refreshToken.
   - We store:
     - accessToken → sessionStorage (survives F5 but not browser close).
     - refreshToken + user + isAuthenticated → localStorage (survives browser close).

2. App Initialization
   - On startup, the app hydrates accessToken from sessionStorage.
   - If authenticated, it calls GET /auth/me to refresh the user profile.
   - While initialization runs, we show a full-screen loading spinner.

3. API Calls and Token Refresh
   - Axios attaches the access token to every request.
   - If a request fails with 401:
     - A single refresh call is made to /auth/refresh.
     - Other 401 requests wait in a queue (failedQueue) and retry once the new token arrives.
     - If refresh fails, we logout and redirect to /login.

## Why This Design

- sessionStorage for accessToken: keeps the token across F5 but clears it after the browser closes, reducing risk.
- localStorage for refreshToken + user: avoids “Guest” UI after reloads and preserves session.
- failedQueue: prevents multiple refresh calls during concurrent 401 errors.
- isInitialized: prevents UI from rendering before the auth state is stable.

This design keeps security concerns isolated, avoids redundant refresh calls, and provides a predictable lifecycle for authentication.
