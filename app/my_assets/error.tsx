'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-xl font-semibold mb-4">出错了</h2>
      <button
        className="btn btn-primary"
        onClick={() => reset()}
      >
        重试
      </button>
    </div>
  )
}
