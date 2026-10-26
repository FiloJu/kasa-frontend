import { expect, test, vi } from 'vitest'
import { render, screen } from "@testing-library/react"
import Home from './page'

vi.mock('../../components/PropertiesList', () => ({
  default: () => <div></div>
}))

test('rendering', () => {
  render(
    <Home />
  )
  
  const heading = screen.queryByText("Liste des logements disponibles")
  expect(heading).not.toBeNull()
})
