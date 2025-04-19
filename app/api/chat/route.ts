import { OpenAIStream, StreamingTextResponse } from 'ai';
import { prepareChatRequest, sendChatRequest } from './services';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    
    // Prepare chat request with services
    const { provider, messages: updatedMessages } = await prepareChatRequest({
      messages,
      baseUrl: req.url
    });
    
    // Send request to appropriate provider
    const response = await sendChatRequest(updatedMessages, provider);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}\n${JSON.stringify(error, null, 2)}`
      );
    }

    // Use Vercel AI SDK for OpenAI-compatible streams (works with both OpenAI and DeepSeek)
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred during the chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
} 