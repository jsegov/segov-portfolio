import { ChatConfigResponse } from './types';

export class ChatConfigService {
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor(supabaseUrl?: string, supabaseKey?: string) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing required configuration');
    }
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
  }

  private formatBaseUrl(): string {
    return this.supabaseUrl.endsWith('/')
      ? this.supabaseUrl.slice(0, -1)
      : this.supabaseUrl;
  }

  async validateConnection(): Promise<void> {
    // Skip validation in production since we're using the Next.js API
    if (process.env.NODE_ENV === 'production') {
      return; // Skip validation in production
    }

    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': this.supabaseKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Supabase returned error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to validate Supabase configuration: ${errorMessage}`);
    }
  }

  getConfig(): ChatConfigResponse {
    return {
      apiUrl: '/api/chat',
      anonKey: this.supabaseKey,
    };
  }
} 