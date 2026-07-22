# ====================================================================
# LandLens Frontend Production Deployment Script (AWS S3 + CloudFront)
# ====================================================================

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting LandLens Frontend Deployment Process..." -ForegroundColor Cyan

# 1. Ensure we are in the frontend-react directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# 2. Build Production Bundle
Write-Host "📦 Building production bundle using Vite..." -ForegroundColor Yellow
npm run build

if (-not (Test-Path "dist")) {
    Write-Host "❌ Error: Output directory 'dist' was not generated." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Production bundle built successfully inside dist/" -ForegroundColor Green

# 3. AWS Configuration
$S3_BUCKET = "landlens-frontend-256845883985"
$CLOUDFRONT_DIST_ID = "E8845JKUZLQMQ"

# 4. Sync Immutable Assets to AWS S3 (Cache: 1 Year)
Write-Host "☁️ Syncing static assets to S3 bucket (s3://$S3_BUCKET/assets/)..." -ForegroundColor Yellow
aws s3 sync dist/assets/ "s3://$S3_BUCKET/assets/" --delete --cache-control "public, max-age=31536000, immutable"

# 5. Sync Root HTML & Entry Files to AWS S3 (Cache: No Cache)
Write-Host "📄 Syncing index.html and root files to S3 bucket (s3://$S3_BUCKET/)..." -ForegroundColor Yellow
aws s3 sync dist/ "s3://$S3_BUCKET/" --exclude "assets/*" --delete --cache-control "public, max-age=0, must-revalidate"

# 6. Invalidate CloudFront CDN Edge Cache
Write-Host "🔄 Invalidating CloudFront CDN Edge Cache (Dist ID: $CLOUDFRONT_DIST_ID)..." -ForegroundColor Yellow
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DIST_ID --paths "/*"

Write-Host "🎉 LandLens Frontend Deployed Successfully!" -ForegroundColor Green
Write-Host "📍 Live URL: https://dpyyh7torlown.cloudfront.net" -ForegroundColor Cyan
