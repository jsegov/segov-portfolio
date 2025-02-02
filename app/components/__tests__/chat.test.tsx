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
    isLoading: false,
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
    
    const input = screen.getByPlaceholderText('ask me anything')
    expect(input).toBeInTheDocument()
  })

  it('closes chat window when close button is clicked', () => {
    render(<Chat />)
    // Open chat
    fireEvent.click(screen.getByRole('button'))
    // Close chat
    fireEvent.click(screen.getByLabelText('Close chat'))
    
    // Chat window should be closed, only chat button visible
    expect(screen.queryByPlaceholderText('ask me anything')).not.toBeInTheDocument()
  })

  it('displays messages correctly', () => {
    render(<Chat />)
    fireEvent.click(screen.getByRole('button'))
    
    // Check if messages are displayed
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Hi there!')).toBeInTheDocument()
  })
}) 