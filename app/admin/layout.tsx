import { SessionProvider } from 'next-auth/react'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      </div>
    </SessionProvider>
  )
}
