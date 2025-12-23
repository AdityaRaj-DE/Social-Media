# Social Media Next.js Application

A full-stack social media application built with Next.js 16, featuring user authentication, posts, likes, and image uploads. This project demonstrates modern web development practices using the Next.js App Router, MongoDB, and Cloudinary for media management.

## 🚀 Features

- **User Authentication**
  - User registration with email and username
  - Secure login/logout functionality
  - JWT-based authentication with HTTP-only cookies
  - Protected routes and API endpoints

- **User Profiles**
  - User profile management
  - Customizable profile pictures
  - User information (username, name, age, email)

- **Posts**
  - Create posts with text content
  - Upload and attach images to posts
  - View all posts in chronological order
  - View user-specific posts

- **Social Interactions**
  - Like/unlike posts
  - View like counts
  - User-specific post feeds

- **Media Management**
  - Image upload to Cloudinary
  - Secure file handling
  - Optimized image storage

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.10 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB with Mongoose 9.0.1
- **Authentication**: JWT (jsonwebtoken) with bcryptjs for password hashing
- **Media Storage**: Cloudinary
- **Runtime**: React 19.2.1

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ and npm/yarn/pnpm/bun
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account (for image uploads)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd socialmedia-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory with the following variables:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

   **Environment Variables Explained:**
   - `MONGODB_URI`: Your MongoDB connection string (e.g., `mongodb://localhost:27017/socialmedia` or MongoDB Atlas URI)
   - `JWT_SECRET`: A secure random string for signing JWT tokens (use a strong secret in production)
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
socialmedia-next/
├── src/
│   ├── app/                    # Next.js App Router pages and API routes
│   │   ├── api/                # API endpoints
│   │   │   ├── auth/           # Authentication routes
│   │   │   │   ├── login/      # POST /api/auth/login
│   │   │   │   ├── logout/     # POST /api/auth/logout
│   │   │   │   └── register/   # POST /api/auth/register
│   │   │   ├── posts/          # Post management routes
│   │   │   │   ├── [id]/       # Individual post operations
│   │   │   │   │   ├── like/   # POST /api/posts/[id]/like
│   │   │   │   │   └── route.ts # GET/DELETE /api/posts/[id]
│   │   │   │   └── route.ts    # GET/POST /api/posts
│   │   │   ├── upload/         # POST /api/upload (image upload)
│   │   │   └── users/          # User management routes
│   │   │       ├── [id]/       # GET /api/users/[id]
│   │   │       ├── me/         # Current user routes
│   │   │       │   ├── posts/  # GET /api/users/me/posts
│   │   │       │   └── route.ts # GET /api/users/me
│   │   │       └── profile-pic/ # POST /api/users/profile-pic
│   ├── lib/                    # Utility libraries
│   │   ├── auth.ts             # Authentication helpers (JWT)
│   │   ├── cloudinary.ts       # Cloudinary configuration
│   │   └── db.ts               # MongoDB connection
│   ├── models/                 # Mongoose models
│   │   ├── Post.ts             # Post schema
│   │   └── User.ts             # User schema
│   └── middleware.ts           # Next.js middleware for route protection
├── public/                     # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ username, name, age, email, password }`
  - Returns: `{ success: true }`

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ success: true }`

- `POST /api/auth/logout` - Logout user
  - Returns: `{ success: true }`

### Posts

- `GET /api/posts` - Get all posts (chronological order)
  - Returns: Array of posts with populated user data

- `POST /api/posts` - Create a new post (requires authentication)
  - Body: `{ content?, imageUrl? }`
  - Returns: Created post object

- `GET /api/posts/[id]` - Get a specific post
  - Returns: Post object with populated user data

- `DELETE /api/posts/[id]` - Delete a post (requires authentication)
  - Returns: `{ success: true }`

- `POST /api/posts/[id]/like` - Like/unlike a post (requires authentication)
  - Returns: `{ liked: boolean, likesCount: number }`

### Users

- `GET /api/users/me` - Get current authenticated user
  - Returns: User object (without password)

- `GET /api/users/me/posts` - Get current user's posts
  - Returns: Array of user's posts

- `GET /api/users/[id]` - Get user by ID
  - Returns: User object (without password)

- `POST /api/users/profile-pic` - Update profile picture (requires authentication)
  - Body: `{ imageUrl }`
  - Returns: Updated user object

### Upload

- `POST /api/upload` - Upload image to Cloudinary (requires authentication)
  - Body: FormData with `file` field
  - Returns: `{ url: string, publicId: string }`

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in HTTP-only cookies for security. The middleware automatically protects routes and API endpoints, redirecting unauthenticated users to the login page.

**Public Routes:**
- `/login`
- `/register`
- `/api/auth/login`
- `/api/auth/register`

All other routes require authentication.

## 🗄️ Database Models

### User Model
```typescript
{
  username: string (unique, required)
  name: string (required)
  age: number (required)
  email: string (unique, required, lowercase)
  password: string (hashed, required)
  profilePic: string (default: "Default.jpeg")
  timestamps: true
}
```

### Post Model
```typescript
{
  user: ObjectId (ref: User, required)
  content: string (optional)
  imageUrl: string (optional)
  likes: [ObjectId] (ref: User)
  timestamps: true
}
```

## 🚦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Styling

This project uses Tailwind CSS 4 for styling. The configuration is set up in `postcss.config.mjs` and `tailwind.config.ts` (if present).

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT tokens stored in HTTP-only cookies
- Protected API routes via middleware
- Input validation on API endpoints
- Secure file upload handling

## 🚢 Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## 📝 Development Notes

- The project uses Next.js App Router with TypeScript
- MongoDB connection is cached for performance
- Cloudinary is used for image storage and optimization
- Middleware handles route protection automatically
- All API routes are server-side rendered

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and not licensed for public use.

## 🐛 Troubleshooting

**MongoDB Connection Issues:**
- Ensure MongoDB is running (if using local instance)
- Verify `MONGODB_URI` is correct in `.env.local`
- Check network connectivity for MongoDB Atlas

**Cloudinary Upload Issues:**
- Verify all Cloudinary credentials are correct
- Check file size limits
- Ensure proper file format

**Authentication Issues:**
- Clear browser cookies
- Verify `JWT_SECRET` is set
- Check token expiration (default: 7 days)

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [JWT Documentation](https://jwt.io)


---

<<<<<<< HEAD:README.md
Built with ❤️ using Next.js
=======
Built with ❤️ using Next.js

>>>>>>> 210fa40168177d219a433c46fe9f3387fe5214ae:readme.md
