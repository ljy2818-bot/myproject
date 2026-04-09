'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { LeadStatus } from '@/types'

const STATUS_TABS: { value: LeadStatus | 'all'; label: string }[] = [
  { value: 'all',       label: '전체' },
  { value: 'new',       label: '신규' },
  { value: 'contacted', label: '연락됨' },
  { value: 'qualified', label: '적격' },
  { value: 'converted', label: '전환완료' },
  { value: 'lost',      label: '이탈' },
]

export default function LeadFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get('status') ?? 'all'

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.push(`/admin?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-1 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab.value}
            size="sm"
            variant={currentStatus === tab.value ? 'default' : 'outline'}
            onClick={() => updateParam('status', tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <Input
        className="max-w-xs"
        placeholder="이름 또는 이메일 검색"
        defaultValue={searchParams.get('search') ?? ''}
        onChange={(e) => {
          const v = e.target.value
          const params = new URLSearchParams(searchParams.toString())
          if (v) params.set('search', v)
          else params.delete('search')
          params.delete('page')
          router.push(`/admin?${params.toString()}`)
        }}
      />
    </div>
  )
}
