import { NextResponse } from 'next/server'

import { NEW_USER_COOKIE, NEXT_AUTH_SESSION_COOKIE } from '@/lib/constants'

export async function middleware(request) {
  
  const { pathname } = request.nextUrl

  if(pathname !== "/finish") {
    // TODO: Store session cookie as well so users cant navigate away?
    if(request.cookies.has(NEW_USER_COOKIE)) {
      const response = NextResponse.next()
      response.cookies.set(NEW_USER_COOKIE, "", { maxAge: -1 })
      response.cookies.set(NEXT_AUTH_SESSION_COOKIE, "", { maxAge: -1 })
      return response
    }
  } else {
    if(!request.cookies.has(NEW_USER_COOKIE)) {
      request.nextUrl.pathname = `/`;
      return NextResponse.redirect(request.nextUrl);
    }
  }
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

// export async function middleware(request) {
  
//   const { pathname } = request.nextUrl
//   console.log('MIDDLEWARE PATH: ', pathname)
//   // TODO: Delete cookie if navigating away

//   if(pathname === "/finish") {
//     console.log('running if statement for middleware')
//     if(request.cookies.has(process.env.NEW_USER_COOKIE)) {
//       console.log('1 here')
//       // request.cookies.set(process.env.NEW_USER_COOKIE, "", { maxAge: -1 })
//       // request.cookies.set("next-auth.session-token", "")

//       const response = NextResponse.next()
//       // response.cookies.set(process.env.NEW_USER_COOKIE, "", { maxAge: -1 })
//       // response.cookies.set("next-auth.session-token", "", { maxAge: -1 })

//       // response.cookies.set('vercel', 'fast')
//       // response.cookies.set({
//       //   name: 'vercel',
//       //   value: 'fast',
//       //   path: '/test',
//       // })
//       // cookie = response.cookies.get('vercel')
//       // console.log(cookie) // => { name: 'vercel', value: 'fast', Path: '/test' }
//       // // The outgoing response will have a `Set-Cookie:vercel=fast;path=/test` header.
    
//       return response

//     } else {
//       console.log('2 here')
//       request.nextUrl.pathname = `/maintenance`;
//       return NextResponse.redirect(request.nextUrl);
//     }
//   }
// }