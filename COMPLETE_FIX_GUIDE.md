# Visual Search System - Complete Fix Guide

## Step 1: Download Complete Project from v0

**IMPORTANT**: Your local project is missing critical files. You need to get the complete project from v0.

1. In the v0 interface, click the **three dots (⋯)** in the top right corner
2. Select **"Download ZIP"**
3. Extract the ZIP file to replace your current project folder
4. This will give you all the missing scripts and updated package.json

## Step 2: Install Dependencies

\`\`\`bash
cd visualsearchsystem
npm install
\`\`\`

## Step 3: Set Up Environment Variables

Create a `.env.local` file in your project root with these variables:

\`\`\`env
# Firebase Configuration (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Required for server-side operations)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com

# Algolia (Optional - for enhanced search)
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_API_KEY=your_algolia_admin_key
ALGOLIA_SEARCH_KEY=your_algolia_search_key

# Google Vision API (Optional - for image analysis)
GOOGLE_VISION_API_KEY=your_google_vision_api_key

# Feature Flags
USE_ALGOLIA=true
USE_VISION_API=true
USE_SEMANTIC_SEARCH=false
\`\`\`

## Step 4: Test All APIs

Run the comprehensive API test:

\`\`\`bash
npm run test:apis
\`\`\`

This will test:
- ✅ Firebase connection
- ✅ Algolia search (if configured)
- ✅ Google Vision API (if configured)
- ✅ All API endpoints

## Step 5: Seed the Database

\`\`\`bash
npm run seed
\`\`\`

This will populate your Firebase database with sample products.

## Step 6: Start Development Server

\`\`\`bash
npm run dev
\`\`\`

## Step 7: Verify Everything Works

1. Open http://localhost:3000
2. Test text search: Type "headphones" and search
3. Test voice search: Click the microphone icon
4. Test image search: Click camera icon and upload an image

## Available Scripts

After downloading the complete project, you'll have these scripts:

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test:apis    # Test all API connections
npm run test:algolia # Test Algolia specifically
npm run test:firebase # Test Firebase specifically
npm run test:vision  # Test Google Vision API
npm run seed         # Seed database with sample data
npm run seed:firebase # Seed Firebase only
\`\`\`

## Troubleshooting Common Issues

### 1. "Missing script" errors
- **Solution**: Download the complete project from v0 (Step 1)

### 2. Algolia import errors
- **Solution**: The complete project has the correct Algolia v4 import

### 3. Vision API 403 errors
- **Solution**: The complete project has graceful error handling

### 4. Hydration errors
- **Solution**: The complete project has fixed HTML structure

### 5. "toFixed" runtime errors
- **Solution**: The complete project has null safety checks

## Firebase Setup (If you don't have Firebase configured)

1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Firestore Database
4. Go to Project Settings > Service Accounts
5. Generate a new private key (downloads JSON file)
6. Copy the values to your `.env.local` file

## Algolia Setup (Optional)

1. Go to https://www.algolia.com/
2. Create a free account
3. Create a new application
4. Go to API Keys section
5. Copy App ID and Admin API Key to `.env.local`

## Google Vision API Setup (Optional)

1. Go to https://console.cloud.google.com/
2. Enable the Vision API
3. Create an API key
4. Copy the key to `.env.local`

## Final Verification

After completing all steps, run:

\`\`\`bash
npm run test:apis
\`\`\`

You should see:
- ✅ Firebase: PASS
- ✅ Algolia: PASS (if configured)
- ✅ Google Vision: PASS (if configured)
- 🎉 All tests passed! System is ready.

Your visual search system is now fully functional with text, voice, and image search capabilities!
