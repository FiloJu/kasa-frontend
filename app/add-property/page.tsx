import type { Metadata } from 'next'
import AddPropertyContent from '@/components/add-property/AddPropertyContent'

export const metadata: Metadata = {
  title: 'Ajouter un logement',
  description: 'Votre compte doit être validé par la communauté Kasa avant de pouvoir publier une annonce.',
}

export default function AddPropertyPage() {
  return <AddPropertyContent />
}