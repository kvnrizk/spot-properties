# ESLint & TypeScript Issues - Fixing Guide

This document lists all linting and TypeScript issues found during the build and how to fix them.

## Quick Fix for Production Deploy

If you need to deploy immediately and fix linting issues later, update `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  // ... other config
  eslint: {
    ignoreDuringBuilds: true, // Change to true for quick deploy
  },
  typescript: {
    ignoreBuildErrors: true, // Change to true for quick deploy
  },
};
```

**⚠️ WARNING:** This is NOT recommended for long-term. Fix the issues below properly.

---

## Issues to Fix

### 1. TypeScript `any` Type Issues

**Problem:** Using `any` type instead of proper types

**Files affected:**
- `src/app/admin/admin-layout-client.tsx:18:12`
- `src/app/api/properties/route.ts:161:32`
- `src/app/api/properties/[slug]/route.ts:138:23`
- `src/app/api/upload/route.ts:26-29`
- `src/app/[locale]/(public)/page.tsx:5:19`
- `src/app/[locale]/(public)/properties/filter-form.tsx:19-20`
- `src/app/[locale]/layout.tsx:21:35`
- `src/lib/activity-logs.ts:25:16`
- `src/middleware.ts:12:52`

**Fix:** Replace `any` with proper types

#### Example fixes:

**src/middleware.ts**
```typescript
// Before
export default auth(async function middleware(req: any) {

// After
import { NextRequest } from "next/server";
export default auth(async function middleware(req: NextRequest) {
```

**src/app/api/upload/route.ts**
```typescript
// Before
uploadResult = await cloudinary.uploader.upload(file, {
  folder: "spot-properties",
}) as any;

// After
import { UploadApiResponse } from "cloudinary";
uploadResult = await cloudinary.uploader.upload(file, {
  folder: "spot-properties",
}) as UploadApiResponse;
```

**src/app/[locale]/layout.tsx**
```typescript
// Before
children: any;

// After
children: React.ReactNode;
```

---

### 2. Unused Variables

**Problem:** Variables defined but never used

**Files affected:**
- `src/app/admin/page.tsx:5:16` - `'CheckCircle' is defined but never used`
- `src/app/login/page.tsx:38:14` - `'error' is defined but never used`
- `src/app/[locale]/(public)/layout.tsx:18:9` - `'locale' is assigned but never used`
- `src/app/[locale]/(public)/login/page.tsx:38:14` - `'error' is defined but never used`
- `src/lib/env.ts:55:15` - `'_' is defined but never used`
- `src/lib/env.ts:75:17` - `'_' is defined but never used`

**Fix:** Remove unused imports or prefix with underscore

#### Example fixes:

**src/app/admin/page.tsx**
```typescript
// Before
import { Home, CheckCircle, Calendar, Users, TrendingUp, Clock } from "lucide-react";

// After (remove CheckCircle)
import { Home, Calendar, Users, TrendingUp, Clock } from "lucide-react";
```

**src/lib/env.ts**
```typescript
// Before
.filter(([_, value]) => !value)

// After (already using underscore, just suppress warning)
.filter(([, value]) => !value)
// OR
.filter(([_key, value]) => !value)
```

---

### 3. React Hooks Dependencies

**Problem:** Missing dependency in useEffect

**File:** `src/app/admin/properties/[id]/page.tsx:47:6`

**Fix:** Add dependency or extract function outside component

```typescript
// Option 1: Add to dependencies
useEffect(() => {
  fetchProperty();
}, [fetchProperty]);

// Option 2: Move function inside useEffect
useEffect(() => {
  const fetchProperty = async () => {
    // ... implementation
  };
  fetchProperty();
}, [id]); // Add any dependencies the function uses
```

---

### 4. Prefer const over let

**Problem:** Variable never reassigned, should use const

**File:** `src/i18n/request.ts:7:7`

**Fix:**
```typescript
// Before
let locale = await getLocale(config);

// After
const locale = await getLocale(config);
```

---

## Automated Fixes

Some issues can be fixed automatically with ESLint:

```bash
# Fix all auto-fixable issues
npm run lint -- --fix

# Or use npx
npx eslint . --fix
```

---

## Manual Fixes Checklist

Go through each file and apply the fixes:

### Priority 1 (Blocks Build)
- [ ] Fix all `any` types in middleware
- [ ] Fix all `any` types in API routes
- [ ] Fix all `any` types in layouts

### Priority 2 (Warnings)
- [ ] Remove unused imports
- [ ] Fix useEffect dependencies
- [ ] Change `let` to `const` where applicable

### Priority 3 (Code Quality)
- [ ] Replace all remaining `any` types
- [ ] Add proper TypeScript interfaces
- [ ] Clean up unused variables

---

## Alternative: Configure ESLint Rules

Create `.eslintrc.json` in project root:

```json
{
  "extends": "next/core-web-vitals",
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "prefer-const": "warn"
  }
}
```

This changes errors to warnings, allowing builds to succeed while still showing issues.

---

## Verification

After making fixes, run:

```bash
# Check for linting issues
npm run lint

# Test build
npm run build

# If successful, you should see:
# ✓ Compiled successfully
```

---

## Best Practices Going Forward

1. **Use TypeScript properly:** Always define types, avoid `any`
2. **Clean imports:** Remove unused imports regularly
3. **React hooks:** Always include all dependencies
4. **Code reviews:** Check for linting issues before committing
5. **Pre-commit hooks:** Set up Husky to run linting before commits

---

## Need Help?

- TypeScript handbook: https://www.typescriptlang.org/docs/
- ESLint rules: https://eslint.org/docs/rules/
- Next.js ESLint: https://nextjs.org/docs/app/building-your-application/configuring/eslint
