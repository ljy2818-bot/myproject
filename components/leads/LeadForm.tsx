'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LeadSubmitSchema, type LeadSubmitInput } from '@/lib/validations/lead'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LeadForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadSubmitInput>({ resolver: zodResolver(LeadSubmitSchema) })

  async function onSubmit(data: LeadSubmitInput) {
    setServerError('')
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      setSubmitted(true)
    } else {
      const json = await res.json()
      setServerError(json.error || '오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-sm text-center">
          <CardContent className="pt-8 pb-8 space-y-2">
            <p className="text-2xl">✅</p>
            <p className="font-semibold text-lg">문의가 접수되었습니다.</p>
            <p className="text-sm text-gray-500">빠른 시일 내에 연락드리겠습니다.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl">문의신청</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="full_name">이름 *</Label>
              <Input id="full_name" {...register('full_name')} placeholder="홍길동" />
              {errors.full_name && <p className="text-xs text-red-500">{errors.full_name.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">전화번호 *</Label>
              <Input id="phone" {...register('phone')} placeholder="010-0000-0000" />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">이메일 *</Label>
              <Input id="email" {...register('email')} type="email" placeholder="example@email.com" />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {serverError && <p className="text-sm text-red-500">{serverError}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? '제출 중...' : '문의 신청'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
