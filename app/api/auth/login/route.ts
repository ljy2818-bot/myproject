import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { getUserByEmail } from '@/lib/db/users'

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!)

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: '이메일과 비밀번호를 입력해주세요.' }, { status: 400 })
    }

    const user = await getUserByEmail(email)
    if (!user || !user.is_active) {
      return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
    }

    // JWT 생성
    const token = await new SignJWT({ id: user.id, email: user.email, name: user.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret)

    const response = NextResponse.json({ ok: true })
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
    })
    return response
  } catch (e) {
    console.error('[login]', e)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
