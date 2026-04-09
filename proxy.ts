import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionFromRequest } from './lib/session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login') {
    const session = await getSessionFromRequest(request)
    if (session) return NextResponse.redirect(new URL('/admin', request.url))
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const session = await getSessionFromRequest(request)
    if (!session) return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
