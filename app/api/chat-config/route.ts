import { NextResponse } from 'next/server';
import { ChatConfigResponse } from './types';

export async function GET() {
  // Directly return the chat configuration without any validation
  // This ensures the chat always works regardless of Supabase configuration
  const config: ChatConfigResponse = {
    apiUrl: '/api/chat',
    // Use a dummy value if the actual key is missing - it's just for authorization header
    // and since we're using our own Next.js API route, we control the authorization
    anonKey: process.env.SUPABASE_ANON_KEY || 'dummy-key-for-authorization-header',
  };
  
  return NextResponse.json(config);
} 