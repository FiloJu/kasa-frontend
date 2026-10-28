import type { Metadata } from 'next'
import { Suspense } from 'react'
import Messenger from '@/components/Messenger'

export const metadata: Metadata = {
  title: 'Messagerie',
}

export default function MessagesPage() {
  return (
    <Suspense>
      <Messenger />
    </Suspense>
  )
}
