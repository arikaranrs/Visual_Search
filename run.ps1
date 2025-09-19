# Visual Search System - Windows PowerShell Run Script
# Run this script in PowerShell as Administrator for best results

Write-Host "🚀 Starting Visual Search System Setup..." -ForegroundColor Green

# Check Node.js installation
Write-Host "📋 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Test API connections
Write-Host "🔧 Testing API connections..." -ForegroundColor Yellow
npm run test:apis

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ API connection tests failed. Check your .env.local file." -ForegroundColor Red
    exit 1
}

# Seed database
Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
npm run seed:db

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Database seeding failed" -ForegroundColor Red
    exit 1
}

# Start development server
Write-Host "🎉 Setup complete! Starting development server..." -ForegroundColor Green
Write-Host "🌐 Application will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📊 API endpoints available at: http://localhost:3000/api/*" -ForegroundColor Cyan

npm run dev
