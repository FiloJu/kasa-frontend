import type { Metadata } from 'next'
import { Suspense } from 'react'
import Messenger from '@/components/Messenger'

/** Prevents private messages from appearing in search results. */
export const metadata: Metadata = {
  title: 'Messagerie',
  robots: {
    index: false,
    follow: false,
  },
}

/** Renders the messaging interface within a Suspense boundary. */
export default function MessagesPage() {
  return (
    <Suspense>
      <Messenger />
    </Suspense>
  )
}
