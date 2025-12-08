# Honest Customer Experience India - AI Agent Instructions

## Project Overview
This is a Next.js 15 application for reporting and tracking bad customer experiences. Users submit cases, admins verify them, and verified cases become YouTube podcasts. Built with TypeScript, Tailwind CSS, and JSON file storage.

## Architecture

### Key Components
- **Frontend**: Next.js App Router with client-side React components
- **Backend**: Next.js API routes (REST endpoints in `/app/api/`)
- **Authentication**: JWT-based (tokens in localStorage, Bearer auth headers)
- **Storage**: JSON files via `JsonStorage<T>` class in `/lib/storage.ts`
- **Data Flow**: User → API → Storage → JSON files in `/data/`

### Critical Files
- `lib/types.ts` - All TypeScript interfaces (User, Case, CaseUpdate, etc.)
- `lib/storage.ts` - Generic JSON CRUD operations, used by all API routes
- `lib/utils.ts` - Auth helpers (hashPassword, verifyToken, generateId)

## Development Workflows

### Run Development Server
```bash
npm run dev
# Opens http://localhost:3000
```

### Build for Production
```bash
npm run build
npm start
```

### Install Dependencies
```bash
npm install
```

## Project-Specific Conventions

### API Route Pattern
All API routes follow this structure:
```typescript
// 1. Extract/verify auth token from headers
const token = request.headers.get('authorization')?.substring(7);
const decoded = verifyToken(token);

// 2. Use storage.{entity}.method() for data operations
const user = await storage.users.findOne(u => u.id === decoded.userId);

// 3. Return NextResponse.json() with status
return NextResponse.json({ success: true, data }, { status: 200 });
```

### Storage Operations
Use `storage` object from `lib/storage.ts`:
```typescript
// Read all
const users = await storage.users.readAll();

// Find one
const user = await storage.users.findOne(u => u.email === email);

// Create
const newCase = await storage.cases.create({ id: generateId(), ...data });

// Update
await storage.cases.update(c => c.id === id, { status: 'verified' });
```

### Authentication Flow
1. Login/signup returns JWT token + user object
2. Client stores in localStorage: `localStorage.setItem('token', token)`
3. Protected API calls include: `Authorization: Bearer ${token}`
4. API routes verify token before processing

### Case Status Lifecycle
```
submitted → under_review → verified → scheduled_for_podcast → published
                    ↓
                rejected
```

### Client-Side Pages
- All pages use `'use client'` directive (App Router client components)
- Check auth on mount: redirect to `/login` if no token
- Use standard `fetch()` for API calls (not axios/SWR)

## Common Patterns

### Adding New API Endpoint
1. Create file in `app/api/{endpoint}/route.ts`
2. Export `GET`, `POST`, `PUT`, or `DELETE` function
3. Import from `@/lib/storage` and `@/lib/types`
4. Use `storage.{entity}` methods for data operations
5. Return `NextResponse.json()`

### Adding New Page
1. Create `app/{page-name}/page.tsx`
2. Add `'use client'` at top
3. Use Tailwind CSS classes for styling
4. Check authentication if needed (localStorage token)
5. Fetch from `/api/...` endpoints

### Data Model Changes
1. Update interfaces in `lib/types.ts`
2. Consider migration for existing JSON files in `/data/`
3. Update API routes that use the modified types

## External Dependencies

### Package Usage
- `bcryptjs` - Password hashing (see `lib/utils.ts`)
- `jsonwebtoken` - JWT creation/verification
- `next` - Framework (use Next 15 App Router patterns)
- `react` - UI library (version 19)
- `tailwindcss` - Styling (utility-first, no custom CSS)

### YouTube Integration
- Featured video on homepage via YouTube embed (`/app/page.tsx`)
- Video ID from `storage.config` (GET `/api/config`)
- Embed URL: `https://www.youtube.com/embed/${videoId}`

## Important Notes

- **No Database**: All data persists to `/data/*.json` files
- **Security**: Change `JWT_SECRET` in production (`.env.local`)
- **Client State**: Auth state in localStorage, not React context
- **Error Handling**: Return JSON errors with appropriate status codes
- **Validation**: Use `isValidEmail()`, `isValidPhone()` from `lib/utils.ts`

## Next Steps for Development

When extending this codebase:
1. Admin verification system needs API routes + UI
2. File upload for evidence requires multipart handling
3. Consider database migration when scaling beyond file storage
4. Add email notifications via nodemailer or similar
5. Implement public case browsing (currently users only see their own)
