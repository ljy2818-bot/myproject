import { db } from './client'
import type { User } from '@/types'

export async function getActiveUsers(): Promise<User[]> {
  return db<User[]>`
    SELECT id, email, username, is_active
    FROM users
    WHERE is_active = true
    ORDER BY username
  `
}

export async function getUserByEmail(
  email: string
): Promise<(User & { password_hash: string }) | null> {
  const rows = await db<(User & { password_hash: string })[]>`
    SELECT id, email, username, is_active, password_hash
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `
  return rows[0] ?? null
}
