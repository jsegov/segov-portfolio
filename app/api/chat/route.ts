import { OpenAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    
    // If there's no system message in the incoming messages,
    // fetch it from the context endpoint
    if (!messages.some(m => m.role === 'system')) {
      const contextResponse = await fetch(new URL('/api/chat/context', req.url));
      if (contextResponse.ok) {
        const systemContent = await contextResponse.text();
        messages.unshift({ role: 'system', content: systemContent });
      }
    }

    const isDeepseek = process.env.MODEL_PROVIDER === 'deepseek';
    const apiUrl = isDeepseek 
      ? 'https://api.deepseek.com/v1/chat/completions' 
      : 'https://api.openai.com/v1/chat/completions';
    
    const apiKey = isDeepseek 
      ? process.env.DEEPSEEK_API_KEY 
      : process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: isDeepseek ? 'deepseek-chat' : 'gpt-4o-mini',
        messages: messages.map(message => ({
          role: message.role,
          content: message.content
        })),
        stream: true,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}\n${JSON.stringify(error, null, 2)}`
      );
    }

    // Create a TransformStream to handle the response
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