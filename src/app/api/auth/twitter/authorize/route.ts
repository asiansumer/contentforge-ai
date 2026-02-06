/**
 * Twitter OAuth Authorization API Endpoint
 * GET /api/auth/twitter/authorize
 *
 * Initiates Twitter OAuth 2.0 flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

/**
 * Twitter OAuth configuration
 */
const getTwitterOAuthConfig = () => ({
  clientId: process.env.TWITTER_CLIENT_ID || '',
  clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
  redirectUri: process.env.TWITTER_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`,
  scopes: [
    'tweet.read',
    'tweet.write',
    'tweet.moderate.write',
    'users.read',
    'follows.read',
    'offline.access',
  ],
  authUrl: 'https://twitter.com/i/oauth2/authorize',
  tokenUrl: 'https://twitter.com/i/oauth2/token',
});

/**
 * GET /api/auth/twitter/authorize
 * Start Twitter OAuth flow
 */
export async function GET(request: NextRequest) {
  try {
    // Generate random state for CSRF protection
    const state = randomBytes(16).toString('hex');

    // Simple PKCE implementation
    const generateCodeVerifier = () => {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return btoa(String.fromCharCode(...array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    };

    const verifier = generateCodeVerifier();
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const challenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Build authorization URL
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: getTwitterOAuthConfig().clientId,
      redirect_uri: getTwitterOAuthConfig().redirectUri,
      scope: getTwitterOAuthConfig().scopes.join(' '),
      state: state,
      code_challenge_method: 'S256',
      code_challenge: challenge,
    });

    const authUrl = `${getTwitterOAuthConfig().authUrl}?${params.toString()}`;

    // Redirect to Twitter's authorization page
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Twitter OAuth error:', error);

    return NextResponse.redirect(
      new URL(
        `/connect?error=${encodeURIComponent(error instanceof Error ? error.message : 'Failed to initiate OAuth flow')}&platform=twitter`,
        request.url
      )
    );
  }
}
