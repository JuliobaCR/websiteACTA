# Website

Modern web interface for the ACTA (Automated Credential Trust Authority) ecosystem, featuring Passkey authentication and Stellar blockchain integration.

## Overview

ACTA Web provides a sophisticated frontend experience for managing verifiable credentials on the Stellar blockchain. Built with Next.js 15 and featuring cutting-edge Passkey authentication, it eliminates the need for traditional wallets or seed phrases while maintaining the highest security standards.

## Key Features

### Passkey Authentication

- **WebAuthn Integration**: Industry-standard biometric authentication
- **No Seed Phrases**: Secure wallet creation without traditional crypto complexity
- **Cross-Device Sync**: Passkeys work seamlessly across all your devices
- **Stellar Wallet Generation**: Automatic wallet creation from biometric data
- **Enhanced Security**: Private keys never leave your device

### Modern UI/UX

- **Particle Background System**: Dynamic animated particles throughout the app
- **Glass Morphism Design**: Transparent elements with backdrop blur effects
- **Responsive Layout**: Mobile-first design that works on all screen sizes
- **Dark Theme**: Elegant dark interface optimized for usability
- **Smooth Animations**: Fluid transitions and micro-interactions

### Credential Management

- **Create Verifiable Credentials**: Issue tamper-proof credentials on blockchain
- **Credential Dashboard**: Comprehensive view of all your credentials
- **Search and Filter**: Find credentials quickly with advanced search
- **Public Verification**: Share verification links for instant credential validation
- **Status Management**: Track credential lifecycle and expiration

### API Integration

- **Secure API Keys**: Generate and manage authentication keys
- **Real-time Sync**: Live updates from the ACTA blockchain network
- **RESTful Architecture**: Clean integration with backend services
- **Error Handling**: Comprehensive error handling and user feedback

## Tech Stack

### Core Framework

- **Next.js 15.5.0** with App Router and Turbopack
- **React 19** with modern hooks and concurrent features
- **TypeScript** for comprehensive type safety
- **Tailwind CSS** for utility-first styling

### Authentication & Blockchain

- **WebAuthn** for passkey implementation
- **Stellar SDK** for blockchain interactions
- **Custom Wallet Management** via passkey-derived keys
- **JWT Authentication** for session management

### UI Components

- **Radix UI** primitives for accessibility
- **shadcn/ui** component library
- **Lucide React** for icon system
- **Framer Motion** for animations
- **Custom Particle System** for background effects

### Development Tools

- **ESLint** with custom configuration
- **Prettier** for code formatting
- **Husky** for git hooks
- **TypeScript** strict mode

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Modern browser with WebAuthn support
- **Docker Desktop** (optional — required only for local Supabase database)
- **Supabase CLI** (optional — `npm i -g supabase` or use via `npx supabase`)

> **Note:** Docker and Supabase CLI are only needed if you want a local database for waitlist persistence. Without them, the app runs normally using placeholder credentials — waitlist submissions will simply not be stored.

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/ACTA-web.git
cd ACTA-web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Configuration

Configure `.env` with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.acta.build

# Application Settings
NEXT_PUBLIC_APP_NAME=ACTA Web
NEXT_PUBLIC_STELLAR_NETWORK=testnet

# Features
NEXT_PUBLIC_ENABLE_PASSKEY=true
NEXT_PUBLIC_ENABLE_PARTICLES=true
```

### Local Supabase (Docker) — Optional

The project includes a full local Supabase setup for waitlist persistence. **This is entirely optional.** When Supabase environment variables are missing or contain placeholder values, the app starts normally and the waitlist form submits without errors (requests simply won't be persisted).

#### Quick start

1. **Install & start Docker Desktop** — make sure the Docker engine is running.
2. **Start Supabase locally:**

   ```bash
   npm run db:start
   ```

   This pulls the Supabase Docker images (first run takes a few minutes) and prints the local credentials, including `API URL`, `anon key`, and `service_role key`.

3. **Copy the printed credentials into `.env.local`:**

   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from db:start>
   SUPABASE_SERVICE_ROLE_KEY=<service_role key from db:start>
   ```

