export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'

export interface Lead {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  company: string | null
  job_title: string | null
  source: string | null
  status: LeadStatus
  notes: string | null
  assigned_to: string | null
  converted_at: string | null
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  username: string
  is_active: boolean
}

export interface LeadListResult {
  data: Lead[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface LeadFilters {
  status?: LeadStatus
  search?: string
  page?: number
  limit?: number
  sort?: 'created_at' | 'updated_at' | 'full_name'
  order?: 'asc' | 'desc'
}
