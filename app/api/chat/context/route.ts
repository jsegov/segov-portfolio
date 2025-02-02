import { headers } from 'next/headers';

// Static content as a fallback
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
    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

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

export const runtime = 'edge';

export async function GET() {
  try {
    const [websiteContent, socialContent] = await Promise.all([
      getWebsiteContent(),
      getSocialMediaContent()
    ]);
    
    const systemPrompt = `${STATIC_PROMPT}

Website Content:
${websiteContent}

Social Media Profiles:
${socialContent}

If information isn't in the content above, acknowledge that you don't have that specific detail.`;

    return new Response(systemPrompt, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Context API Error:', error);
    return new Response('An error occurred while fetching the context.', { status: 500 });
  }
} 