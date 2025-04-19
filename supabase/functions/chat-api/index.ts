// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from "jsr:@std/http@^0.218.2/server";
import OpenAI from "npm:openai";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { validateContentType } from "../_shared/validators.ts";

console.log("Hello from Functions!")

const STATIC_PROMPT = `You are Jonathan Segovia's portfolio assistant. Your primary focus is answering questions about Jonathan's professional experience, projects, and skills. However, if you find relevant information in the social media content about other aspects of Jonathan's life (like music, hobbies, or interests), you can also discuss those topics.

Be concise and professional in your responses. If you don't have information about a specific topic in any of the provided content, acknowledge that you don't have those details.

For questions completely unrelated to Jonathan (like general knowledge questions), politely redirect the conversation back to topics about Jonathan that you can discuss based on the available information.`;

async function getSocialMediaContent() {
  try {
    const socialMediaUrls = [
      'https://www.linkedin.com/in/jonathansegovia/',
      'https://github.com/jsegov',
      'https://x.com/jonsegov',
      'https://soundcloud.com/segovmusic'
    ];

    const contents = await Promise.all(
      socialMediaUrls.map(async (url) => {
        try {
          const response = await fetch(url);
          if (!response.ok) return '';
          const html = await response.text();
          const cleanedText = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          return `${url}:\n${cleanedText.slice(0, 500)}\n`;
        } catch (error) {
          console.error(`Error fetching ${url}:`, error);
          return '';
        }
      })
    );

    return contents.filter(Boolean).join('\n\n');
  } catch (error) {
    console.error('Error loading social media content:', error);
    return '';
  }
}

async function getWebsiteContent() {
  try {
    const baseUrl = Deno.env.get('SITE_URL');
    
    // Fetch content from main pages
    const pages = [
      { path: '/career', maxLength: 2000 },
      { path: '/', maxLength: 1000 },
      { path: '/projects', maxLength: 500 }
    ];

    const contents = await Promise.all(
      pages.map(async ({ path, maxLength }) => {
        try {
          const res = await fetch(`${baseUrl}${path}`);
          if (!res.ok) return '';
          const html = await res.text();
          const cleanedText = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          return `${path}:\n${cleanedText.slice(0, maxLength)}\n`;
        } catch (error) {
          console.error(`Error fetching ${path}:`, error);
          return '';
        }
      })
    );

    return contents.filter(Boolean).join('\n\n');
  } catch (error) {
    console.error('Error gathering website content:', error);
    return '';
  }
}

export async function handler(req: Request): Promise<Response> {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Validate request method
  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders
    });
  }

  // Validate content type
  if (!validateContentType(req)) {
    return new Response('Invalid content type', {
      status: 400,
      headers: corsHeaders
    });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request body', {
        status: 400,
        headers: corsHeaders
      });
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('Missing OpenAI API key');
    }

    const socialMediaContent = await getSocialMediaContent();
    const websiteContent = await getWebsiteContent();
    const systemMessage = {
      role: 'system',
      content: `${STATIC_PROMPT}\n\nHere is the latest content from Jonathan's website:\n\n${websiteContent}\n\nHere is the latest content from Jonathan's social media profiles:\n\n${socialMediaContent}`
    };

    const openai = new OpenAI({ apiKey });
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      stream: true
    });

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) {
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        }
        controller.close();
      }
    });

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream'
      }
    });
  } catch (error) {
    console.error('Error processing chat request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
}

serve(handler);
