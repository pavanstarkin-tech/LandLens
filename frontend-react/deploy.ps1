# ====================================================================
# LandLens Frontend Production Deployment Script (AWS S3 + CloudFront)
# ====================================================================

$ErrorActionPreference = "Stop"

Write-Host "[START] Starting LandLens Frontend Deployment..." -ForegroundColor Cyan

# 1. Ensure we are in the frontend-react directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# 2. Build Production Bundle
Write-Host "[BUILD] Building production bundle using Vite..." -ForegroundColor Yellow
npm run build

if (-not (Test-Path "dist")) {
    Write-Host "[ERROR] Output directory 'dist' was not generated." -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Production bundle built successfully inside dist/" -ForegroundColor Green

# 3. AWS Configuration
$S3_BUCKET = "landlens-frontend-256845883985"
$CLOUDFRONT_DIST_ID = "E8845JKUZLQMQ"

# 4. Sync Immutable Assets to AWS S3 (Cache: 1 Year)
Write-Host "[S3] Syncing static assets to S3 bucket s3://${S3_BUCKET}/assets/..." -ForegroundColor Yellow
aws s3 sync dist/assets/ "s3://$S3_BUCKET/assets/" --cache-control "public, max-age=31536000, immutable"

# 5. Sync Root HTML & Entry Files to AWS S3 (Cache: No Cache)
Write-Host "[S3] Syncing index.html and root files to S3 bucket s3://${S3_BUCKET}/..." -ForegroundColor Yellow
aws s3 sync dist/ "s3://$S3_BUCKET/" --exclude "assets/*" --cache-control "public, max-age=0, must-revalidate"

# 6. Invalidate CloudFront CDN Edge Cache
Write-Host "[CDN] Invalidating CloudFront Edge Cache (ID: $CLOUDFRONT_DIST_ID)..." -ForegroundColor Yellow
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DIST_ID --paths "/*"

Write-Host "[DONE] LandLens Frontend Deployed Successfully!" -ForegroundColor Green
Write-Host "[URL]  Live at: https://dpyyh7torlown.cloudfront.net" -ForegroundColor Cyan
