import { headers } from 'next/headers';

function truncateText(text: string, maxLength: number = 1000): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).split(' ').slice(0, -1).join(' ') + '...';
}

function cleanText(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove styles
    .replace(/<[^>]*>/g, ' ') // Remove HTML tags
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\b(https?:\/\/[^\s]+)/g, '') // Remove URLs
    .replace(/[^\w\s.,!?-]/g, ' ') // Remove special characters
    .replace(/\s+/g, ' ') // Clean up any double spaces
    .trim();
}

export async function getWebsiteContent() {
  try {
    const headersList = headers();
    const domain = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${domain}`;

    // Prioritize pages and set length limits
    const pageConfigs = [
      { path: '/career', maxLength: 2000 }, // Career gets more tokens as it's most important
      { path: '/', maxLength: 1000 },       // Homepage gets medium priority
      { path: '/blog', maxLength: 500 }     // Blog gets least tokens as it might be less relevant
    ];

    const contents = await Promise.all(
      pageConfigs.map(async ({ path, maxLength }) => {
        try {
          const res = await fetch(`${baseUrl}${path}`);
          const html = await res.text();
          const cleanedText = cleanText(html);
          const truncatedText = truncateText(cleanedText, maxLength);
          
          // Only include the page label if there's actual content
          return truncatedText ? `${path}:\n${truncatedText}\n` : '';
        } catch (error) {
          console.error(`Error fetching ${path}:`, error);
          return '';
        }
      })
    );

    // Filter out empty strings and join with double newlines for better readability
    return contents.filter(Boolean).join('\n\n');
  } catch (error) {
    console.error('Error gathering website content:', error);
    return 'Error gathering website content';
  }
} 
