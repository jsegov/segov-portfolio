export function validateRequestBody<T>(body: unknown, validator: (data: unknown) => data is T): T | null {
  if (!body) return null;
  if (!validator(body)) return null;
  return body;
}

export function validateApiKey(apiKey: string | null): boolean {
  if (!apiKey) return false;
  const expectedApiKey = Deno.env.get('API_KEY');
  if (!expectedApiKey) return false;
  return apiKey === expectedApiKey;
}

export function validateContentType(req: Request, contentType: string = 'application/json'): boolean {
  return req.headers.get('content-type')?.includes(contentType) ?? false;
} 