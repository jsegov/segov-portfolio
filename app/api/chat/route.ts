import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { getWebsiteContent } from '../../utils/content';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const websiteContent = await getWebsiteContent();

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `You are Jonathan Segovia's portfolio assistant. Answer questions about Jonathan's experience, projects, and skills using the following website content. Be concise and professional. For unrelated topics, politely redirect to portfolio topics.

Website Content:
${websiteContent}

If information isn't in the content above, acknowledge that you don't have that specific detail.`
      },
      ...messages
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
} 