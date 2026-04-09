'use client'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="text-center py-16 space-y-4">
      <p className="text-gray-500">데이터를 불러오는 중 오류가 발생했습니다.</p>
      <button onClick={reset} className="text-sm underline text-gray-700">다시 시도</button>
    </div>
  )
}
