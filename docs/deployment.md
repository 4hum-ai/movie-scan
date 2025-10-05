# 🚀 Deployment Guide for Cloudflare Pages

This guide covers deploying the Movie Scan application to Cloudflare Pages with proper environment variable and secret management.

## 📋 Prerequisites

- Cloudflare account with Pages enabled
- GitHub repository with Actions enabled
- Wrangler CLI installed (optional, for local testing)

## 🔧 Setup Instructions

### 1. Cloudflare Pages Project Setup

1. **Create Cloudflare Pages Project:**

   ```bash
   # Using Wrangler CLI
   wrangler pages project create movie-scan
   wrangler pages project create movie-scan-staging
   ```

2. **Or via Cloudflare Dashboard:**
   - Go to Cloudflare Dashboard → Pages
   - Create new project: `movie-scan`
   - Create staging project: `movie-scan-staging`

### 2. Environment Variables Configuration

#### GitHub Secrets Setup

Configure the following secrets in your GitHub repository:

**Go to:** `Settings` → `Secrets and variables` → `Actions` → `Repository secrets`

#### Required Secrets:

```bash
# Cloudflare API Token
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token

# API Configuration
VITE_PUBLIC_API_URL=https://movie-dubie-api-prod.uc.gateway.dev

# Authentication Provider
VITE_AUTH_PROVIDER=firebase

# Firebase Authentication (Production)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google Identity Services (if using GIS)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_SCOPES="openid email profile"

# Google Cloud Workflows
VITE_GOOGLE_CLOUD_PROJECT=your_gcp_project
VITE_GOOGLE_CLOUD_LOCATION=us-central1

# Admin UI Configuration
VITE_ADMIN_UI_CONFIG_FROM_LOCAL=false
VITE_ADMIN_UI_CONFIG_LOCAL_PATH=/ui-config.json

# Cloudflare Image Transformations
VITE_CLOUDFLARE_DOMAIN=4hum.ai
VITE_ENABLE_CDN=true
VITE_ENABLE_IMAGE_TRANSFORMATIONS=true
```

#### Staging Environment Secrets

For staging environment, create separate secrets with staging values:

```bash
# Staging API URL
VITE_PUBLIC_API_URL=https://movie-dubie-api-staging.uc.gateway.dev

# Staging Firebase Project
VITE_FIREBASE_PROJECT_ID=your_staging_project_id
# ... other staging-specific values
```

### 3. Cloudflare Pages Environment Variables

#### Via Cloudflare Dashboard:

1. Go to your Pages project
2. Navigate to `Settings` → `Environment variables`
3. Add the same environment variables as GitHub secrets
4. Set different values for `Production` and `Preview` environments

#### Via Wrangler CLI:

```bash
# Set production environment variables
wrangler pages secret put VITE_FIREBASE_API_KEY --project-name movie-scan

# Set staging environment variables
wrangler pages secret put VITE_FIREBASE_API_KEY --project-name movie-scan-staging
```

### 4. GitHub Actions Environment Setup

1. **Create Environment Protection Rules:**
   - Go to `Settings` → `Environments`
   - Create `production` environment
   - Create `staging` environment
   - Add required reviewers if needed

2. **Configure Environment Secrets:**
   - Add the same secrets to each environment
   - Use different values for staging vs production

## 🚀 Deployment Process

### Automatic Deployment

Deployments are triggered automatically when you push tags:

```bash
# Deploy to production
git tag v1.0.0
git push origin v1.0.0
```

### Manual Deployment

You can also trigger deployments manually:

1. Go to `Actions` tab in GitHub
2. Select "Deploy to Cloudflare Pages" workflow
3. Click "Run workflow"
4. Choose environment (production/staging)
5. Click "Run workflow"

### Local Testing

Test your build locally with environment variables:

```bash
# Copy environment file
cp env.example .env

# Install dependencies
pnpm install

# Build with production environment
NODE_ENV=production pnpm run build

# Preview build
pnpm run preview
```

## 🔒 Security Best Practices

### Environment Variables

- ✅ **Use GitHub Secrets** for sensitive data
- ✅ **Separate environments** (staging/production)
- ✅ **Rotate secrets** regularly
- ❌ **Never commit** `.env` files to repository
- ❌ **Never expose** API keys in client-side code

### Cloudflare Pages Security

- ✅ **Enable HTTPS** (automatic with Cloudflare)
- ✅ **Use environment-specific** project names
- ✅ **Restrict access** with Cloudflare Access (if needed)
- ✅ **Monitor deployments** and logs

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures:**

   ```bash
   # Check build logs in GitHub Actions
   # Verify all required environment variables are set
   # Test build locally with same environment
   ```

2. **Missing Environment Variables:**

   ```bash
   # Verify secrets are set in GitHub repository
   # Check environment variable names match exactly
   # Ensure secrets are available in the correct environment
   ```

3. **Authentication Issues:**
   ```bash
   # Verify Firebase configuration
   # Check API keys and project IDs
   # Test authentication flow locally
   ```

### Debug Commands

```bash
# Check Wrangler configuration
wrangler pages project list

# View project details
wrangler pages project get movie-scan

# Check environment variables
wrangler pages secret list --project-name movie-scan

# Test deployment locally
wrangler pages dev dist --project-name movie-scan
```

## 📊 Monitoring

### Deployment Monitoring

- Monitor GitHub Actions for deployment status
- Check Cloudflare Pages dashboard for build logs
- Set up notifications for failed deployments

### Application Monitoring

- Use Cloudflare Analytics for performance metrics
- Monitor error rates and response times
- Set up alerts for critical issues

## 🔄 Environment Management

### Staging Environment

- Use separate Cloudflare Pages project
- Different API endpoints and Firebase projects
- Same codebase, different configuration

### Production Environment

- Main deployment target
- Production API endpoints
- Production Firebase project
- Requires approval for deployments

## 📚 Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
