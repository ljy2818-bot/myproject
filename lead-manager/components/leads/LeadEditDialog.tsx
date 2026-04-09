'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LeadUpdateSchema, type LeadUpdateInput } from '@/lib/validations/lead'
import type { Lead } from '@/types'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

const STATUS_OPTIONS = [
  { value: 'new',       label: '신규' },
  { value: 'contacted', label: '연락됨' },
  { value: 'qualified', label: '적격' },
  { value: 'converted', label: '전환완료' },
  { value: 'lost',      label: '이탈' },
]

interface Props {
  lead: Lead
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LeadEditDialog({ lead, open, onOpenChange }: Props) {
  const router = useRouter()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LeadUpdateInput>({
    resolver: zodResolver(LeadUpdateSchema),
    defaultValues: {
      full_name: lead.full_name ?? '',
      phone: lead.phone ?? '',
      status: lead.status,
      notes: lead.notes ?? '',
    },
  })

  async function onSubmit(data: LeadUpdateInput) {
    setServerError('')
    const res = await fetch(`/api/leads/${lead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      onOpenChange(false)
      router.refresh()
    } else {
      const json = await res.json()
      setServerError(json.error || '저장에 실패했습니다.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>리드 수정</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>이름</Label>
            <Input {...register('full_name')} />
            {errors.full_name && <p className="text-xs text-red-500">{errors.full_name.message}</p>}
          </div>
          <div className="space-y-1">
            <Label>전화번호</Label>
            <Input {...register('phone')} />
          </div>
          <div className="space-y-1">
            <Label>상태</Label>
            <Select
              defaultValue={lead.status}
              onValueChange={(v) => setValue('status', v as LeadUpdateInput['status'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>메모</Label>
            <Textarea {...register('notes')} rows={3} />
          </div>
          {serverError && <p className="text-sm text-red-500">{serverError}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : '저장'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
