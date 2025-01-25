import { render, screen } from '@testing-library/react'
import { Navbar } from '../nav'

describe('Navbar', () => {
  it('renders all navigation links', () => {
    render(<Navbar />)
    
    // Check if all nav links are present
    expect(screen.getByText('home')).toBeInTheDocument()
    expect(screen.getByText('career')).toBeInTheDocument()
    expect(screen.getByText('projects')).toBeInTheDocument()
  })

  it('has correct href attributes', () => {
    render(<Navbar />)
    
    // Check if links have correct hrefs
    expect(screen.getByText('home').closest('a')).toHaveAttribute('href', '/')
    expect(screen.getByText('career').closest('a')).toHaveAttribute('href', '/career')
    expect(screen.getByText('projects').closest('a')).toHaveAttribute('href', '/projects')
  })
}) 