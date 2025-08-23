import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenFromCookie } from '@/lib/cookies';

export async function middleware(request: NextRequest) {
  // Only run on the homepage
  if (request.nextUrl.pathname === '/') {
    console.log("Middleware checking cookies")
    console.log(request.cookies)
    // Check for Keycloak token in cookies (adjust this logic to your app)
    const token = getTokenFromCookie(request.cookies);
    if (token) {
      // User is authenticated, redirect to /movies
      return NextResponse.redirect(new URL('/movies', request.url));
    }
  }
  // Continue as normal
  return NextResponse.next();
}

// Optionally, limit middleware to only the homepage
export const config = {
  matcher: '/',
};
