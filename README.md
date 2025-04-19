# segov.dev

Personal portfolio website and API.

## Project Summary

A modern portfolio website featuring an AI-powered chat assistant that can answer questions about my professional experience, projects, and skills. The assistant dynamically fetches and processes content from my social media profiles and website pages to provide up-to-date information.

Key features:
- Interactive AI chat assistant which supports OpenAI and DeepSeek models
- Real-time content aggregation from social media profiles
- Modern, responsive web interface
- Server-side streaming API responses

## Technologies

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **OpenAI API** - Language model provider for the chat assistant
- **TypeScript** - Type-safe programming language

### Frontend
- **Next.js** - React framework for web applications
- **React** - UI library
- **TailwindCSS** - Utility-first CSS framework
- **Vercel AI SDK** - Streaming AI responses

### Infrastructure
- **Supabase** - Backend as a Service platform for authentication and configuration
- **Vercel** - Frontend hosting and deployment
- **GitHub Actions** - CI/CD pipeline

### Development
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Local Development

### Prerequisites
- Node.js 18+
- pnpm 8+
- OpenAI API key

### Environment Setup
1. Install pnpm (if not already installed)
```bash
# Using npm
npm install -g pnpm

# Using curl (Linux/macOS)
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Using Homebrew (macOS)
brew install pnpm
```

2. Clone the repository
```bash
git clone https://github.com/jsegov/segov-portfolio.git
cd segov-portfolio
```

3. Install dependencies
```bash
pnpm install
```

4. Set up environment variables
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
1. Run the development server
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Testing

#### Running Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Building for Production
```bash
pnpm build
```

## Deployment

### CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment. The pipeline:
1. Runs tests
2. Deploys the frontend to Vercel

Required GitHub Secrets:
```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

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