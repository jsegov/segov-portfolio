import { render, screen, fireEvent } from '@testing-library/react'
import Chat from '../chat'

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = function() {};

// Mock chat functionality
const mockMessages = [
  { id: '1', content: 'Hello', role: 'user' },
  { id: '2', content: 'Hi there!', role: 'assistant' }
];

jest.mock('ai/react', () => ({
  useChat: () => ({
    messages: mockMessages,
    input: '',
    handleInputChange: jest.fn(),
    handleSubmit: jest.fn(),
  }),
}))

describe('Chat', () => {
  it('renders chat button when closed', () => {
    render(<Chat />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('opens chat window when button is clicked', () => {
    render(<Chat />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(screen.getByText('ask me anything')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ask me anything...')).toBeInTheDocument()
  })

  it('closes chat window when close button is clicked', () => {
    render(<Chat />)
    // Open chat
    fireEvent.click(screen.getByRole('button'))
    // Close chat
    fireEvent.click(screen.getByLabelText('Close chat'))
    
    // Chat window should be closed, only chat button visible
    expect(screen.queryByText('ask me anything')).not.toBeInTheDocument()
  })

  it('displays messages correctly', () => {
    render(<Chat />)
    fireEvent.click(screen.getByRole('button'))
    
    // Check if messages are displayed
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Hi there!')).toBeInTheDocument()
  })
}) 