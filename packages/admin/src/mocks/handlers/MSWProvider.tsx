'use client'

import { useEffect, useState } from 'react'

export default function MSWProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const start = async () => {
      if (
        process.env.NODE_ENV === 'development' &&
        process.env.NEXT_PUBLIC_MOCK === 'true'
      ) {
        const { worker } = await import('@/src/mocks/browser')
        await worker.start({
          onUnhandledRequest: 'warn',
        })
      }

      setReady(true)
    }

    start()
  }, [])

  if (!ready) return null

  return <>{children}</>
}
