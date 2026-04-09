'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function AdminHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <h1 className="text-lg font-semibold">리드 관리</h1>
      <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/admin/login' })}>
        로그아웃
      </Button>
    </header>
  )
}
