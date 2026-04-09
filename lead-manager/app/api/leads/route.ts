import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { createLead, getLeads } from '@/lib/db/leads'
import { LeadSubmitSchema } from '@/lib/validations/lead'
import type { LeadFilters, LeadStatus } from '@/types'

// POST /api/leads — 공개 리드 수집
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = LeadSubmitSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: '입력값이 올바르지 않습니다.', issues: parsed.error.issues }, { status: 400 })
    }

    const lead = await createLead(parsed.data)
    return NextResponse.json({ id: lead.id, created_at: lead.created_at }, { status: 201 })
  } catch (err: unknown) {
    console.error('[POST /api/leads]', err)
    const pg = err as { code?: string }
    if (pg?.code === '23505') {
      return NextResponse.json({ error: '이미 등록된 이메일입니다.' }, { status: 409 })
    }
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}

// GET /api/leads — 인증 필요, 어드민 목록
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const filters: LeadFilters = {
    status: (searchParams.get('status') as LeadStatus) || undefined,
    search: searchParams.get('search') || undefined,
    page: Number(searchParams.get('page') || 1),
    limit: Math.min(Number(searchParams.get('limit') || 20), 100),
    sort: (searchParams.get('sort') as LeadFilters['sort']) || 'created_at',
    order: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
  }

  const result = await getLeads(filters)
  return NextResponse.json(result)
}
