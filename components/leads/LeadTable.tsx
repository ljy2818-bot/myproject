'use client'

import { useState } from 'react'
import type { Lead } from '@/types'
import { formatDate } from '@/lib/utils'
import LeadStatusBadge from './LeadStatusBadge'
import LeadEditDialog from './LeadEditDialog'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

interface Props {
  leads: Lead[]
}

export default function LeadTable({ leads }: Props) {
  const [editLead, setEditLead] = useState<Lead | null>(null)
  const [deleteLead, setDeleteLead] = useState<Lead | null>(null)

  if (leads.length === 0) {
    return <p className="text-center text-gray-400 py-16">등록된 리드가 없습니다.</p>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>전화번호</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>등록일</TableHead>
            <TableHead className="text-right">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">{lead.full_name ?? '-'}</TableCell>
              <TableCell>{lead.phone ?? '-'}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell><LeadStatusBadge status={lead.status} /></TableCell>
              <TableCell>{formatDate(lead.created_at)}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="sm" variant="outline" onClick={() => setEditLead(lead)}>수정</Button>
                <Button size="sm" variant="destructive" onClick={() => setDeleteLead(lead)}>삭제</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editLead && (
        <LeadEditDialog
          lead={editLead}
          open={!!editLead}
          onOpenChange={(open) => { if (!open) setEditLead(null) }}
        />
      )}

      {deleteLead && (
        <DeleteConfirmDialog
          leadId={deleteLead.id}
          leadName={deleteLead.full_name}
          open={!!deleteLead}
          onOpenChange={(open) => { if (!open) setDeleteLead(null) }}
        />
      )}
    </>
  )
}