4. **Run migrations and seed:**

   ```bash
   npm run db:reset
   ```

   This applies all migrations in `supabase/migrations/` and runs `supabase/seed.sql`, which inserts 8 sample waitlist rows.

5. **Start the dev server:**

   ```bash
   npm run dev
   ```

#### Available database scripts

| Script | Command | Description |
| --- | --- | --- |
| `npm run db:start` | `supabase start` | Start local Supabase (Docker containers) |
| `npm run db:stop` | `supabase stop` | Stop local Supabase |
| `npm run db:reset` | `supabase db reset` | Drop & recreate DB, run migrations + seed |
| `npm run db:migration <name>` | `supabase migration new` | Create a new blank migration file |

#### Supabase Studio

When Supabase is running locally, you can access **Supabase Studio** at [http://127.0.0.1:54323](http://127.0.0.1:54323) to browse tables, run SQL, and inspect data.

#### Credential fallbacks

The Supabase client (`src/lib/supabase.ts`) is designed to be resilient:

- If `NEXT_PUBLIC_SUPABASE_URL` is missing or contains `"your_supabase"` / `"placeholder"`, a safe placeholder URL is used.
- If `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing, a placeholder JWT is used.
- If `SUPABASE_SERVICE_ROLE_KEY` is missing, the server falls back to the anon client and logs a warning.
- **The app never throws at startup** regardless of whether Supabase env vars are set.

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Type checking
npm run type-check
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                        # Next.js 15 App Router
│   ├── page.tsx               # Login page with passkey auth
│   ├── dashboard/             # Protected dashboard routes
│   │   ├── layout.tsx         # Dashboard layout with sidebar
│   │   ├── page.tsx           # Main dashboard
│   │   ├── profile/           # User profile management
│   │   ├── api-key/           # API key generation
│   │   ├── credentials/       # Credential creation
│   │   ├── my-credentials/    # Credential management
│   │   └── search-credential/ # Credential search
│   ├── verify/                # Public credential verification
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles and theme
├── components/
│   ├── layout/                # Layout components
│   │   └── Sidebar.tsx        # Navigation sidebar
│   ├── modules/               # Feature-specific components
│   │   ├── auth/              # Passkey authentication
│   │   ├── credentials/       # Credential management
│   │   ├── dashboard/         # Dashboard components
│   │   ├── api-key/          # API key management
│   │   └── profile/          # Profile management
│   ├── ui/                    # Reusable UI components
│   └── magicui/              # Special effects (particles)
├── hooks/                     # Custom React hooks
├── lib/                       # Utility functions and configurations
├── providers/                 # React context providers
├── services/                  # API communication services
└── types/                     # TypeScript type definitions
```

## Authentication Flow

### Passkey Registration

1. User visits application homepage
2. Clicks "Authenticate with Passkey"
3. Browser prompts for biometric authentication
4. WebAuthn creates cryptographic key pair
5. Public key sent to server, private key stored locally
6. Stellar wallet address generated from passkey
7. User automatically logged in and redirected to dashboard

### Passkey Login

1. Returning user visits homepage
2. Clicks "Authenticate with Passkey"
3. Browser recognizes existing passkey
4. Biometric verification requested
5. Cryptographic challenge/response performed
6. Authentication token issued
7. Redirect to dashboard with wallet access

## Route Structure

```
/ (root)                         # Passkey login page
├── /dashboard                   # Main dashboard (auth required)
├── /dashboard/profile           # User profile and wallet info
├── /dashboard/api-key           # API key generation
├── /dashboard/credentials       # Create new credentials
├── /dashboard/my-credentials    # View/manage credentials
├── /dashboard/search-credential # Search for credentials
└── /verify                      # Public credential verification
```

## Security Features

### Passkey Security

- **Hardware-Backed Keys**: Stored in secure hardware (TPM, Secure Enclave)
- **Biometric Gating**: Access requires fingerprint, face, or PIN
- **Phishing Resistant**: Domain-bound authentication prevents attacks
- **No Shared Secrets**: No passwords or seed phrases to compromise

### Application Security

- **HTTPS Enforcement**: All communications encrypted in transit
- **JWT Tokens**: Secure session management with expiration
- **Input Validation**: Comprehensive sanitization of user inputs
- **CORS Protection**: Proper cross-origin resource sharing controls
- **Content Security Policy**: XSS and injection attack prevention

### Blockchain Security

- **Immutable Storage**: Credentials permanently stored on Stellar
- **Cryptographic Proofs**: Mathematical verification of authenticity
- **Decentralized Verification**: No central authority required
- **Smart Contract Logic**: Automated credential lifecycle management

## Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Configure environment variables in dashboard
3. Enable automatic deployments on main branch
4. Production URL provided automatically

### Manual Deployment

```bash
# Build application
npm run build

# Start production server
npm run start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t acta-web .

# Run container
docker run -p 3000:3000 acta-web
```

## Browser Support

### Passkey Compatibility

- **Chrome**: 67+ (Windows, macOS, Android)
- **Safari**: 14+ (macOS, iOS)
- **Firefox**: 60+ (Windows, macOS)
- **Edge**: 79+ (Windows)

### Platform Support

- **Windows**: Windows Hello (Windows 10+)
- **macOS**: Touch ID, Face ID
- **iOS**: Touch ID, Face ID
- **Android**: Biometric authentication (Android 9+)
- **Hardware Keys**: FIDO2/U2F security keys

## Performance

### Optimization Features

- **Turbopack**: Ultra-fast build system for development
- **App Router**: Optimized routing with React Server Components
- **Image Optimization**: Automatic WebP conversion and lazy loading
- **Code Splitting**: Automatic bundle optimization
- **Static Generation**: Pre-rendered pages for optimal performance

### Bundle Analysis

```bash
# Analyze bundle size
npm run analyze

# Performance audit
npm run lighthouse
```

## Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/awesome-feature`)
3. Make changes following code style guidelines
4. Write or update tests as needed
5. Run linting and type checking
6. Commit changes with descriptive messages
7. Push to feature branch
8. Create Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled, comprehensive typing
- **ESLint**: Custom configuration with React and Next.js rules
- **Prettier**: Automatic code formatting on save
- **Conventional Commits**: Standardized commit message format
- **Testing**: Jest and React Testing Library for unit tests

## API Integration

The frontend integrates with the ACTA API for:

### Authentication Endpoints

- `POST /v1/auth/register` - Passkey registration
- `POST /v1/auth/login` - Passkey authentication
- `GET /v1/auth/profile` - User profile data

### Credential Endpoints

- `POST /v1/credentials` - Create new credentials
- `GET /v1/credentials` - List user credentials
- `GET /v1/credentials/:id` - Get credential details
- `POST /v1/verify` - Verify credential authenticity

### API Key Endpoints

- `POST /v1/api-keys/generate` - Generate new API key
- `GET /v1/api-keys` - List user API keys
- `DELETE /v1/api-keys/:id` - Revoke API key

## Monitoring and Analytics

### Performance Monitoring

- **Web Vitals**: Core web vitals tracking
- **Real User Monitoring**: Performance data from actual users
- **Error Tracking**: Comprehensive error logging and alerting
- **Bundle Analysis**: Regular bundle size monitoring

### User Analytics

- **Conversion Tracking**: Authentication flow completion rates
- **Feature Usage**: Most used features and user journeys
- **Performance Metrics**: Page load times and user experience

## License

This project is part of the ACTA ecosystem for verifiable credentials on Stellar blockchain.

## Support

For questions, issues, or contributions:

- **GitHub Issues**: Technical problems and feature requests
- **Documentation**: Comprehensive guides and API reference
- **Community**: Join our developer community discussions
