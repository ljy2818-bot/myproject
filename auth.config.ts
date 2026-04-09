import type { NextAuthConfig } from 'next-auth'

// Edge Runtime 호환 설정 (DB 접근 없음 — middleware에서 사용)
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminPath = nextUrl.pathname.startsWith('/admin')
      const isLoginPage = nextUrl.pathname === '/admin/login'

      if (isLoginPage) {
        if (isLoggedIn) return Response.redirect(new URL('/admin', nextUrl))
        return true
      }
      if (isAdminPath) return isLoggedIn
      return true
    },
  },
  providers: [],
}
