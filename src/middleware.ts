import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { NEW_USER_COOKIE, NEXT_AUTH_SESSION_COOKIE } from '@/lib/constants'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/finish') {
    if (!request.cookies.has(NEW_USER_COOKIE)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } else if (pathname === '/login') {
    if (request.cookies.has(NEXT_AUTH_SESSION_COOKIE)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
