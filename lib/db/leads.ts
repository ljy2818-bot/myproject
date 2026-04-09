import { db } from './client'
import type { Lead, LeadFilters, LeadListResult, LeadStatus } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyParams = any[]

export async function getLeads(filters: LeadFilters = {}): Promise<LeadListResult> {
  const { status, search, page = 1, limit = 20, sort = 'created_at', order = 'desc' } = filters
  const offset = (page - 1) * limit

  const conditions: string[] = []
  const values: AnyParams = []
  let idx = 1

  if (status) {
    conditions.push(`l.status = $${idx++}`)
    values.push(status)
  }
  if (search) {
    conditions.push(`(l.email ILIKE $${idx} OR l.full_name ILIKE $${idx})`)
    values.push(`%${search}%`)
    idx++
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const orderBy = `ORDER BY l.${sort} ${order.toUpperCase()}`

  const countResult = await db.unsafe<[{ count: string }]>(
    `SELECT COUNT(*) as count FROM leads l ${where}`,
    values
  )
  const total = parseInt(countResult[0].count, 10)

  values.push(limit, offset)
  const rows = await db.unsafe<Lead[]>(
    `SELECT l.* FROM leads l ${where} ${orderBy} LIMIT $${idx} OFFSET $${idx + 1}`,
    values
  )

  return {
    data: rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const rows = await db<Lead[]>`SELECT * FROM leads WHERE id = ${id}`
  return rows[0] ?? null
}

export async function createLead(data: {
  email: string
  full_name?: string
  phone?: string
  company?: string
  job_title?: string
  source?: string
}): Promise<Lead> {
  const rows = await db<Lead[]>`
    INSERT INTO leads (email, full_name, phone, company, job_title, source)
    VALUES (${data.email}, ${data.full_name ?? null}, ${data.phone ?? null},
            ${data.company ?? null}, ${data.job_title ?? null}, ${data.source ?? null})
    RETURNING *
  `
  return rows[0]
}

export async function updateLead(
  id: string,
  data: Partial<{
    status: LeadStatus
    notes: string | null
    assigned_to: string | null
    full_name: string
    phone: string
    company: string
    job_title: string
  }>
): Promise<Lead | null> {
  const sets: string[] = []
  const values: AnyParams = []
  let idx = 1

  for (const [key, value] of Object.entries(data)) {
    sets.push(`${key} = $${idx++}`)
    values.push(value)
  }

  if (data.status === 'converted') {
    sets.push(`converted_at = NOW()`)
  }

  if (sets.length === 0) return getLeadById(id)

  values.push(id)
  const rows = await db.unsafe<Lead[]>(
    `UPDATE leads SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  )
  return rows[0] ?? null
}

export async function deleteLead(id: string): Promise<boolean> {
  const result = await db`DELETE FROM leads WHERE id = ${id}`
  return result.count > 0
}
