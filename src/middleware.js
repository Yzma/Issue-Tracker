import { NextResponse } from 'next/server'

import { NEW_USER_COOKIE, NEXT_AUTH_SESSION_COOKIE } from '@/lib/constants'

export async function middleware(request) {
  
  const { pathname } = request.nextUrl

  // if(pathname !== "/finish") {
  //   // TODO: Store session cookie as well so users cant navigate away?
  //   if(request.cookies.has(NEW_USER_COOKIE)) {
  //     const response = NextResponse.next()
  //     response.cookies.set(NEW_USER_COOKIE, "", { maxAge: -1 })
  //     response.cookies.set(NEXT_AUTH_SESSION_COOKIE, "", { maxAge: -1 })
  //     return response
  //   }
  // } else {
  //   if(!request.cookies.has(NEW_USER_COOKIE)) {
  //     request.nextUrl.pathname = `/`;
  //     return NextResponse.redirect(request.nextUrl);
  //   }
  // }
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
