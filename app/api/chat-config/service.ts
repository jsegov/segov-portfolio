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
    const response = await fetch(`${this.supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': this.supabaseKey,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to validate Supabase configuration');
    }
  }

  getConfig(): ChatConfigResponse {
    const baseUrl = this.formatBaseUrl();
    return {
      apiUrl: `${baseUrl}/functions/v1/chat-api`,
      anonKey: this.supabaseKey,
    };
  }
} 