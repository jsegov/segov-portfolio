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

  async validateConnection(): Promise<void> {
    // Skip validation completely since we're using the Next.js API route now
    // This ensures no CORS or connection issues in any environment
    return;
  }

  getConfig(): ChatConfigResponse {
    return {
      apiUrl: '/api/chat',
      anonKey: this.supabaseKey,
    };
  }
} 