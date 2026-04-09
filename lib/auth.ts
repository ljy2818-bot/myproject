import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { authConfig } from '@/auth.config'
import { getUserByEmail } from '@/lib/db/users'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const { email, password } = credentials as { email: string; password: string }
          if (!email || !password) return null

          const user = await getUserByEmail(email)
          console.log('[auth] user found:', !!user, 'is_active:', user?.is_active)
          if (!user || !user.is_active) return null

          const valid = await bcrypt.compare(password, user.password_hash)
          console.log('[auth] password valid:', valid)
          if (!valid) return null

          return { id: user.id, email: user.email, name: user.username }
        } catch (e) {
          console.error('[auth] authorize error:', e)
          return null
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      return session
    },
  },
  session: { strategy: 'jwt' },
})
