# Testing Guide

## Overview
This project uses Jest and React Testing Library for comprehensive unit testing with code coverage reporting.

## Test Structure

```
__tests__/
├── lib/
│   ├── utils.test.ts        # Utility function tests
│   └── storage.test.ts      # JSON storage tests
├── api/
│   ├── auth/
│   │   ├── signup.test.ts   # Signup API tests
│   │   ├── login.test.ts    # Login API tests
│   │   └── verify.test.ts   # Token verification tests
│   ├── cases/
│   │   └── cases.test.ts    # Case management API tests
│   └── config.test.ts       # Configuration API tests
└── app/
    ├── page.test.tsx        # Home page tests
    ├── login.test.tsx       # Login page tests
    ├── signup.test.tsx      # Signup page tests
    └── submit-case.test.tsx # Case submission tests
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

### Generate and Open Coverage Report
```bash
npm run test:coverage:open
```

## Coverage Thresholds

The project maintains the following minimum coverage requirements:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Test Coverage Areas

### 1. Utility Functions (`lib/utils.ts`)
- ✅ Password hashing and comparison
- ✅ JWT token generation and verification
- ✅ ID generation
- ✅ Email validation
- ✅ Phone number validation

### 2. Storage Layer (`lib/storage.ts`)
- ✅ Reading all data
- ✅ Writing data
- ✅ Finding single items
- ✅ Finding multiple items
- ✅ Creating items
- ✅ Updating items
- ✅ Deleting items
- ✅ Handling missing files

### 3. Authentication APIs
**Signup** (`/api/auth/signup`)
- ✅ Successful user registration
- ✅ Validation errors (missing fields, invalid email, invalid phone, short password)
- ✅ Duplicate user handling

**Login** (`/api/auth/login`)
- ✅ Successful login with valid credentials
- ✅ Missing credentials error
- ✅ Non-existent user error
- ✅ Incorrect password error

**Verify** (`/api/auth/verify`)
- ✅ Valid token verification
- ✅ Missing authorization header
- ✅ Invalid token handling
- ✅ User not found error

### 4. Case Management APIs
**Cases** (`/api/cases`)
- ✅ Creating new case
- ✅ Authorization validation
- ✅ Required field validation
- ✅ Loss type validation
- ✅ Retrieving user's cases
- ✅ Sorting by date

### 5. Configuration API
**Config** (`/api/config`)
- ✅ Returning YouTube configuration
- ✅ Default configuration fallback

### 6. React Components/Pages
**Home Page** (`/`)
- ✅ Rendering hero section
- ✅ Displaying YouTube video embed
- ✅ Navigation links
- ✅ Feature cards
- ✅ Benefits section

**Login Page** (`/login`)
- ✅ Form rendering
- ✅ Successful login flow
- ✅ Error handling
- ✅ Navigation to signup

**Signup Page** (`/signup`)
- ✅ Form rendering
- ✅ Successful registration
- ✅ Password mismatch validation
- ✅ Error handling
- ✅ Navigation to login

**Submit Case Page** (`/submit-case`)
- ✅ Form rendering
- ✅ Loss type validation
- ✅ Successful submission
- ✅ Authentication check
- ✅ Dynamic monetary loss field

## Viewing Coverage Reports

After running `npm run test:coverage`, coverage reports are generated in multiple formats:

### HTML Report (Detailed)
Open `coverage/lcov-report/index.html` in your browser for an interactive, detailed view:
- Line-by-line coverage
- Branch coverage visualization
- File-by-file breakdown
- Color-coded coverage indicators

### Terminal Summary
Quick overview displayed in terminal after running tests:
- Overall coverage percentages
- Per-file coverage
- Uncovered lines

### LCOV Report
`coverage/lcov.info` - Machine-readable format for CI/CD integration

## Writing New Tests

### Test File Naming
- Unit tests: `*.test.ts` or `*.test.tsx`
- Place tests in `__tests__` directory matching source structure

### Example Test Structure
```typescript
import { functionToTest } from '@/path/to/module';

describe('Module Name', () => {
  describe('functionToTest', () => {
    it('should do something expected', () => {
      const result = functionToTest(input);
      expect(result).toBe(expected);
    });

    it('should handle edge cases', () => {
      // Test edge cases
    });
  });
});
```

### Mocking Guidelines
- **File System**: Mock `fs` module for storage tests
- **Next.js Router**: Mock `next/navigation` for page tests
- **Fetch API**: Mock `global.fetch` for API tests
- **localStorage**: Mock `global.localStorage` for auth tests

## Best Practices

1. **Arrange-Act-Assert**: Structure tests clearly
2. **Clear Descriptions**: Use descriptive test names
3. **Test Edge Cases**: Include error scenarios
4. **Isolated Tests**: Each test should be independent
5. **Mock External Dependencies**: Don't make real API calls or file operations
6. **Clean Up**: Use `beforeEach` and `afterEach` hooks

## Continuous Integration

Add to your CI/CD pipeline:
```yaml
# Example GitHub Actions workflow
- name: Run tests with coverage
  run: npm run test:coverage

- name: Check coverage threshold
  run: |
    if ! npm test -- --coverage --passWithNoTests; then
      echo "Coverage threshold not met"
      exit 1
    fi
```

## Troubleshooting

### Tests Failing
```bash
# Clear Jest cache
npx jest --clearCache

# Run specific test file
npm test -- path/to/test.test.ts

# Run with verbose output
npm test -- --verbose
```

### Coverage Not Updating
```bash
# Remove coverage directory
rm -rf coverage

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Watch Mode Not Working
```bash
# Run with no cache
npm run test:watch -- --no-cache
```

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
