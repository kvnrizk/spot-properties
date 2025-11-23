# Spot Properties

A modern, bilingual real estate platform built with Next.js 15, featuring property management, international support, and comprehensive admin tools.

## Overview

Spot Properties is a full-featured real estate application designed for managing and showcasing properties across multiple locations with support for both English and Arabic languages.

### Key Features

- **Bilingual Support** - Full English and Arabic localization with RTL support
- **Property Management** - Complete CRUD operations for properties
- **Advanced Search & Filtering** - Search by location, type, price, and more
- **Admin Dashboard** - Comprehensive admin panel with analytics and monitoring
- **Image Management** - Cloudinary integration for optimized image delivery
- **Contact & Appointments** - Lead management and appointment scheduling
- **Email Notifications** - Automated emails via Resend
- **WhatsApp Integration** - Direct property inquiries via WhatsApp
- **SEO Optimized** - Dynamic sitemap, metadata, and Open Graph support
- **Production Monitoring** - Built-in health checks, logging, and cron jobs

### Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Internationalization:** next-intl
- **Image Storage:** Cloudinary
- **Email Service:** Resend
- **Deployment:** Vercel

## Quick Start

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL database
- Cloudinary account
- Resend account

### Installation

1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd spot-properties
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. Set up the database
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed  # Optional: seed with sample data
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000/en](http://localhost:3000/en) in your browser

## Project Structure

```
spot-properties/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/           # Internationalized routes
│   │   ├── admin/              # Admin panel
│   │   ├── api/                # API routes
│   │   └── login/              # Authentication
│   ├── components/             # Reusable components
│   ├── lib/                    # Utilities and helpers
│   ├── locales/                # Translation files (en/ar)
│   └── middleware.ts           # Route protection
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── public/                     # Static assets
└── DOCUMENTATION.md            # Complete documentation
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Run production build
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (database GUI)
```

## Documentation

For complete documentation including deployment, monitoring, backup strategies, and troubleshooting, see:

**[DOCUMENTATION.md](./DOCUMENTATION.md)**

This comprehensive guide covers:
- Development setup and configuration
- Production deployment to Vercel
- Environment variables reference
- Code quality and linting
- System monitoring and health checks
- Backup and disaster recovery
- Maintenance procedures
- Troubleshooting guide

## Environment Variables

Required environment variables:

```env
DATABASE_URL                        # PostgreSQL connection string
NEXTAUTH_SECRET                     # Authentication secret
NEXTAUTH_URL                        # Application URL
NEXT_PUBLIC_APP_URL                 # Public application URL
ADMIN_EMAIL                         # Admin login email
ADMIN_PASSWORD                      # Admin login password
CLOUDINARY_CLOUD_NAME               # Cloudinary cloud name
CLOUDINARY_API_KEY                  # Cloudinary API key
CLOUDINARY_API_SECRET               # Cloudinary API secret
RESEND_API_KEY                      # Resend email API key
CRON_SECRET                         # Cron job authentication
NEXT_PUBLIC_WHATSAPP_NUMBER         # WhatsApp contact (optional)
```

See `.env.production` for a complete template.

## Deployment

### Quick Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Visit [Vercel](https://vercel.com/new)
3. Import your repository
4. Add environment variables
5. Deploy

For detailed deployment instructions, see [DOCUMENTATION.md](./DOCUMENTATION.md#deployment-guide).

## Production Features

### Monitoring & Logging
- Health check endpoint (`/api/health`)
- System logs with filtering (`/admin/system-logs`)
- Real-time system status dashboard (`/admin/system`)
- Vercel Analytics and Speed Insights
- Error tracking and alerting

### Automated Maintenance
- Daily log cleanup (2 AM UTC)
- Daily appointment checks (8 AM UTC)
- Weekly analytics snapshots (Sunday midnight)

### Security
- Protected admin routes with NextAuth
- Secure cron job endpoints
- Environment variable validation
- SQL injection prevention with Prisma
- XSS protection

## Admin Panel

Access the admin panel at `/admin` after logging in:

- **Dashboard** - Overview of properties, leads, and appointments
- **Properties** - Manage property listings
- **Appointments** - View and manage appointments
- **Leads** - Track contact form submissions
- **Activity Logs** - Monitor user actions
- **System Status** - Production health monitoring
- **System Logs** - Advanced logging and debugging
- **Settings** - Application configuration

## API Routes

Key API endpoints:

- `/api/properties` - Property CRUD operations
- `/api/leads` - Lead management
- `/api/appointments` - Appointment handling
- `/api/upload` - Image upload to Cloudinary
- `/api/health` - Health check and system status
- `/api/admin/*` - Admin-only endpoints

## Internationalization

The application supports:
- **English (en)** - Default locale
- **Arabic (ar)** - Full RTL support

Routes are automatically prefixed with locale:
- `/en/properties` - English properties page
- `/ar/properties` - Arabic properties page

## Support

For questions, issues, or contributions:

- Check [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed guides
- Review the [Troubleshooting](./DOCUMENTATION.md#troubleshooting) section
- Consult official documentation:
  - [Next.js Documentation](https://nextjs.org/docs)
  - [Prisma Documentation](https://www.prisma.io/docs)
  - [Vercel Documentation](https://vercel.com/docs)

## License

[Your License Here]

---

**Version:** 1.0.0

**Status:** Production Ready ✅

For complete documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md)
