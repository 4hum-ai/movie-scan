# Setup script for Cloudflare Pages secrets (PowerShell version)
# This script helps configure environment variables and secrets for deployment

param(
    [switch]$SkipRequired
)

Write-Host "🔧 Cloudflare Pages Secrets Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Check if wrangler is installed
try {
    $null = Get-Command wrangler -ErrorAction Stop
    Write-Host "✅ Wrangler CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Wrangler CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "   npm install -g wrangler" -ForegroundColor Yellow
    Write-Host "   or" -ForegroundColor Yellow
    Write-Host "   pnpm add -g wrangler" -ForegroundColor Yellow
    exit 1
}

# Check if user is logged in
try {
    $null = wrangler whoami 2>$null
    Write-Host "✅ Logged in to Cloudflare" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in to Cloudflare. Please run:" -ForegroundColor Red
    Write-Host "   wrangler login" -ForegroundColor Yellow
    exit 1
}

# Function to set secret
function Set-Secret {
    param(
        [string]$SecretName,
        [string]$Description,
        [bool]$IsRequired = $true
    )
    
    Write-Host ""
    Write-Host "🔐 Setting secret: $SecretName" -ForegroundColor Yellow
    Write-Host "   Description: $Description" -ForegroundColor Gray
    
    if ($IsRequired) {
        $secretValue = Read-Host "   Enter value (required)"
    } else {
        $secretValue = Read-Host "   Enter value (optional, press Enter to skip)"
    }
    
    if ($secretValue) {
        Write-Host "   Setting secret for production..." -ForegroundColor Blue
        $secretValue | wrangler pages secret put $SecretName --project-name movie-scan
        
        Write-Host "   Setting secret for staging..." -ForegroundColor Blue
        $secretValue | wrangler pages secret put $SecretName --project-name movie-scan-staging
        
        Write-Host "   ✅ Secret '$SecretName' set successfully" -ForegroundColor Green
    } elseif ($IsRequired) {
        Write-Host "   ❌ Required secret cannot be empty" -ForegroundColor Red
        return $false
    } else {
        Write-Host "   ⏭️  Skipping optional secret '$SecretName'" -ForegroundColor Yellow
    }
    return $true
}

# Function to set environment variable
function Set-EnvVar {
    param(
        [string]$VarName,
        [string]$Description,
        [string]$DefaultValue
    )
    
    Write-Host ""
    Write-Host "🌍 Setting environment variable: $VarName" -ForegroundColor Yellow
    Write-Host "   Description: $Description" -ForegroundColor Gray
    $varValue = Read-Host "   Enter value (default: $DefaultValue)"
    $varValue = if ($varValue) { $varValue } else { $DefaultValue }
    
    if ($varValue) {
        Write-Host "   Setting environment variable for production..." -ForegroundColor Blue
        wrangler pages environment-variable put $VarName $varValue --project-name movie-scan
        
        Write-Host "   Setting environment variable for staging..." -ForegroundColor Blue
        wrangler pages environment-variable put $VarName $varValue --project-name movie-scan-staging
        
        Write-Host "   ✅ Environment variable '$VarName' set successfully" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "📋 Setting up required secrets..." -ForegroundColor Cyan

# Required secrets
$requiredSecrets = @(
    @{Name="VITE_FIREBASE_API_KEY"; Description="Firebase API Key for authentication"},
    @{Name="VITE_FIREBASE_AUTH_DOMAIN"; Description="Firebase Auth Domain (e.g., your-project.firebaseapp.com)"},
    @{Name="VITE_FIREBASE_PROJECT_ID"; Description="Firebase Project ID"},
    @{Name="VITE_FIREBASE_STORAGE_BUCKET"; Description="Firebase Storage Bucket (e.g., your-project.appspot.com)"},
    @{Name="VITE_FIREBASE_MESSAGING_SENDER_ID"; Description="Firebase Messaging Sender ID"},
    @{Name="VITE_FIREBASE_APP_ID"; Description="Firebase App ID"}
)

foreach ($secret in $requiredSecrets) {
    $result = Set-Secret -SecretName $secret.Name -Description $secret.Description -IsRequired $true
    if (-not $result) {
        Write-Host "❌ Setup failed due to missing required secret" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "📋 Setting up optional secrets..." -ForegroundColor Cyan

# Optional secrets
$optionalSecrets = @(
    @{Name="VITE_GOOGLE_CLIENT_ID"; Description="Google OAuth Client ID (if using Google Identity Services)"},
    @{Name="VITE_GOOGLE_CLOUD_PROJECT"; Description="Google Cloud Project ID for Workflows"},
    @{Name="VITE_GOOGLE_CLOUD_LOCATION"; Description="Google Cloud Location (e.g., us-central1)"}
)

foreach ($secret in $optionalSecrets) {
    Set-Secret -SecretName $secret.Name -Description $secret.Description -IsRequired $false
}

Write-Host ""
Write-Host "📋 Setting up environment variables..." -ForegroundColor Cyan

# Environment variables
$envVars = @(
    @{Name="VITE_PUBLIC_API_URL"; Description="Public API URL"; Default="https://movie-dubie-api-prod.uc.gateway.dev"},
    @{Name="VITE_AUTH_PROVIDER"; Description="Authentication provider"; Default="firebase"},
    @{Name="VITE_GOOGLE_SCOPES"; Description="Google OAuth scopes"; Default="openid email profile"},
    @{Name="VITE_ADMIN_UI_CONFIG_FROM_LOCAL"; Description="Load UI config from local file"; Default="false"},
    @{Name="VITE_ADMIN_UI_CONFIG_LOCAL_PATH"; Description="Local UI config path"; Default="/ui-config.json"},
    @{Name="VITE_CLOUDFLARE_DOMAIN"; Description="Cloudflare domain for CDN"; Default="4hum.ai"},
    @{Name="VITE_ENABLE_CDN"; Description="Enable CDN functionality"; Default="true"},
    @{Name="VITE_ENABLE_IMAGE_TRANSFORMATIONS"; Description="Enable image transformations"; Default="true"}
)

foreach ($envVar in $envVars) {
    Set-EnvVar -VarName $envVar.Name -Description $envVar.Description -DefaultValue $envVar.Default
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Verify your secrets in Cloudflare Pages dashboard" -ForegroundColor White
Write-Host "2. Test deployment with: git tag v1.0.0 && git push origin v1.0.0" -ForegroundColor White
Write-Host "3. Check deployment status in GitHub Actions" -ForegroundColor White
Write-Host ""
Write-Host "🔍 To verify secrets:" -ForegroundColor Cyan
Write-Host "   wrangler pages secret list --project-name movie-scan" -ForegroundColor White
Write-Host "   wrangler pages secret list --project-name movie-scan-staging" -ForegroundColor White
Write-Host ""
Write-Host "📚 For more information, see docs/deployment.md" -ForegroundColor Cyan
