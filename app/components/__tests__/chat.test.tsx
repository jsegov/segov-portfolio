import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import Chat from '../chat'
import { useChat } from 'ai/react'

// Mock the useChat hook
jest.mock('ai/react', () => ({
  useChat: jest.fn()
}))

const mockUseChat = useChat as jest.Mock

const defaultUseChatReturn = {
  messages: [],
  input: '',
  handleInputChange: jest.fn(),
  handleSubmit: jest.fn(),
  isLoading: false,
}

describe('Chat Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseChat.mockReturnValue(defaultUseChatReturn)
    
    // Mock successful fetch by default
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ apiUrl: 'test-url', anonKey: 'test-key' }),
      })
    ) as jest.Mock
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  const renderAndWaitForConfig = async () => {
    let renderResult
    await act(async () => {
      renderResult = render(<Chat />)
    })
    
    // Wait for the fetch to be called and state to update
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/chat-config')
    }, { timeout: 3000 })

    // Wait for any state updates to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    return renderResult
  }

  it('renders chat button when closed', async () => {
    await renderAndWaitForConfig()
    expect(screen.getByLabelText('Open chat')).toBeInTheDocument()
  })

  it('opens chat window when button is clicked', async () => {
    await renderAndWaitForConfig()
    
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Open chat'))
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    expect(screen.getByLabelText('Close chat')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('ask me anything')).toBeInTheDocument()
  })

  it('closes chat window when close button is clicked', async () => {
    await renderAndWaitForConfig()
    
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Open chat'))
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Close chat'))
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    expect(screen.getByLabelText('Open chat')).toBeInTheDocument()
  })

  it('displays loading dots when isLoading is true', async () => {
    mockUseChat.mockReturnValue({
      ...defaultUseChatReturn,
      isLoading: true,
    })

    await renderAndWaitForConfig()
    
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Open chat'))
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    expect(screen.getByTestId('loading-dots')).toBeInTheDocument()
  })

  it('displays error message when configuration fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Test error' }),
      })
    ) as jest.Mock

    await act(async () => {
      render(<Chat />)
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/chat-config')
    }, { timeout: 3000 })
    
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Open chat'))
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    expect(screen.getByText('Test error')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Chat temporarily unavailable')).toBeDisabled()
  })

  it('displays messages correctly', async () => {
    mockUseChat.mockReturnValue({
      ...defaultUseChatReturn,
      messages: [
        { id: '1', role: 'user', content: 'Hello' },
        { id: '2', role: 'assistant', content: 'Hi there!' },
      ],
    })

    await renderAndWaitForConfig()
    
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Open chat'))
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Hi there!')).toBeInTheDocument()
  })
}) 