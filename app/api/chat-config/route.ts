import { NextResponse } from 'next/server';
import { ChatConfigService } from './service';
import { ChatConfigError } from './types';

export async function GET() {
  try {
    const service = new ChatConfigService(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    await service.validateConnection();
    return NextResponse.json(service.getConfig());
  } catch (error) {
    console.error('Chat config error:', error);
    const response: ChatConfigError = {
      error: 'Failed to validate chat configuration'
    };
    return NextResponse.json(response, { status: 500 });
  }
} 