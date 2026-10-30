import { expect, test, vi, beforeEach } from 'vitest'
import { render, screen } from "@testing-library/react"
import FavoritesPage from './page'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/context/AuthContext'
import { useFavoritesContext } from '@/context/FavoritesContext'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

vi.mock('@/context/AuthContext', () => ({
  useAuthContext: vi.fn(),
}))

vi.mock('@/context/FavoritesContext', () => ({
  useFavoritesContext: vi.fn(),
}))

vi.mock('@/components/PropertyCard', () => ({
  default: ({ property }: { property: any }) => (
    <div data-testid={`property-card-${property.id}`}>
      {property.title}
    </div>
  ),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

test('renders favorites page title when user is authenticated', () => {
  const mockPush = vi.fn()
  vi.mocked(useRouter).mockReturnValue({
    replace: mockPush,
    push: mockPush,
    back: mockPush,
    forward: mockPush,
    refresh: mockPush,
    prefetch: vi.fn(),
  } as any)

  vi.mocked(useAuthContext).mockReturnValue({
    user: { id: '1', name: 'John Doe' },
    loading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
  } as any)

  vi.mocked(useFavoritesContext).mockReturnValue({
    properties: [],
    loading: false,
    error: null,
  } as any)

  render(<FavoritesPage />)

  const heading = screen.queryByText('Vos favoris')
  expect(heading).not.toBeNull()
  expect(heading?.className).toContain('text-main-red')
})

test('displays loading state message', () => {
  const mockPush = vi.fn()
  vi.mocked(useRouter).mockReturnValue({
    replace: mockPush,
    push: mockPush,
    back: mockPush,
    forward: mockPush,
    refresh: mockPush,
    prefetch: vi.fn(),
  } as any)

  vi.mocked(useAuthContext).mockReturnValue({
    user: { id: '1', name: 'John Doe' },
    loading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
  } as any)

  vi.mocked(useFavoritesContext).mockReturnValue({
    properties: [],
    loading: true,
    error: null,
  } as any)

  render(<FavoritesPage />)

  const loadingMessage = screen.queryByText('Chargement des favoris…')
  expect(loadingMessage).not.toBeNull()
})

test('displays empty state when no favorites', () => {
  const mockPush = vi.fn()
  const mockReplace = vi.fn()
  vi.mocked(useRouter).mockReturnValue({
    replace: mockReplace,
    push: mockPush,
    back: mockPush,
    forward: mockPush,
    refresh: mockPush,
    prefetch: vi.fn(),
  } as any)

  vi.mocked(useAuthContext).mockReturnValue({
    user: { id: '1', name: 'John Doe' },
    loading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
  } as any)

  vi.mocked(useFavoritesContext).mockReturnValue({
    properties: [],
    loading: false,
    error: null,
  } as any)

  render(<FavoritesPage />)

  // Check if the title renders
  const titles = screen.queryAllByText('Vos favoris')
  expect(titles.length).toBeGreaterThan(0)
})

test('displays error message when there is an error', () => {
  const mockPush = vi.fn()
  vi.mocked(useRouter).mockReturnValue({
    replace: mockPush,
    push: mockPush,
    back: mockPush,
    forward: mockPush,
    refresh: mockPush,
    prefetch: vi.fn(),
  } as any)

  vi.mocked(useAuthContext).mockReturnValue({
    user: { id: '1', name: 'John Doe' },
    loading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
  } as any)

  const errorMessage = 'Erreur lors du chargement des favoris'
  vi.mocked(useFavoritesContext).mockReturnValue({
    properties: [],
    loading: false,
    error: errorMessage,
  } as any)

  render(<FavoritesPage />)

  const error = screen.queryByText(errorMessage)
  expect(error).not.toBeNull()
})

test('renders property cards when favorites are available', () => {
  const mockPush = vi.fn()
  vi.mocked(useRouter).mockReturnValue({
    replace: mockPush,
    push: mockPush,
    back: mockPush,
    forward: mockPush,
    refresh: mockPush,
    prefetch: vi.fn(),
  } as any)

  vi.mocked(useAuthContext).mockReturnValue({
    user: { id: '1', name: 'John Doe' },
    loading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
  } as any)

  const mockProperties = [
    { id: '1', title: 'Apartment in Paris' },
    { id: '2', title: 'House in Lyon' },
  ]

  vi.mocked(useFavoritesContext).mockReturnValue({
    properties: mockProperties,
    loading: false,
    error: null,
  } as any)

  const { container } = render(<FavoritesPage />)

  const propertyCard1 = screen.queryByTestId('property-card-1')
  const propertyCard2 = screen.queryByTestId('property-card-2')

  expect(propertyCard1).not.toBeNull()
  expect(propertyCard2).not.toBeNull()

  const favorites = container.querySelector('section[aria-label="Logements favoris"]')
  expect(favorites).not.toBeNull()
  expect(favorites?.className).toContain('max-w-88.75')
  expect(favorites?.className).toContain('md:max-w-183.5')
  expect(favorites?.className).toContain('lg:max-w-278.75')
})

test('returns null when user is not authenticated and auth is not loading', () => {
  const mockReplace = vi.fn()
  vi.mocked(useRouter).mockReturnValue({
    replace: mockReplace,
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  } as any)

  vi.mocked(useAuthContext).mockReturnValue({
    user: null,
    loading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
  } as any)

  vi.mocked(useFavoritesContext).mockReturnValue({
    properties: [],
    loading: false,
    error: null,
  } as any)

  const { container } = render(<FavoritesPage />)

  expect(container.firstChild).toBeNull()
})
