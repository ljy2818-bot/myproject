'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Props {
  leadId: string
  leadName: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeleteConfirmDialog({ leadId, leadName, open, onOpenChange }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/leads/${leadId}`, { method: 'DELETE' })
    setLoading(false)
    onOpenChange(false)
    router.refresh()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>리드 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>{leadName ?? '이 리드'}</strong>를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700">
            {loading ? '삭제 중...' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
