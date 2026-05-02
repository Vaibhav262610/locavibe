# Development Guide

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- Git installed

### 2. Setup Steps

```bash
# Clone the repository
git clone <your-repo-url>
cd locavibe

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your actual values
# Update MongoDB URI, secrets, and API keys
```

### 3. Environment Configuration

Edit `.env` file with your actual values:

```env
# Database - Replace with your MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/locavibe

# Secrets - Generate strong random values
TOKEN_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

# Cloudinary - Get from your Cloudinary dashboard
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🛠 Development Workflow

### Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API endpoints
│   ├── (pages)/        # Page components
│   └── globals.css     # Global styles
├── components/         # Reusable components
├── models/            # Database schemas
├── db/                # Database connection
└── lib/               # Utilities
```

### Key Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Models

- **User**: Authentication and profile data
- **Restaurant**: Restaurant information
- **Review**: User reviews and ratings
- **Saved**: User's saved items

### API Routes

- `/api/users/*` - Authentication and user management
- `/api/restaurant` - Restaurant CRUD operations
- `/api/review/*` - Review management
- `/api/upload` - File upload handling

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration/login
- [ ] Restaurant browsing
- [ ] Review creation/editing
- [ ] Image upload functionality
- [ ] Protected route access
- [ ] Admin panel (if admin user)

### API Testing

Use tools like Postman or curl to test API endpoints:

```bash
# Test user registration
curl -X POST http://localhost:3000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🐛 Common Issues

### MongoDB Connection Issues

- Verify MongoDB URI format
- Check network access (whitelist IP for cloud MongoDB)
- Ensure database user has proper permissions

### Authentication Issues

- Verify JWT secrets are set
- Check token expiration settings
- Clear browser cookies if needed

### Image Upload Issues

- Verify Cloudinary credentials
- Check API key permissions
- Ensure proper CORS settings

## 📦 Adding New Features

### 1. Create API Route

```javascript
// src/app/api/example/route.js
import { NextResponse } from "next/server";
import { connectDb } from "@/db/db";

export async function GET() {
	await connectDb();
	// Your logic here
	return NextResponse.json({ success: true });
}
```

### 2. Create Database Model

```javascript
// src/models/Example.js
import mongoose from "mongoose";

const ExampleSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
	},
	{ timestamps: true },
);

export default mongoose.models.Example ||
	mongoose.model("Example", ExampleSchema);
```

### 3. Create Page Component

```javascript
// src/app/example/page.jsx
"use client";
import { useState, useEffect } from "react";

export default function ExamplePage() {
	return <div>Example Page</div>;
}
```

## 🔧 Configuration Files

### Next.js Config (`next.config.mjs`)

- Image optimization settings
- Environment variable configuration
- Build optimization

### Tailwind Config

- Custom theme configuration
- Plugin settings
- Responsive breakpoints

### ESLint Config (`eslint.config.mjs`)

- Code quality rules
- Next.js specific rules
- Custom rule overrides

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
