import { Badge } from '@/components/ui/badge'
import type { LeadStatus } from '@/types'

const statusMap: Record<LeadStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  new:       { label: '신규',    variant: 'default' },
  contacted: { label: '연락됨',  variant: 'secondary' },
  qualified: { label: '적격',    variant: 'outline' },
  converted: { label: '전환완료', variant: 'default' },
  lost:      { label: '이탈',    variant: 'destructive' },
}

export default function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const { label, variant } = statusMap[status] ?? { label: status, variant: 'outline' }
  return <Badge variant={variant}>{label}</Badge>
}
