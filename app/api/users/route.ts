import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getActiveUsers } from '@/lib/db/users'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const users = await getActiveUsers()
  return NextResponse.json(users)
}
