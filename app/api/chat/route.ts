import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { getWebsiteContent } from '../../utils/content';

const getOpenAIClient = () => {
  const provider = process.env.MODEL_PROVIDER;
  
  if (provider === 'deepseek') {
    return new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com'
    });
  }
  
  // Default to OpenAI
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

const getModelName = () => {
  const provider = process.env.MODEL_PROVIDER;
  return provider === 'deepseek' ? 'deepseek-chat' : 'gpt-4o-mini';
};

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const websiteContent = await getWebsiteContent();
  const openai = getOpenAIClient();

  const response = await openai.chat.completions.create({
    model: getModelName(),
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