# segov.dev

Personal portfolio website and API.

## Project Summary

A modern portfolio website featuring an AI-powered chat assistant that can answer questions about my professional experience, projects, and skills. The assistant dynamically fetches and processes content from my social media profiles and website pages to provide up-to-date information.

Key features:
- Interactive AI chat assistant which supports OpenAI and DeepSeek models
- Real-time content aggregation from social media profiles
- Serverless architecture with edge functions
- Modern, responsive web interface

## Technologies

### Backend
- **Supabase Edge Functions** - Serverless functions running on Deno
- **OpenAI API** - Language model provider for the chat assistant
- **Deno** - Runtime environment for edge functions
- **TypeScript** - Type-safe programming language

### Frontend
- **Next.js** - React framework for web applications
- **React** - UI library
- **TailwindCSS** - Utility-first CSS framework

### Infrastructure
- **Supabase** - Backend as a Service platform
- **Vercel** - Frontend hosting and deployment
- **GitHub Actions** - CI/CD pipeline

### Development
- **Jest** - Testing framework for frontend
- **Deno Test** - Testing framework for edge functions
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Local Development

### Prerequisites
- Node.js 18+
- pnpm 8+
- Deno 1.37+
- Supabase CLI
- OpenAI API key

### Environment Setup
1. Clone the repository
```bash
git clone https://github.com/jsegov/segov-portfolio.git
cd segov-portfolio
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Required environment variables:
```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Site Configuration
SITE_URL=http://localhost:3000 # for development
```

### Running Locally
1. Start Supabase services
```bash
supabase start
```

2. Run the development server
```bash
pnpm dev
```

3. Start the edge functions
```bash
cd supabase/functions
deno task dev
```

The application will be available at `http://localhost:3000`

### Testing

#### Frontend Tests
Run Jest tests for the frontend components:
```bash
pnpm test
```

#### Edge Function Tests
The edge functions use Deno's built-in testing framework. Tests are located in `supabase/functions/tests/`.

Run all edge function tests:
```bash
cd supabase/functions
deno test --allow-env --allow-net
```

Run specific test file:
```bash
deno test --allow-env --allow-net tests/chat-api-test.ts
```

### Building for Production
```bash
pnpm build
```

## Deployment

### CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment. The pipeline:
1. Runs frontend and edge function tests
2. Deploys edge functions to Supabase
3. Deploys the frontend to Vercel

Required GitHub Secrets:
```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_PROJECT_ID=your_project_id
SUPABASE_ACCESS_TOKEN=your_access_token

# Vercel
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

For more detailed information about deployment and configuration, please refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
