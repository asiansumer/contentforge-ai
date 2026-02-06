/**
 * Twitter OAuth Callback API Endpoint
 * GET /api/auth/twitter/callback
 *
 * Handles Twitter OAuth 2.0 callback
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/auth/twitter/callback
 * Handle Twitter OAuth callback
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      throw new Error(`Twitter OAuth error: ${error}`);
    }

    if (!code) {
      throw new Error('Missing authorization code');
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://twitter.com/i/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.TWITTER_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`,
        client_id: process.env.TWITTER_CLIENT_ID || '',
        client_secret: process.env.TWITTER_CLIENT_SECRET || '',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Token exchange failed: ${JSON.stringify(errorData)}`);
    }

    const tokenData = await tokenResponse.json();

    // TODO: Store credentials in database
    // For now, redirect with success message
    return NextResponse.redirect(
      new URL(
        `/connect?success=twitter&access_token=${tokenData.access_token ? 'received' : ''}`,
        request.url
      )
    );
  } catch (error) {
    console.error('Twitter callback error:', error);

    return NextResponse.redirect(
      new URL(
        `/connect?error=${encodeURIComponent(error instanceof Error ? error.message : 'Failed to complete OAuth flow')}&platform=twitter`,
        request.url
      )
    );
  }
}
