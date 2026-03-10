# Anastoria

Premium hoodies crafted for those who carry the night.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL + Realtime)
- **Email**: Resend
- **Payments**: Shopify Buy Button SDK
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout (Nav + Footer)
│   ├── globals.css           # Global styles
│   ├── about/page.tsx        # About page
│   ├── contact/page.tsx      # Contact page
│   ├── shop/
│   │   ├── page.tsx          # Shop page (server, metadata)
│   │   └── ShopClient.tsx    # Shop client component
│   ├── sky/
│   │   ├── page.tsx          # Sky page (server, metadata)
│   │   └── SkyClient.tsx     # Interactive star canvas
│   ├── admin/
│   │   ├── page.tsx          # Admin page
│   │   └── AdminClient.tsx   # Review moderation UI
│   └── api/
│       ├── newsletter/route.ts
│       ├── reviews/route.ts
│       └── admin/reviews/
│           ├── route.ts
│           └── [id]/
│               ├── route.ts          # DELETE review
│               └── approve/route.ts  # PATCH approve
├── components/
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── NewsletterForm.tsx
│   ├── ContactForm.tsx
│   ├── ReviewForm.tsx
│   └── ShopifyBuyButton.tsx
└── lib/
    └── supabase.ts
supabase/
└── migrations/
    └── 001_schema.sql
```

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd anastoria
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_SHOPIFY_DOMAIN` | Your Shopify store domain (e.g. `mystore.myshopify.com`) |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Shopify Storefront API access token |
| `NEXT_PUBLIC_SHOPIFY_PRODUCT_ID` | Shopify product ID for the hoodie |
| `RESEND_API_KEY` | Resend API key for sending emails |
| `RESEND_FROM_EMAIL` | Sender email address (e.g. `hello@anastoria.com`) |
| `ADMIN_PASSWORD` | Password for the `/admin` review moderation page (server-side only) |

### 3. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the migration SQL in the Supabase SQL Editor:
   - Open `supabase/migrations/001_schema.sql`
   - Paste and run it in your Supabase project's SQL Editor
3. Enable Realtime for the `stars` table in your Supabase dashboard (Database → Replication)

### 4. Shopify Buy Button Setup

1. In your Shopify admin, go to **Sales channels → Buy Button**
2. Create a Buy Button for your hoodie product
3. Copy the **Storefront Access Token** and **Product ID**
4. Add them to your `.env.local`

### 5. Resend Setup

1. Create an account at [resend.com](https://resend.com)
2. Add and verify your domain (`anastoria.com`)
3. Create an API key and add it to `.env.local`

### 6. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Hero landing page with product teaser, newsletter, and Sky CTA |
| `/shop` | Product page with Shopify buy button and customer reviews |
| `/about` | Brand story and philosophy |
| `/sky` | Interactive star canvas — users click to claim a star |
| `/contact` | Contact form |
| `/admin` | Password-protected review moderation (approve/delete) |

## Admin Workflow

1. Navigate to `/admin`
2. Enter the password set in `NEXT_PUBLIC_ADMIN_PASSWORD`
3. Approve or delete pending reviews
4. Approved reviews appear publicly on the `/shop` page

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Add all environment variables in Vercel project settings
4. Deploy

### Custom Domain

1. In Vercel project → **Settings → Domains**
2. Add `anastoria.com` and `www.anastoria.com`
3. Update your DNS records as instructed by Vercel

## Database Schema

### `reviews`
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `product_id` | text | Product identifier |
| `name` | text | Reviewer name |
| `email` | text | Reviewer email (not shown publicly) |
| `rating` | integer | 1–5 stars |
| `body` | text | Review text |
| `approved` | boolean | Moderation status |
| `created_at` | timestamptz | Submission time |

### `newsletter_subscribers`
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `email` | text | Subscriber email (unique) |
| `subscribed_at` | timestamptz | Subscription time |

### `stars`
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `x` | float | X position (0–1 fraction of canvas) |
| `y` | float | Y position (0–1 fraction of canvas) |
| `name` | text | Claimer's name |
| `size` | float | Star size |
| `created_at` | timestamptz | Claim time |
