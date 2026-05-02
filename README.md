# LocaVibe 🌟

**Find Your Vibe, Explore Your City**

LocaVibe is a community-driven platform that helps you discover the best local
spots in your city. Whether you're new in town or a longtime resident, find cozy
cafés, budget-friendly shopping, hidden gems, and the perfect hangout spots
based on real reviews from locals.

## 🚀 Features

- **Restaurant Discovery**: Browse and discover local restaurants with detailed
  information
- **Community Reviews**: Read and write authentic reviews from real users
- **User Authentication**: Secure login/signup system with JWT authentication
- **Review Management**: Like/dislike reviews and manage your own reviews
- **Admin Panel**: Administrative interface for content management
- **Image Upload**: Upload images using Cloudinary integration
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Interactive UI**: Smooth animations with Framer Motion

## 🛠 Tech Stack

### Frontend

- **Next.js 15.2.0** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **React Icons** - Additional icon set
- **React Toastify** - Toast notifications

### Backend

- **Next.js API Routes** - Server-side API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing

### Third-party Services

- **Cloudinary** - Image upload and management
- **OpenAI API** - AI integration (optional)
- **Google Maps API** - Location services (optional)

## 📁 Project Structure

```
locavibe/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin panel
│   │   ├── api/               # API routes
│   │   │   ├── restaurant/    # Restaurant CRUD operations
│   │   │   ├── review/        # Review management
│   │   │   ├── users/         # User authentication
│   │   │   └── upload/        # File upload handling
│   │   ├── community/         # Community page
│   │   ├── discover/          # Restaurant discovery
│   │   ├── login/             # Authentication pages
│   │   ├── profile/           # User profile
│   │   └── write-review/      # Review creation
│   ├── components/            # Reusable React components
│   │   ├── ui/               # UI components
│   │   └── ...               # Feature components
│   ├── db/                   # Database configuration
│   ├── helpers/              # Utility functions
│   ├── lib/                  # Shared libraries
│   ├── middleware/           # Custom middleware
│   └── models/               # MongoDB schemas
├── public/                   # Static assets
└── ...                      # Configuration files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB database
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd locavibe
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env.local` file in the root directory:

   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication
   TOKEN_SECRET=your_jwt_secret_key
   JWT_SECRET=your_jwt_secret_key

   # Application
   DOMAIN_URI=http://localhost:3000
   NODE_ENV=development

   # Cloudinary (Image Upload)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLOUDINARY_URL=your_cloudinary_url

   # Admin Credentials
   ADMIN_NAME=your_admin_name
   ADMIN_EMAIL=your_admin_email

   # Optional: OpenAI API
   OPENAI_API_KEY=your_openai_api_key

   # Optional: Google Maps
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Models

### User Model

- Username, email, password
- Verification status
- Admin privileges
- Password reset tokens

### Restaurant Model

- Name, location, description
- Image URL, rating, review count
- Categories, price range
- Opening hours

### Review Model

- User information
- Title, content, rating
- Category, timing, audience
- Like/dislike counts

### Saved Model

- User's saved restaurants/reviews

## 🔐 API Endpoints

### Authentication

- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/update` - Update user profile

### Restaurants

- `GET /api/restaurant` - Get all restaurants
- `POST /api/restaurant` - Create new restaurant

### Reviews

- `GET /api/review/get-reviews` - Get all reviews
- `POST /api/review/save-review` - Create new review
- `GET /api/review/reviews` - Get reviews by criteria
- `POST /api/review/vote` - Vote on reviews

### File Upload

- `POST /api/upload` - Upload images to Cloudinary

## 🎨 Key Features

### User Authentication

- Secure JWT-based authentication
- Password hashing with bcryptjs
- Protected routes and middleware

### Review System

- Community-driven reviews
- Rating system (1-5 stars)
- Like/dislike functionality
- Review categorization

### Image Management

- Cloudinary integration for image uploads
- Optimized image delivery
- Responsive image components

### Admin Panel

- Content management interface
- User management
- Review moderation

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Ensure all environment variables are properly set in your production
environment, especially:

- `NODE_ENV=production`
- Secure `TOKEN_SECRET` and `JWT_SECRET`
- Production MongoDB URI
- Production domain URI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 🐛 Known Issues

- Google Maps integration is currently commented out
- Email functionality is disabled
- Some API keys in .env are placeholder values

## 📞 Support

For support and questions, please contact the development team.

---

**Built with ❤️ for local communities**
