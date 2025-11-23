# Spot Properties - Quick Deployment Guide

## Step-by-Step Vercel Deployment

This is a quick reference guide for deploying Spot Properties to Vercel. For detailed instructions, see `DEPLOYMENT_CHECKLIST.md`.

### Prerequisites

1. **Vercel Account**
   - Sign up at https://vercel.com

2. **GitHub/GitLab Account**
   - Push your code to a Git repository

3. **Production Services Ready**
   - Database: Neon, Supabase, or similar PostgreSQL provider
   - Cloudinary account for image storage
   - Resend account for email delivery

---

## Quick Start (5 Steps)

### 1. Prepare Environment Variables

Create a file with all your production environment variables:

```bash
DATABASE_URL="postgresql://user:password@host:5432/db?sslmode=require"
NEXTAUTH_SECRET="<run: openssl rand -base64 32>"
NEXTAUTH_URL="https://yourdomain.com"
AUTH_SECRET="<same as NEXTAUTH_SECRET>"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="<strong-password>"
CLOUDINARY_CLOUD_NAME="<your-cloud-name>"
CLOUDINARY_API_KEY="<your-api-key>"
CLOUDINARY_API_SECRET="<your-api-secret>"
RESEND_API_KEY="<your-resend-key>"
NEXT_PUBLIC_WHATSAPP_NUMBER="<your-whatsapp-number>"
```

### 2. Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select your repository
4. Configure project:
   - Framework: Next.js
   - Root Directory: `./spot-properties` (or `.` if at root)
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Add Environment Variables:
   - Paste all variables from step 1
   - Set scope to **Production**

6. Click **Deploy**

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to project
cd spot-properties

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Follow prompts and add environment variables when asked
```

### 3. Run Database Migrations

After first deployment:

```bash
# Pull environment variables locally
vercel env pull .env.production.local

# Run migrations
npx prisma migrate deploy

# (Optional) Seed initial data - ONLY RUN ONCE
npx prisma db seed
```

### 4. Configure Custom Domain (Optional)

1. In Vercel Dashboard → **Project Settings** → **Domains**
2. Add your domain (e.g., `spotproperties.com`)
3. Follow DNS configuration instructions
4. Update environment variables:
   ```
   NEXTAUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```
5. Redeploy

### 5. Verify Deployment

Test these URLs:
- [ ] `https://yourdomain.com/en` - Homepage
- [ ] `https://yourdomain.com/ar` - Arabic version
- [ ] `https://yourdomain.com/admin` - Admin login
- [ ] `https://yourdomain.com/sitemap.xml` - Sitemap
- [ ] `https://yourdomain.com/robots.txt` - Robots.txt

---

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `NEXTAUTH_SECRET` | NextAuth encryption key | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Production URL | `https://yourdomain.com` |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `https://yourdomain.com` |
| `ADMIN_EMAIL` | Admin login email | `admin@yourdomain.com` |
| `ADMIN_PASSWORD` | Admin password | Strong password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | From Cloudinary dashboard |
| `RESEND_API_KEY` | Resend email API key | From Resend dashboard |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp contact number | `1234567890` (no + or spaces) |
| `AUTH_SECRET` | Alternative to NEXTAUTH_SECRET | Same as NEXTAUTH_SECRET |

---

## Common Commands

### Local Development
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Run production build locally
```

### Database
```bash
npx prisma generate      # Generate Prisma Client
npx prisma migrate dev   # Create and apply migration (dev)
npx prisma migrate deploy # Apply migrations (production)
npx prisma studio        # Open Prisma Studio
npx prisma db seed       # Seed database (run once)
```

### Vercel
```bash
vercel                   # Deploy to preview
vercel --prod            # Deploy to production
vercel env pull          # Pull environment variables
vercel logs              # View deployment logs
vercel domains           # Manage domains
```

---

## Troubleshooting

### Build Errors

**Error: Cannot find module '@prisma/client'**
```bash
# Ensure postinstall script in package.json runs
npm install
npx prisma generate
```

**Error: Environment variable not found**
- Check Vercel Dashboard → Settings → Environment Variables
- Ensure variable names match exactly (case-sensitive)
- Redeploy after adding new variables

### Database Connection Errors

**Error: Can't reach database server**
- Verify `DATABASE_URL` is correct
- Ensure database accepts connections from Vercel
- Add `?sslmode=require` to connection string

### Image Loading Issues

**Images not displaying**
- Verify Cloudinary credentials
- Check `next.config.ts` has Cloudinary in `remotePatterns`
- Test upload in admin panel

---

## Getting Service Credentials

### Database (Neon)
1. Go to https://neon.tech
2. Create new project
3. Copy connection string
4. Enable connection pooling

### Cloudinary
1. Go to https://cloudinary.com
2. Sign up / Login
3. Dashboard → Account Details
4. Copy Cloud Name, API Key, API Secret

### Resend
1. Go to https://resend.com
2. Sign up / Login
3. API Keys → Create API Key
4. Copy key (starts with `re_`)

### Generate Secrets
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

---

## Production Checklist

Before going live:

- [ ] All environment variables configured in Vercel
- [ ] Database migrations applied
- [ ] Admin account created (via seed or manually)
- [ ] Test all pages load correctly
- [ ] Test admin panel functionality
- [ ] Test image uploads
- [ ] Test contact form
- [ ] Test appointment booking
- [ ] Verify sitemap.xml works
- [ ] Check robots.txt
- [ ] Test both EN and AR locales
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)

---

## Support & Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Next.js Documentation:** https://nextjs.org/docs
- **Prisma Documentation:** https://www.prisma.io/docs
- **Deployment Checklist:** See `DEPLOYMENT_CHECKLIST.md`

---

## Success! 🎉

Your Spot Properties application is now live on Vercel!

**Next Steps:**
1. Submit sitemap to Google Search Console
2. Configure email domain with Resend
3. Set up monitoring and analytics
4. Regular backups of production database
