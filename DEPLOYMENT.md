# Terapie.md - Production Deployment Guide

## Prerequisites

- [x] Supabase project created and configured
- [x] Database schema applied
- [x] Environment variables set locally
- [ ] Custom domain (optional)
- [ ] Vercel account (recommended) or other hosting

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/terapie-md.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 4: Deploy

- Click "Deploy"
- Wait 2-3 minutes
- Your site will be live at `https://your-project.vercel.app`

### Step 5: Custom Domain (Optional)

1. In Vercel → Settings → Domains
2. Add your domain (e.g., `terapie.md`)
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

## Option 2: Self-Hosted (VPS/Docker)

### Requirements

- Ubuntu 22.04+ VPS
- Node.js 18+
- Nginx
- PM2

### Build & Deploy

```bash
# Build
npm run build

# Upload .next, public, package.json to server

# On server:
npm install --production
pm2 start npm --name "terapie-md" -- start
pm2 save
pm2 startup

# Configure Nginx reverse proxy
# Point domain to server IP
```

## Post-Deployment Checklist

### 1. Configure Supabase for Production

1. **Add Production URL** to Supabase Auth
   - Go to Authentication → URL Configuration
   - Add: `https://yourdomain.com`

2. **Email Templates**
   - Configure email templates in Auth → Email Templates

3. **Database Backups**
   - Enable automatic backups in Supabase settings

### 2. Security

- [ ] Review RLS policies
- [ ] Enable rate limiting
- [ ] Configure CORS settings
- [ ] Review API key usage

### 3. Analytics & Monitoring

- [ ] Add Google Analytics (optional)
- [ ] Set up error monitoring (Sentry recommended)
- [ ] Configure uptime monitoring

### 4. SEO

- [ ] Submit sitemap to Google Search Console
- [ ] Verify meta tags are working
- [ ] Test social media previews

### 5. Performance

- [ ] Run Lighthouse audit
- [ ] Enable caching
- [ ] Optimize images
- [ ] Test load times

## Environment Variables Reference

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=         # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Public anon key
SUPABASE_SERVICE_ROLE_KEY=        # Service role key (keep secret!)

# Optional (for future features)
RESEND_API_KEY=                    # For emails
STRIPE_SECRET_KEY=                 # For payments
NEXT_PUBLIC_SITE_URL=             # Your production URL
```

## Supabase Production Settings

### Enable Email Confirmations

```sql
-- Disable for development, enable for production
UPDATE auth.config
SET enable_signup = TRUE,
    email_confirm_required = TRUE;
```

### Add Production Seed Data

```sql
-- Add real therapists via application or SQL
-- Example admin user (change password after!)
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin@terapie.md', crypt('CHANGE_ME', gen_salt('bf')), NOW());
```

## Monitoring & Maintenance

### Check Application Health

```bash
# Check if site is up
curl -I https://yourdomain.com

# Check build logs (Vercel)
vercel logs
```

### Database Monitoring

- Monitor in Supabase Dashboard
- Check query performance
- Review error logs

### Update Deployment

```bash
# Push to main branch
git push origin main

# Vercel auto-deploys
# Or manually trigger deployment in Vercel dashboard
```

## Rollback

### Vercel

1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Manual

```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

## Troubleshooting

**Build fails on Vercel**
- Check build logs
- Verify all dependencies in package.json
- Test build locally: `npm run build`

**Database connection fails**
- Verify environment variables
- Check Supabase project status
- Review RLS policies

**Authentication not working**
- Verify redirect URLs in Supabase
- Check middleware configuration
- Review browser console for errors

## Support

- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs
- Next.js: https://nextjs.org/docs

## Cost Estimate

- **Supabase Free**: $0/month (500MB DB, 1GB storage)
- **Vercel Hobby**: $0/month (100GB bandwidth)
- **Domain**: ~$10-15/year
- **Total**: **~$1/month** to start

### When to Upgrade

- Supabase Pro ($25/month): 8GB database, 100GB storage
- Vercel Pro ($20/month): 1TB bandwidth, advanced features
