import { Suspense } from 'react'
import { getLeads } from '@/lib/db/leads'
import LeadTable from '@/components/leads/LeadTable'
import LeadFilters from '@/components/leads/LeadFilters'
import type { LeadFilters as LeadFiltersType, LeadStatus } from '@/types'

interface PageProps {
  searchParams: Promise<Record<string, string>>
}

export const metadata = { title: '리드 관리' }

export default async function AdminPage({ searchParams }: PageProps) {
  const params = await searchParams
  const filters: LeadFiltersType = {
    status: (params.status as LeadStatus) || undefined,
    search: params.search || undefined,
    page: Number(params.page || 1),
    limit: 20,
    sort: 'created_at',
    order: 'desc',
  }

  const { data: leads, pagination } = await getLeads(filters)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">총 {pagination.total}건</p>
      </div>

      <Suspense>
        <LeadFilters />
      </Suspense>

      <div className="bg-white rounded-lg border overflow-hidden">
        <LeadTable leads={leads} />
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/admin?page=${p}${params.status ? `&status=${params.status}` : ''}${params.search ? `&search=${params.search}` : ''}`}
              className={`px-3 py-1 rounded border text-sm ${p === pagination.page ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
