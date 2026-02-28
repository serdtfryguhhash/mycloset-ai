# MyCloset.ai - AI-Powered Closet Manager & Fashion Social Commerce

A full-stack fashion social network and commerce platform with AI-powered wardrobe management, outfit generation, and affiliate earnings.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **UI:** Shadcn/UI components + Framer Motion animations
- **State:** Zustand
- **Auth:** Supabase Auth (Email, Google, Apple, Instagram OAuth)
- **Database:** PostgreSQL (Supabase) + Redis
- **AI:** OpenAI GPT-4 Vision (clothing analysis) + DALL-E 3 (outfit visualization)
- **Payments:** Stripe (subscriptions) + Stripe Connect (creator payouts)
- **Images:** Cloudinary (optimization)
- **Charts:** Recharts

## Features

### AI Closet Manager
Upload clothing photos. GPT-4 Vision auto-detects category, colors, brand, material, and style tags. Items are organized with smart filtering and search.

### AI Outfit Generator
Select occasion + weather conditions. AI generates 5 optimized outfit combinations from your closet with style scores.

### AI Outfit Visualization
DALL-E 3 generates flat-lay or model visualizations of your outfit combinations.

### Social Feed
Pinterest-style masonry grid with posts, likes, saves, comments, and sharing. Follow users and explore trending content.

### Affiliate Commerce
Link products in posts with affiliate URLs. Earn commissions on clicks and conversions. Platform takes a cut. Full FTC compliance with "Includes affiliate links" labeling.

### Earnings Dashboard
Track clicks, conversions, commissions, and payouts. Interactive charts with Recharts. Export reports. Request payouts via Stripe Connect.

### Style Challenges
Weekly themed challenges with community voting. Winners earn prizes and badges. Challenge statuses: upcoming, active, voting, completed.

### Marketplace Shop
Aggregated marketplace of affiliate-linked items from the community. Search, filter, sort by trending/price/rating.

### User Profiles
Instagram-style profiles with outfit grid, Style DNA analysis, badges, and follower stats.

### Subscriptions
- **Free ($0/mo):** 50 items, 3 AI generations/month
- **Stylist ($9.99/mo):** Unlimited items, 25 AI generations, 5% commission
- **Influencer ($24.99/mo):** Unlimited everything, 12% commission, Stripe Connect payouts, verified badge

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, testimonials |
| `/login` | Email + social OAuth login |
| `/signup` | Registration with password strength indicator |
| `/feed` | Social feed with following/trending tabs |
| `/explore` | Pinterest masonry grid discovery |
| `/closet` | Closet management with AI upload |
| `/outfits` | Saved outfit collection |
| `/outfits/generate` | AI outfit generator with step flow |
| `/shop` | Affiliate product marketplace |
| `/challenges` | Style challenges hub |
| `/profile/[username]` | User profiles with Style DNA |
| `/earnings` | Affiliate earnings dashboard |
| `/pricing` | Subscription tiers |
| `/settings` | Account, notifications, billing, privacy |
| `/notifications` | Activity notifications |

## API Routes

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/auth` | POST | Login/signup |
| `/api/closet` | GET, POST, DELETE | CRUD closet items |
| `/api/outfits` | GET, POST | Manage/generate outfits |
| `/api/feed` | GET, POST | Feed posts |
| `/api/shop` | GET | Shop items |
| `/api/challenges` | GET, POST | Challenges + entries |
| `/api/earnings` | GET | Earnings data |
| `/api/affiliate` | GET, POST | Affiliate click tracking |
| `/api/stripe` | POST | Stripe operations |
| `/api/ai` | POST | AI analysis + visualization |
| `/api/users` | GET, POST | User operations |
| `/api/notifications` | GET, PUT | Notifications |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your API keys

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## Environment Variables

See `.env.example` for all required variables:
- Supabase (URL, anon key, service role key)
- Stripe (secret key, publishable key, price IDs, webhook secret)
- OpenAI (API key)
- Cloudinary (cloud name, API key, API secret)

## Database

Schema is in `database/schema.sql`. Run against your Supabase PostgreSQL instance.

## Design System

- **Primary:** #BE185D (Rose)
- **Secondary:** #7C3AED (Purple)
- **Accent:** #F59E0B (Amber)
- **Background:** #FFF1F2
- **Text:** #1C1917
- **Fonts:** Sora (headings), Inter (body)

## FTC Compliance

All posts containing affiliate links display "Includes affiliate links" disclosure per FTC guidelines.
