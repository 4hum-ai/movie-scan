#!/bin/bash

# Setup script for Cloudflare Pages secrets
# This script helps configure environment variables and secrets for deployment

set -e

echo "🔧 Cloudflare Pages Secrets Setup"
echo "=================================="

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI is not installed. Please install it first:"
    echo "   npm install -g wrangler"
    echo "   or"
    echo "   pnpm add -g wrangler"
    exit 1
fi

# Check if user is logged in
if ! wrangler whoami &> /dev/null; then
    echo "❌ Not logged in to Cloudflare. Please run:"
    echo "   wrangler login"
    exit 1
fi

echo "✅ Wrangler CLI is installed and you're logged in"

# Function to set secret
set_secret() {
    local secret_name=$1
    local secret_description=$2
    local is_required=${3:-true}
    
    echo ""
    echo "🔐 Setting secret: $secret_name"
    echo "   Description: $secret_description"
    
    if [ "$is_required" = true ]; then
        echo -n "   Enter value (required): "
    else
        echo -n "   Enter value (optional, press Enter to skip): "
    fi
    
    read -r secret_value
    
    if [ -n "$secret_value" ]; then
        echo "   Setting secret for production..."
        echo "$secret_value" | wrangler pages secret put "$secret_name" --project-name movie-scan
        
        echo "   Setting secret for staging..."
        echo "$secret_value" | wrangler pages secret put "$secret_name" --project-name movie-scan-staging
        
        echo "   ✅ Secret '$secret_name' set successfully"
    elif [ "$is_required" = true ]; then
        echo "   ❌ Required secret cannot be empty"
        return 1
    else
        echo "   ⏭️  Skipping optional secret '$secret_name'"
    fi
}

# Function to set environment variable
set_env_var() {
    local var_name=$1
    local var_description=$2
    local default_value=$3
    
    echo ""
    echo "🌍 Setting environment variable: $var_name"
    echo "   Description: $var_description"
    echo -n "   Enter value (default: $default_value): "
    
    read -r var_value
    var_value=${var_value:-$default_value}
    
    if [ -n "$var_value" ]; then
        echo "   Setting environment variable for production..."
        wrangler pages environment-variable put "$var_name" "$var_value" --project-name movie-scan
        
        echo "   Setting environment variable for staging..."
        wrangler pages environment-variable put "$var_name" "$var_value" --project-name movie-scan-staging
        
        echo "   ✅ Environment variable '$var_name' set successfully"
    fi
}

echo ""
echo "📋 Setting up required secrets..."

# Required secrets
set_secret "VITE_FIREBASE_API_KEY" "Firebase API Key for authentication" true
set_secret "VITE_FIREBASE_AUTH_DOMAIN" "Firebase Auth Domain (e.g., your-project.firebaseapp.com)" true
set_secret "VITE_FIREBASE_PROJECT_ID" "Firebase Project ID" true
set_secret "VITE_FIREBASE_STORAGE_BUCKET" "Firebase Storage Bucket (e.g., your-project.appspot.com)" true
set_secret "VITE_FIREBASE_MESSAGING_SENDER_ID" "Firebase Messaging Sender ID" true
set_secret "VITE_FIREBASE_APP_ID" "Firebase App ID" true

echo ""
echo "📋 Setting up optional secrets..."

# Optional secrets
set_secret "VITE_GOOGLE_CLIENT_ID" "Google OAuth Client ID (if using Google Identity Services)" false
set_secret "VITE_GOOGLE_CLOUD_PROJECT" "Google Cloud Project ID for Workflows" false
set_secret "VITE_GOOGLE_CLOUD_LOCATION" "Google Cloud Location (e.g., us-central1)" false

echo ""
echo "📋 Setting up environment variables..."

# Environment variables
set_env_var "VITE_PUBLIC_API_URL" "Public API URL" "https://movie-dubie-api-prod.uc.gateway.dev"
set_env_var "VITE_AUTH_PROVIDER" "Authentication provider" "firebase"
set_env_var "VITE_GOOGLE_SCOPES" "Google OAuth scopes" "openid email profile"
set_env_var "VITE_ADMIN_UI_CONFIG_FROM_LOCAL" "Load UI config from local file" "false"
set_env_var "VITE_ADMIN_UI_CONFIG_LOCAL_PATH" "Local UI config path" "/ui-config.json"
set_env_var "VITE_CLOUDFLARE_DOMAIN" "Cloudflare domain for CDN" "4hum.ai"
set_env_var "VITE_ENABLE_CDN" "Enable CDN functionality" "true"
set_env_var "VITE_ENABLE_IMAGE_TRANSFORMATIONS" "Enable image transformations" "true"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Verify your secrets in Cloudflare Pages dashboard"
echo "2. Test deployment with: git tag v1.0.0 && git push origin v1.0.0"
echo "3. Check deployment status in GitHub Actions"
echo ""
echo "🔍 To verify secrets:"
echo "   wrangler pages secret list --project-name movie-scan"
echo "   wrangler pages secret list --project-name movie-scan-staging"
echo ""
echo "📚 For more information, see docs/deployment.md"
