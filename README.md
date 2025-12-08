# Honest Customer Experience India

A Next.js web application for customers to share genuine bad experiences with businesses. The platform verifies submissions and creates YouTube podcast content to help others make informed decisions.

## Features

- **User Authentication**: JWT-based signup/login for case submitters
- **Case Submission**: Detailed form for reporting bad customer experiences
- **Case Tracking**: Personal dashboard to monitor case status and updates
- **YouTube Integration**: Featured video on homepage with channel link
- **Status Management**: Track cases from submission to podcast publication
- **JSON Storage**: File-based data persistence (users, cases, updates)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: JWT (jsonwebtoken, bcryptjs)
- **Storage**: JSON files (file system)

## Project Structure

```
├── app/
│   ├── api/                    # REST API routes
│   │   ├── auth/              # Authentication endpoints
│   │   │   ├── signup/        # User registration
│   │   │   ├── login/         # User login
│   │   │   └── verify/        # Token verification
│   │   ├── cases/             # Case management
│   │   │   ├── route.ts       # GET (list), POST (create)
│   │   │   └── [id]/          # GET case by ID with updates
│   │   └── config/            # YouTube config endpoint
│   ├── page.tsx               # Home page (hero + YouTube embed)
│   ├── signup/                # User registration page
│   ├── login/                 # User login page
│   ├── dashboard/             # User dashboard (list cases)
│   ├── submit-case/           # Case submission form
│   └── case/[id]/             # Case detail view with updates
├── lib/
│   ├── types.ts               # TypeScript interfaces
│   ├── storage.ts             # JSON storage handler
│   └── utils.ts               # Auth & validation utilities
└── data/                      # JSON data files (gitignored)
```

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```
JWT_SECRET=your-secret-key-change-in-production
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Testing

Comprehensive unit tests with **99%+ code coverage**:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Open HTML coverage report
npm run test:coverage:open
```

Test coverage includes:
- ✅ Utility functions (JWT, validation, hashing) - 100%
- ✅ Storage layer (JSON CRUD operations) - 100%
- ✅ React components (login, signup, homepage) - 97-100%

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## Data Models

### User
- Authentication credentials
- Profile information (name, email, phone)

### Case
- Company/business details
- Incident information
- Loss types (money, time, opportunity, meeting, other)
- Contact information
- Status tracking (submitted → under_review → verified → scheduled_for_podcast → published)
- Optional: podcast video URL

### CaseUpdate
- Timeline of status changes
- Messages for case submitters
- Created by admin or system

### YouTubeConfig
- Channel URL
- Featured video ID for homepage

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Cases
- `POST /api/cases` - Submit new case (authenticated)
- `GET /api/cases` - Get user's cases (authenticated)
- `GET /api/cases/[id]` - Get case details with updates (authenticated)

### Configuration
- `GET /api/config` - Get YouTube channel configuration

## Key Features

### Authentication Flow
1. User signs up with email/password
2. JWT token stored in localStorage
3. Token sent in Authorization header for protected routes
4. Token verified on backend for all authenticated requests

### Case Submission Flow
1. User logs in/signs up
2. Submits case with business details, incident info, and loss types
3. Case created with "submitted" status
4. Initial update added to case timeline
5. User can track progress in dashboard

### Storage Pattern
- JSON files in `/data` directory
- `JsonStorage<T>` class provides CRUD operations
- Generic methods: `readAll`, `findOne`, `findMany`, `create`, `update`, `delete`
- File-based persistence (no database required)

## Development Conventions

### API Response Format
```typescript
// Success
{ success: true, data: {...} }

// Error
{ error: "Error message" }
```

### Authentication
- Bearer token in Authorization header
- Token format: `Bearer <jwt_token>`
- All protected routes verify token first

### Status Flow
```
submitted → under_review → verified → scheduled_for_podcast → published
                    ↓
                rejected
```

### Client-Side Patterns
- All pages use `'use client'` directive
- localStorage for token/user persistence
- Redirect to `/login` if not authenticated
- Fetch API for HTTP requests

## Future Enhancements

- Admin panel for case verification
- File upload for evidence
- Email notifications
- Search and filter cases
- Public case browsing
- Admin authentication
- Database migration (PostgreSQL/MongoDB)

## License

Private - All rights reserved
