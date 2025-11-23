# Spot Properties - Vercel Deployment Checklist

This comprehensive checklist ensures a successful deployment of Spot Properties to Vercel.

## Pre-Deployment Checklist

### 1. Environment Variables Setup

Before deploying, ensure you have all required environment variables ready. You'll need to add these to Vercel's project settings.

#### Required Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public&sslmode=require

# Authentication
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://yourdomain.com
AUTH_SECRET=<same-as-nextauth-secret>

# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Admin Credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<strong-password>

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Resend (Email Service)
RESEND_API_KEY=re_<your-resend-api-key>

# WhatsApp (Optional)
NEXT_PUBLIC_WHATSAPP_NUMBER=<country-code><number>
```

#### How to Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

### 2. Database Preparation

#### A. Ensure Database is Accessible
- [ ] Database is hosted on a production-ready service (Neon, Supabase, Railway, etc.)
- [ ] Database connection uses SSL (sslmode=require in connection string)
- [ ] Database is accessible from Vercel's IP ranges
- [ ] Database has proper connection pooling enabled

#### B. Run Migrations
```bash
# Make sure all migrations are up to date
npx prisma migrate deploy
```

#### C. Seed Initial Data (if needed)
```bash
# Only run this ONCE in production
npx prisma db seed
```

**⚠️ IMPORTANT:** Do NOT enable automatic seeding in production. The seed script should only run manually.

### 3. Third-Party Service Setup

#### A. Cloudinary Setup
- [ ] Create Cloudinary account at https://cloudinary.com
- [ ] Get Cloud Name, API Key, and API Secret
- [ ] Configure upload presets if needed
- [ ] Set up folder structure for property images

#### B. Resend Setup
- [ ] Create Resend account at https://resend.com
- [ ] Verify your sending domain
- [ ] Generate API key
- [ ] Test email delivery

#### C. Database Provider (Neon/Supabase)
- [ ] Database created and accessible
- [ ] Connection pooling enabled
- [ ] SSL certificate configured
- [ ] Backups configured

### 4. Local Testing

#### A. Test Production Build Locally
```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Build the application
npm run build

# Run production server locally
npm start
```

#### B. Test Checklist
- [ ] Homepage loads correctly (`http://localhost:3000/en`)
- [ ] Arabic locale works (`http://localhost:3000/ar`)
- [ ] Properties page displays (`/en/properties`)
- [ ] Property filters work
- [ ] Pagination works
- [ ] Property detail pages load (`/en/properties/[slug]`)
- [ ] Image galleries work
- [ ] Contact form submits successfully
- [ ] Appointment booking works
- [ ] Admin login works (`/admin` or `/login`)
- [ ] Admin dashboard displays
- [ ] CRUD operations work (Create, Read, Update, Delete properties)
- [ ] Image upload to Cloudinary works
- [ ] Activity logs record actions
- [ ] Settings page works
- [ ] WhatsApp integration works
- [ ] Email notifications send (Resend)
- [ ] Sitemap generates (`/sitemap.xml`)
- [ ] Robots.txt accessible (`/robots.txt`)

## Vercel Deployment Steps

### 1. Connect Repository to Vercel

