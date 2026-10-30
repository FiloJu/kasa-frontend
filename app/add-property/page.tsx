import type { Metadata } from 'next'
import AddPropertyContent from '@/components/add-property/AddPropertyContent'

/** Search metadata for the authenticated property creation route. */
export const metadata: Metadata = {
  title: 'Ajouter un logement',
  description: 'Votre compte doit être validé par la communauté Kasa avant de pouvoir publier une annonce.',
  robots: {
    index: false,
    follow: false,
  },
}

/** Renders the property creation flow. */
export default function AddPropertyPage() {
  return <AddPropertyContent />
}