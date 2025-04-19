import { NextResponse } from 'next/server';
import { GET } from '../route';
import { ChatConfigService } from '../service';

jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: { status?: number }) => {
      if (init?.status === 500) {
        return {
          json: () => Promise.resolve({ error: 'Failed to validate chat configuration' }),
        };
      }
      return {
        json: () => Promise.resolve(data),
      };
    },
  },
}));

// Mock Request class with NextRequest-like interface
class MockRequest {
  url: string;
  method: string;
  headers: Headers;
  
  constructor(url: string, init?: RequestInit) {
    this.url = url;
    this.method = init?.method || 'GET';
    this.headers = new Headers(init?.headers);
  }

  json() {
    return Promise.resolve({});
  }
}

// Add Request to global scope before importing any modules
(global as any).Request = MockRequest;

describe('ChatConfigService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      SUPABASE_URL: 'test-url',
      SUPABASE_ANON_KEY: 'test-key',
    };

    // Set up default mock for fetch that returns a successful response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.resetAllMocks();
  });

  describe('constructor', () => {
    it('throws error when missing required configuration', () => {
      expect(() => new ChatConfigService(undefined, 'key')).toThrow('Missing required configuration');
      expect(() => new ChatConfigService('url', undefined)).toThrow('Missing required configuration');
    });
  });

  describe('validateConnection', () => {
    it('validates connection successfully', async () => {
      const service = new ChatConfigService('test-url', 'test-key');
      await service.validateConnection();
      expect(global.fetch).toHaveBeenCalledWith('test-url/rest/v1/', {
        headers: {
          'apikey': 'test-key',
        },
      });
    });

    it('throws error on failed connection', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false });
      const service = new ChatConfigService('test-url', 'test-key');
      await expect(service.validateConnection()).rejects.toThrow('Failed to validate Supabase configuration');
    });
  });

  describe('getConfig', () => {
    it('returns correct configuration', () => {
      const service = new ChatConfigService('test-url', 'test-key');
      expect(service.getConfig()).toEqual({
        apiUrl: '/api/chat',
        anonKey: 'test-key',
      });
    });

    it('handles trailing slash in URL', () => {
      const service = new ChatConfigService('test-url/', 'test-key');
      expect(service.getConfig()).toEqual({
        apiUrl: '/api/chat',
        anonKey: 'test-key',
      });
    });
  });
});

describe('Chat Config API', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      SUPABASE_URL: 'test-url',
      SUPABASE_ANON_KEY: 'test-key',
    };

    // Set up default mock for fetch that returns a successful response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.resetAllMocks();
  });

  it('returns configuration when environment variables are set', async () => {
    const response = await GET();
    const data = await response.json();
    expect(data).toEqual({
      apiUrl: '/api/chat',
      anonKey: 'test-key',
    });
  });

  it('returns error when environment variables are not set', async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;

    const response = await GET();
    const responseData = await response.json();
    expect(responseData).toEqual({
      error: 'Failed to validate chat configuration',
    });
  });

  it('handles network errors', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const response = await GET();
    const data = await response.json();
    expect(data).toEqual({
      error: 'Failed to validate chat configuration',
    });
  });
}); 