#### A. Via Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your Git repository (GitHub, GitLab, or Bitbucket)
3. Select the repository containing Spot Properties
4. Configure project settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./spot-properties (or leave as `.` if repo root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

### 2. Configure Environment Variables

1. In Vercel Dashboard, go to **Project Settings** → **Environment Variables**
2. Add ALL variables from `.env.production`
3. Set environment for each variable:
   - Production
   - Preview (optional, for testing)
   - Development (optional, for Vercel dev)

### 3. Configure Build Settings

#### A. Build & Development Settings
```
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

#### B. Node.js Version
- Ensure Node.js version is 18.x or higher
- Vercel will auto-detect from package.json

### 4. Deploy

1. Click **Deploy** button
2. Wait for deployment to complete (usually 2-5 minutes)
3. Vercel will run:
   - `npm install`
   - `npx prisma generate` (via postinstall)
   - `npm run build`

### 5. Post-Deployment Verification

#### A. Check Deployment Status
- [ ] Build completed successfully
- [ ] No build errors in logs
- [ ] Deployment is live

#### B. Test Production Site

**Public Pages:**
- [ ] Visit `https://yourdomain.com/en` (homepage)
- [ ] Visit `https://yourdomain.com/ar` (Arabic homepage)
- [ ] Test `/en/properties` (properties listing)
- [ ] Test `/en/lebanon` (Lebanon country page)
- [ ] Test `/en/cyprus` (Cyprus country page)
- [ ] Test `/en/about` (about page)
- [ ] Test `/en/contact` (contact page)
- [ ] Click on a property to test detail page
- [ ] Test image loading from Cloudinary
- [ ] Test contact form submission
- [ ] Test appointment booking
- [ ] Test WhatsApp button functionality

**SEO & Technical:**
- [ ] Visit `https://yourdomain.com/sitemap.xml`
- [ ] Visit `https://yourdomain.com/robots.txt`
- [ ] Check Open Graph meta tags (share link on social media)
- [ ] Test Twitter Card preview
- [ ] Verify canonical URLs
- [ ] Check alternate language links

**Admin Panel:**
- [ ] Visit `https://yourdomain.com/admin` or `/login`
- [ ] Login with admin credentials
- [ ] Test dashboard displays correctly
- [ ] Create a new property
- [ ] Upload images to property
- [ ] Edit existing property
- [ ] Delete a test property
- [ ] Test appointments management
- [ ] Test leads management
- [ ] Test activity logs
- [ ] Test settings page
- [ ] Verify all CRUD operations work

**Performance:**
- [ ] Check Lighthouse scores (aim for 90+ in all categories)
- [ ] Test page load speed
- [ ] Verify images are optimized (WebP/AVIF)
- [ ] Check mobile responsiveness

### 6. Domain Configuration

#### A. Add Custom Domain
1. Go to **Project Settings** → **Domains**
2. Add your custom domain (e.g., `spotproperties.com`)
3. Follow DNS configuration instructions
4. Add www subdomain if desired
5. Wait for DNS propagation (can take up to 48 hours)

#### B. Update Environment Variables
```bash
# Update this after domain is configured
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

#### C. SSL Certificate
- [ ] Vercel automatically provisions SSL (Let's Encrypt)
- [ ] Verify HTTPS is working
- [ ] Check for mixed content warnings

### 7. Database Migration in Production

If you need to run migrations after deployment:

```bash
# Option 1: Via Vercel CLI
npx vercel env pull .env.production.local
npx prisma migrate deploy

# Option 2: Via database provider's CLI or dashboard
# Connect to your production database and run migrations
```

## Post-Deployment Configuration

### 1. Set Up Monitoring

#### A. Vercel Analytics (Built-in)
- [ ] Enable Vercel Analytics in project settings
- [ ] Monitor Web Vitals
- [ ] Track visitor metrics

#### B. Error Tracking (Optional)
- [ ] Set up Sentry for error tracking
- [ ] Configure error reporting

### 2. Performance Optimization

#### A. Enable Vercel Features
- [ ] Enable Edge Network
- [ ] Enable Image Optimization
- [ ] Enable Incremental Static Regeneration (ISR)

#### B. Caching Configuration
- [ ] Verify `vercel.json` caching headers are applied
- [ ] Test CDN caching for static assets
- [ ] Monitor cache hit rates

### 3. SEO Configuration

#### A. Submit to Search Engines
- [ ] Submit sitemap to Google Search Console
  - URL: `https://yourdomain.com/sitemap.xml`
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify domain ownership

#### B. Configure Search Console
- [ ] Add property to Google Search Console
- [ ] Verify ownership via DNS or meta tag
- [ ] Submit sitemap
- [ ] Request indexing for key pages

### 4. Security Hardening

#### A. Review Security Headers
- [ ] Verify security headers from `vercel.json` are applied
- [ ] Check CSP (Content Security Policy) if needed
- [ ] Test for XSS vulnerabilities

#### B. Authentication
- [ ] Ensure admin routes require authentication
- [ ] Test unauthorized access attempts
- [ ] Verify password strength requirements

## Maintenance & Updates

### 1. Continuous Deployment

Vercel automatically deploys when you push to your connected Git branch:
- **Production:** Push to `main` or `master` branch
- **Preview:** Push to any other branch

### 2. Database Migrations

When you need to update the database schema:

```bash
# 1. Create migration locally
npx prisma migrate dev --name describe_your_changes

# 2. Commit migration files
git add prisma/migrations
git commit -m "Add migration: describe_your_changes"

# 3. Push to trigger deployment
git push

# 4. Verify migration applied in production
# Check Vercel deployment logs
```

### 3. Rollback Procedure

If deployment fails or has issues:

1. Go to **Deployments** in Vercel Dashboard
2. Find previous working deployment
3. Click **Promote to Production**

## Troubleshooting

### Common Issues

#### Build Fails
```
Error: Cannot find module '@prisma/client'
```
**Solution:** Ensure `postinstall` script runs `prisma generate`

#### Database Connection Issues
```
Error: Can't reach database server
```
**Solutions:**
- Check DATABASE_URL is correct
- Verify database allows connections from Vercel
- Ensure SSL is enabled in connection string

#### Environment Variables Not Working
```
Error: process.env.VARIABLE_NAME is undefined
```
**Solutions:**
- Verify variable is set in Vercel project settings
- Ensure variable name matches exactly (case-sensitive)
- Redeploy after adding new variables

#### Images Not Loading
```
Error: Invalid src prop
```
**Solutions:**
- Verify Cloudinary credentials are correct
- Check `next.config.ts` has `remotePatterns` for Cloudinary
- Test image upload in admin panel

#### 404 on Dynamic Routes
**Solutions:**
- Check route file naming conventions
- Verify `[locale]` folder structure
- Ensure middleware is properly configured

### Getting Help

If you encounter issues:

1. **Check Vercel Logs:**
   - Go to **Deployments** → Click deployment → **View Function Logs**

2. **Check Runtime Logs:**
   - Go to **Deployments** → **Runtime Logs**

3. **Vercel Support:**
   - https://vercel.com/support

4. **Next.js Documentation:**
   - https://nextjs.org/docs

5. **Prisma Documentation:**
   - https://www.prisma.io/docs

## Success Criteria

Your deployment is successful when:

- [ ] All pages load without errors
- [ ] Images display correctly from Cloudinary
- [ ] Forms submit successfully (contact, appointments)
- [ ] Admin panel is accessible and functional
- [ ] Database operations work (CRUD)
- [ ] Email notifications send via Resend
- [ ] Sitemap is accessible
- [ ] SEO meta tags are correct
- [ ] Performance scores are acceptable (Lighthouse 90+)
- [ ] Mobile responsiveness works
- [ ] Both EN and AR locales function properly
- [ ] WhatsApp integration works
- [ ] SSL certificate is active
- [ ] Custom domain is configured (if applicable)

## Final Notes

- **Backup Database:** Always backup your production database before major changes
- **Test in Preview:** Use Vercel preview deployments to test changes before production
- **Monitor Performance:** Regularly check Vercel Analytics and Web Vitals
- **Update Dependencies:** Keep dependencies up to date for security and performance
- **Review Logs:** Periodically check error logs for issues

**Congratulations!** Your Spot Properties application is now deployed on Vercel! 🎉
