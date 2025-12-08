# Quick Start Guide

## Initial Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   Update `JWT_SECRET` in `.env.local` for production

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

## First Steps

### 1. Create a User Account
- Navigate to http://localhost:3000
- Click "Submit Your Case" or "Sign Up"
- Fill in registration form
- You'll be automatically logged in

### 2. Submit a Case
- After signup, you're redirected to the case submission form
- Fill in all required fields:
  - Company/Business name
  - Business domain
  - Incident date
  - Detailed description
  - Loss types (select at least one)
  - Contact information
- Submit the case

### 3. Track Your Cases
- Visit Dashboard to see all your submitted cases
- Click "View Details" on any case to see:
  - Full case information
  - Current status
  - Timeline of updates
  - Podcast video (if published)

## Application Structure

### User Flow
```
Home → Signup/Login → Submit Case → Dashboard → Case Details
```

### API Endpoints (Protected with JWT)
```
POST   /api/auth/signup      - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/verify      - Verify token
POST   /api/cases            - Submit new case
GET    /api/cases            - Get user's cases
GET    /api/cases/[id]       - Get case details
GET    /api/config           - Get YouTube config
```

### Case Status Flow
```
submitted → under_review → verified → scheduled_for_podcast → published
                                ↓
                            rejected
```

## Data Storage

All data is stored in JSON files under `/data/`:
- `users.json` - User accounts
- `cases.json` - Case submissions
- `updates.json` - Case updates/timeline
- `config.json` - YouTube configuration

**Note:** These files are gitignored and created automatically on first use.

## Development Tips

### Testing Authentication
1. Use browser DevTools → Application → Local Storage
2. Token stored as `token` key
3. User info stored as `user` key

### Viewing JSON Data
```bash
# View all users (password hashes included)
cat data/users.json

# View all cases
cat data/cases.json

# View updates
cat data/updates.json
```

### Clearing Data
```bash
# Remove all data (be careful!)
rm data/*.json
```

## Production Deployment

1. **Set environment variables:**
   - `JWT_SECRET` - Strong random secret

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Start production server:**
   ```bash
   npm start
   ```

4. **Deploy to platforms:**
   - Vercel (recommended for Next.js)
   - Netlify
   - Railway
   - Any Node.js hosting

## Troubleshooting

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Check types
npx tsc --noEmit
```

### Port Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

## Next Features to Implement

1. **Admin Panel**
   - Verify/reject cases
   - Add updates to cases
   - Set podcast video URLs
   - Manage featured YouTube video

2. **File Uploads**
   - Evidence attachments
   - Image/document support

3. **Email Notifications**
   - Case status updates
   - Welcome emails

4. **Public Case Browsing**
   - Search and filter
   - Display verified cases
   - Company ratings

5. **Database Migration**
   - PostgreSQL or MongoDB
   - Better performance at scale
   - Advanced querying

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [JWT.io](https://jwt.io) - Token debugging
- Project structure: See `README.md`
- AI Agent guidance: See `.github/copilot-instructions.md`
