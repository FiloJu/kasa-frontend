import type { Metadata } from 'next'
import Button from '../components/Button'

/** Prevents the not-found page from being indexed. */
export const metadata: Metadata = {
  title: 'Page introuvable',
  robots: {
    index: false,
    follow: false,
  },
}

/** Renders the not-found message and links to the main site sections. */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 text-center gap-8 pt-40 pb-20">
      <h1 className="text-[100px] font-black leading-none text-[#99331A]">404</h1>
      <p className="text-body-sm text-black max-w-sm">
        Il semble que la page que vous cherchez ait pris des vacances... ou n&apos;ait jamais existé.
      </p>
      <div className="flex flex-col gap-4 w-full max-w-45">
        <Button href="/" variant="primary">Accueil</Button>
        <Button href="/properties" variant="primary">Logements</Button>
      </div>
    </div>
  )
}