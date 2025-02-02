import { headers } from 'next/headers';

interface Document {
  pageContent: string;
  metadata: {
    source: string;
  };
}

function truncateText(text: string, maxLength: number = 1000): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).split(' ').slice(0, -1).join(' ') + '...';
}

function cleanText(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b(https?:\/\/[^\s]+)/g, '')
    .replace(/[^\w\s.,!?-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function getSocialMediaContent() {
  try {
    const socialMediaUrls = [
      'https://www.linkedin.com/in/jonathansegovia/',
      'https://github.com/jsegov',
      'https://x.com/jonsegov',
      'https://soundcloud.com/segovmusic'
    ];

    const docs = await Promise.all(
      socialMediaUrls.map(async (url) => {
        try {
          const response = await fetch(url);
          const html = await response.text();
          return {
            pageContent: cleanText(html),
            metadata: { source: url }
          } as Document;
        } catch (error) {
          console.error(`Error fetching ${url}:`, error);
          return null;
        }
      })
    );

    const validDocs = docs.filter((doc): doc is Document => doc !== null);
    return validDocs.map(doc => `${doc.metadata.source}:\n${truncateText(doc.pageContent, 500)}`).join('\n\n');
  } catch (error) {
    console.error('Error loading social media content:', error);
    return '';
  }
}

export async function getWebsiteContent() {
  try {
    const headersList = headers();
    const domain = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${domain}`;

    // Get both website and social media content
    const [websiteContent, socialContent] = await Promise.all([
      // Website content
      Promise.all(
        [
          { path: '/career', maxLength: 2000 },
          { path: '/', maxLength: 1000 },
          { path: '/projects', maxLength: 500 }
        ].map(async ({ path, maxLength }) => {
          try {
            const res = await fetch(`${baseUrl}${path}`);
            const html = await res.text();
            const cleanedText = cleanText(html);
            const truncatedText = truncateText(cleanedText, maxLength);
            return truncatedText ? `${path}:\n${truncatedText}\n` : '';
          } catch (error) {
            console.error(`Error fetching ${path}:`, error);
            return '';
          }
        })
      ),
      // Social media content
      getSocialMediaContent()
    ]);

    const combinedContent = [
      ...websiteContent.filter(Boolean),
      socialContent ? 'Social Media Profiles:\n' + socialContent : ''
    ].filter(Boolean).join('\n\n');

    return combinedContent;
  } catch (error) {
    console.error('Error gathering content:', error);
    return 'Error gathering content';
  }
} 
