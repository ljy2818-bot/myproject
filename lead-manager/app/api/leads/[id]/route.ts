import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getLeadById, updateLead, deleteLead } from '@/lib/db/leads'
import { LeadUpdateSchema } from '@/lib/validations/lead'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const lead = await getLeadById(id)
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(lead)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const parsed = LeadUpdateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: '입력값이 올바르지 않습니다.', issues: parsed.error.issues }, { status: 400 })
  }

  const lead = await updateLead(id, parsed.data)
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(lead)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const deleted = await deleteLead(id)
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return new NextResponse(null, { status: 204 })
}
