/**
 * Google OAuth Configuration
 * 
 * To get your Google Client ID:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a new project or select existing one
 * 3. Enable Google+ API
 * 4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
 * 5. Set Authorized JavaScript origins: http://localhost:5173
 * 6. Set Authorized redirect URIs: http://localhost:5173
 * 7. Copy the Client ID here
 */

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 
  'YOUR_GOOGLE_CLIENT_ID_HERE';

export const googleConfig = {
  clientId: GOOGLE_CLIENT_ID,
};
