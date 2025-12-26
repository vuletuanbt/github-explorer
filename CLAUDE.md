# CLAUDE.md - GitHub Explorer Codebase Guide

This document provides comprehensive guidance for AI assistants working with the GitHub Explorer codebase. It covers architecture patterns, development workflows, and conventions to follow.

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Codebase Structure](#codebase-structure)
- [Architecture Patterns](#architecture-patterns)
- [Development Workflows](#development-workflows)
- [Key Conventions](#key-conventions)
- [GraphQL & Code Generation](#graphql--code-generation)
- [Styling & UI Components](#styling--ui-components)
- [Environment Setup](#environment-setup)
- [API Routes](#api-routes)
- [State Management](#state-management)
- [Common Tasks](#common-tasks)

---

## Project Overview

**GitHub Explorer** is a Next.js application that interfaces with the GitHub GraphQL API to explore users, repositories, and issues. The project emphasizes type safety, code generation, and modern React patterns.

**Key Features:**
- User search and exploration
- Repository browsing with infinite scroll
- Issue management with cursor-based pagination
- Type-safe GraphQL operations
- Responsive UI built with Radix UI and Tailwind CSS

---

## Tech Stack

### Core Framework
- **Next.js 14** - App Router with React Server Components (RSC)
- **React 18** - UI library
- **TypeScript 5** - Type safety

### Data Fetching & State
- **TanStack Query v5** (React Query) - Server state management
- **GraphQL Request** - GraphQL client
- **GraphQL Code Generator** - Type generation from schemas

### Styling & UI
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library (New York style)
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Icon library
- **class-variance-authority** - Component variants
- **tailwind-merge** & **clsx** - Class name utilities

### Development Tools
- **ESLint** - Linting
- **Yarn** - Package manager
- **Docker** - Containerization

---

## Codebase Structure

```
github-explorer/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   ├── users/           # User endpoints
│   │   │   ├── repositories/    # Repository endpoints
│   │   │   └── issues/          # Issue endpoints
│   │   ├── users/               # User pages
│   │   │   └── [username]/
│   │   │       └── repository/
│   │   │           └── [name]/  # Repository detail pages
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── globals.css          # Global styles
│   │   └── fonts/               # Local fonts
│   │
│   ├── features/                # Feature modules (domain-driven)
│   │   ├── user/
│   │   │   ├── action/          # Client-side data fetching
│   │   │   ├── components/      # Feature-specific components
│   │   │   ├── graphql/         # GraphQL queries (.gql files)
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── schemas/         # Validation schemas
│   │   │   └── services/        # Server-side GraphQL calls
│   │   ├── repository/
│   │   │   ├── action/
│   │   │   ├── components/
│   │   │   ├── graphql/
│   │   │   ├── hooks/
│   │   │   └── services/
│   │   └── issue/
│   │       ├── action/
│   │       ├── components/
│   │       ├── graphql/
│   │       ├── hooks/
│   │       ├── services/
│   │       └── types/
│   │
│   ├── components/              # Shared components
│   │   ├── ui/                  # shadcn/ui components
│   │   └── search/              # Reusable search components
│   │
│   ├── lib/                     # Shared utilities
│   │   ├── graphql/
│   │   │   └── client.ts        # GraphQL client setup
│   │   └── utils.ts             # Utility functions (cn, etc.)
│   │
│   ├── provider/                # React context providers
│   │   └── TanstackProvider.tsx # React Query provider
│   │
│   ├── shared/                  # Shared utilities
│   │   └── utils/
│   │
│   └── generated-sdk.ts         # Generated GraphQL types & SDK
│
├── codegen.ts                   # GraphQL Codegen config
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── components.json              # shadcn/ui configuration
├── next.config.mjs              # Next.js configuration
├── Dockerfile                   # Docker build configuration
├── .env.example                 # Environment variables template
└── package.json                 # Dependencies and scripts
```

---

## Architecture Patterns

### Feature-Based Organization

The codebase uses **feature modules** to organize code by domain (user, repository, issue). Each feature follows a consistent structure:

```
features/[feature-name]/
├── action/          # Client-side actions (fetches from /api routes)
├── components/      # UI components specific to this feature
├── graphql/         # .gql files with queries, mutations, fragments
├── hooks/           # React hooks (TanStack Query hooks)
├── services/        # Server-side services (direct GraphQL SDK calls)
├── schemas/         # Validation schemas (if needed)
└── types/           # TypeScript types specific to this feature
```

### Data Flow Pattern

The application follows a clear data flow pattern:

1. **Client Component** → calls custom hook
2. **Custom Hook** (e.g., `useUsersQuery`) → uses TanStack Query
3. **Action Function** (e.g., `fetchUsers`) → fetches from Next.js API route
4. **API Route** (`/api/users/route.ts`) → calls service function
5. **Service Function** (e.g., `searchUsers`) → calls GraphQL SDK
6. **GraphQL SDK** → makes authenticated request to GitHub API

**Example Flow:**

```
UserSearch.tsx
  ↓ uses
useUsersQuery hook
  ↓ calls
fetchUsers action
  ↓ fetch from
/api/users route
  ↓ calls
searchUsers service
  ↓ uses
getGraphqlSdk().searchUsers()
  ↓ requests
GitHub GraphQL API
```

### Server vs Client Responsibilities

**Server-side (services/):**
- Direct GraphQL SDK calls
- Authentication with GitHub API
- Data transformation
- Error handling

**Client-side (actions/):**
- Fetch from Next.js API routes
- Data formatting for UI
- Type coercion
- Client-side error handling

---

## Development Workflows

### Adding a New Feature

When adding a new feature (e.g., "starred repositories"):

1. **Create feature directory structure:**
   ```bash
   mkdir -p src/features/starred/{action,components,graphql,hooks,services}
   ```

2. **Define GraphQL operations** in `graphql/*.gql`:
   ```graphql
   # src/features/starred/graphql/getStarredRepos.gql
   fragment StarredRepoFields on Repository {
     id
     name
     stargazerCount
   }

   query getStarredRepos($login: String!, $after: String) {
     user(login: $login) {
       starredRepositories(first: 20, after: $after) {
         edges {
           node {
             ...StarredRepoFields
           }
         }
         pageInfo {
           endCursor
           hasNextPage
         }
       }
     }
   }
   ```

3. **Run codegen to generate types:**
   ```bash
   yarn codegen
   ```

4. **Create service function** in `services/index.ts`:
   ```typescript
   import { getGraphqlSdk } from "@/lib/graphql/client";

   export const getStarredRepos = async (login: string, after?: string) => {
     try {
       const sdk = getGraphqlSdk();
       const result = await sdk.getStarredRepos({ login, after });
       return result;
     } catch (error) {
       console.error(error);
       return null;
     }
   };
   ```

5. **Create API route** in `src/app/api/starred/route.ts`:
   ```typescript
   import { getStarredRepos } from "@/features/starred/services";
   import { NextRequest, NextResponse } from "next/server";

   export async function GET(request: NextRequest) {
     const login = request.nextUrl.searchParams.get("login");
     const after = request.nextUrl.searchParams.get("after");

     try {
       const result = await getStarredRepos(login as string, after || undefined);
       return NextResponse.json(result);
     } catch (error) {
       return NextResponse.json({ error: (error as Error).message });
     }
   }
   ```

6. **Create action function** in `action/index.ts`:
   ```typescript
   export async function fetchStarredRepos(login: string, after?: string) {
     const params = new URLSearchParams({ login });
     if (after) params.append("after", after);

     const res = await fetch(`/api/starred?${params}`);
     return await res.json();
   }
   ```

7. **Create custom hook** in `hooks/useStarredRepos.ts`:
   ```typescript
   "use client";
   import { useInfiniteQuery } from "@tanstack/react-query";
   import { fetchStarredRepos } from "../action";

   export default function useStarredRepos(login: string) {
     return useInfiniteQuery({
       queryKey: ["starred", login],
       queryFn: ({ pageParam }) => fetchStarredRepos(login, pageParam),
       initialPageParam: undefined,
       getNextPageParam: (lastPage) =>
         lastPage.user?.starredRepositories?.pageInfo.endCursor,
     });
   }
   ```

8. **Create component** in `components/StarredList.tsx`
9. **Add page route** if needed in `src/app/`

### Modifying Existing Features

1. **Update GraphQL query** in `features/[feature]/graphql/*.gql`
2. **Regenerate types**: `yarn codegen`
3. **Update service/action/hook** as needed
4. **Update components** to use new data
5. **Test the changes** thoroughly

### Adding UI Components

For shadcn/ui components:
```bash
npx shadcn@latest add [component-name]
```

This adds components to `src/components/ui/` following the project's configuration.

---

## Key Conventions

### File Naming

- **Components**: PascalCase (e.g., `UserSearch.tsx`, `IssueCreateModal.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useUsersQuery.ts`)
- **Actions/Services**: camelCase (e.g., `index.ts` with named exports)
- **GraphQL files**: camelCase with descriptive names (e.g., `searchUsers.gql`)
- **API routes**: Next.js convention (`route.ts`)

### Import Aliases

The project uses TypeScript path aliases configured in `tsconfig.json`:

```typescript
import { Button } from "@/components/ui/button";
import { fetchUsers } from "@/features/user/action";
import { cn } from "@/lib/utils";
import { UserFields } from "@/generated-sdk";
```

### Component Patterns

**Client Components** must have `"use client"` directive:
```typescript
"use client";
import { useQuery } from "@tanstack/react-query";
// ... component code
```

**Server Components** (default in App Router) don't need the directive:
```typescript
export default async function Page() {
  // Can use async/await directly
  const data = await fetchSomeData();
  return <div>{/* ... */}</div>;
}
```

### Error Handling

**Services (server-side):**
```typescript
export const searchUsers = async (query: string) => {
  try {
    const { result } = await getGraphqlSdk().searchUsers({ query });
    return result;
  } catch (error) {
    console.error(error);
    return null;  // Return null on error
  }
};
```

**API Routes:**
```typescript
export async function GET(request: NextRequest) {
  try {
    const result = await someService();
    return NextResponse.json(result);
  } catch (error) {
    console.log("🔴 Error", error);
    return NextResponse.json({ error: (error as Error).message });
  }
}
```

### TypeScript Guidelines

- Use generated types from `@/generated-sdk` for GraphQL data
- Avoid `@ts-ignore` unless absolutely necessary (document why if used)
- Use proper type inference from TanStack Query
- Define types in feature's `types/` directory when needed

---

## GraphQL & Code Generation

### GraphQL Code Generator Setup

The project uses GraphQL Code Generator to create type-safe SDK from GitHub's GraphQL schema.

**Configuration** (`codegen.ts`):
- **Schema**: `node_modules/@octokit/graphql-schema/schema.graphql`
- **Documents**: `src/features/**/graphql/*.gql`
- **Output**: `src/generated-sdk.ts`

**Plugins:**
- `typescript` - Generate TypeScript types
- `typescript-operations` - Generate types for operations
- `typescript-graphql-request` - Generate SDK for graphql-request

### Running Code Generation

**Manual run:**
```bash
yarn codegen
```

**Automatic run:**
- Runs automatically after `yarn install` (postinstall script)

### GraphQL Client Configuration

Located in `src/lib/graphql/client.ts`:

```typescript
export const getGraphqlSdk = () => {
  const client = new GraphQLClient(
    process.env.GITHUB_GRAPH_API_ENDPOINT as string,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_GRAPH_API_TOKEN}`,
      },
    }
  );
  return getSdk(client);
};
```

**Usage in services:**
```typescript
const sdk = getGraphqlSdk();
const result = await sdk.queryName({ variables });
```

### GraphQL Query Best Practices

1. **Use Fragments** for reusable field sets:
   ```graphql
   fragment UserFields on User {
     id
     login
     avatarUrl
   }
   ```

2. **Name queries descriptively**:
   ```graphql
   query searchUsers($query: String!) { ... }
   query getRepositoryIssues($owner: String!, $name: String!) { ... }
   ```

3. **Include pagination fields** when needed:
   ```graphql
   pageInfo {
     endCursor
     hasNextPage
     startCursor
     hasPreviousPage
   }
   ```

4. **Organize by feature**: Place `.gql` files in `features/[feature]/graphql/`

---

## Styling & UI Components

### Tailwind CSS

The project uses Tailwind CSS with custom configuration:

**Color System**: CSS variables defined in `src/app/globals.css`
- Uses HSL color space
- Supports dark mode (`darkMode: ["class"]`)
- Custom colors: background, foreground, primary, secondary, muted, accent, destructive, border, input, ring

**Usage:**
```tsx
<div className="bg-background text-foreground border border-border">
  <h1 className="text-2xl font-bold text-primary">Title</h1>
</div>
```

### shadcn/ui Components

Located in `src/components/ui/`, these are customizable components built on Radix UI.

**Configuration** (`components.json`):
- Style: "new-york"
- Base color: "zinc"
- CSS variables: enabled
- TypeScript: enabled
- RSC: enabled

**Common components:**
- `Button`, `Input`, `Label`, `Textarea`
- `Card`, `Dialog`, `Avatar`, `Switch`
- `Select`, `Table`, `Pagination`

**Usage:**
```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>
    <Button variant="default" size="lg">Click me</Button>
  </CardContent>
</Card>
```

### Utility Functions

**`cn()` function** (`src/lib/utils.ts`):
Combines `clsx` and `tailwind-merge` for conditional classes:

```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "base-class",
  isActive && "active-class",
  "override-class"
)} />
```

---

## Environment Setup

### Required Environment Variables

Create `.env.local` based on `.env.example`:

```bash
# GitHub GraphQL API
GITHUB_GRAPH_API_ENDPOINT=https://api.github.com/graphql
GITHUB_GRAPH_API_TOKEN=your_github_personal_access_token

# Optional: Base URL for API calls
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Getting GitHub Token

1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Generate new token (classic)
3. Required scopes: `repo`, `read:user`, `read:org`
4. Copy token to `.env.local`

### Development Commands

```bash
# Install dependencies
yarn install

# Run development server
yarn dev  # http://localhost:3000

# Build for production
yarn build

# Run production build
yarn start

# Lint code
yarn lint

# Generate GraphQL types
yarn codegen
```

---

## API Routes

### Route Structure

API routes follow Next.js App Router conventions:

```
src/app/api/
├── users/
│   ├── route.ts                              # GET /api/users
│   └── [username]/
│       └── repository/
│           └── [name]/
│               └── route.ts                  # GET /api/users/:username/repository/:name
├── repositories/
│   └── route.ts                              # GET /api/repositories
└── issues/
    └── route.ts                              # GET /api/issues
```

### Route Pattern

**Standard GET route:**
```typescript
import { someService } from "@/features/[feature]/services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Extract query params
  const param = request.nextUrl.searchParams.get("param");

  try {
    // Call service
    const result = await someService(param as string);

    // Return JSON response
    return NextResponse.json(result);
  } catch (error) {
    console.log("🔴 Error", error);
    return NextResponse.json({
      error: (error as Error).message
    }, { status: 500 });
  }
}
```

**Dynamic route with params:**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string; name: string } }
) {
  const { username, name } = params;
  // ... rest of logic
}
```

---

## State Management

### TanStack Query (React Query)

**Provider setup** (`src/provider/TanstackProvider.tsx`):
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,  // 1 minute default
    },
  },
});
```

**Wrapped in root layout** (`src/app/layout.tsx`)

### Query Patterns

**Simple Query:**
```typescript
"use client";
import { useQuery } from "@tanstack/react-query";

export default function useUsersQuery(keyword: string) {
  return useQuery({
    queryKey: ["users", keyword],
    queryFn: () => fetchUsers(keyword),
    staleTime: 1000,
  });
}
```

**Infinite Query (Cursor Pagination):**
```typescript
"use client";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function useIssueCursorPagination(params) {
  return useInfiniteQuery({
    queryKey: ["issues", params.name, params.owner],
    queryFn: (context) => fetchIssues(context, params),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.result?.issues?.pageInfo.endCursor,
  });
}
```

### Query Keys Convention

Use descriptive, hierarchical query keys:

```typescript
["users", keyword]                    // User search
["repository", owner, name]           // Single repository
["repositories", username]            // User's repositories
["issues", owner, name]               // Repository issues
```

---

## Common Tasks

### Adding a New GraphQL Query

1. Create `.gql` file in `src/features/[feature]/graphql/`:
   ```graphql
   query myNewQuery($param: String!) {
     # query fields
   }
   ```

2. Run codegen:
   ```bash
   yarn codegen
   ```

3. Use generated types:
   ```typescript
   import { MyNewQuery, MyNewQueryVariables } from "@/generated-sdk";
   ```

### Adding a New shadcn/ui Component

```bash
npx shadcn@latest add [component-name]
# e.g., npx shadcn@latest add toast
```

### Creating an Infinite Scroll Component

1. Create hook with `useInfiniteQuery`
2. Use `react-intersection-observer` for scroll detection
3. Call `fetchNextPage()` when observer triggers

**Example pattern** (see `src/features/issue/components/IssuesInfiniteScroll.tsx`):
```typescript
"use client";
import { useInView } from "react-intersection-observer";

export default function InfiniteList({ params }) {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(...);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <div>
      {data?.pages.map(page => (/* render items */))}
      <div ref={ref}>Loading...</div>
    </div>
  );
}
```

### Handling URL Search Params

Next.js App Router provides `searchParams` to server components:

```typescript
// src/app/page.tsx
export default async function Home({
  searchParams: { keyword },
}: {
  searchParams: { keyword?: string };
}) {
  return (
    <div>
      {keyword && <UserSearch keyword={keyword} />}
    </div>
  );
}
```

### Docker Deployment

**Build image:**
```bash
docker build -t github-explorer .
```

**Run container:**
```bash
docker run -p 5000:5000 \
  -e GITHUB_GRAPH_API_ENDPOINT=https://api.github.com/graphql \
  -e GITHUB_GRAPH_API_TOKEN=your_token \
  github-explorer
```

The Dockerfile uses Next.js standalone output for optimized production builds.

---

## Important Notes for AI Assistants

### When Making Changes

1. **Always run codegen** after modifying `.gql` files
2. **Check for breaking changes** in generated types
3. **Follow the feature module pattern** - keep related code together
4. **Use existing patterns** - reference similar features before creating new ones
5. **Maintain type safety** - use generated types, avoid `any`
6. **Test data flow** - verify API route → service → GraphQL SDK chain

### Code Quality Standards

- **No `@ts-ignore`** without documentation
- **Consistent error handling** across layers
- **Proper query key structure** for cache invalidation
- **Descriptive variable names** that match domain concepts
- **Component composition** over prop drilling

### Performance Considerations

- Use **React Server Components** by default
- Mark components `"use client"` only when needed (hooks, interactivity)
- Leverage **TanStack Query caching** with appropriate `staleTime`
- Use **infinite queries** for large lists
- Optimize **GraphQL queries** - request only needed fields

### Git Workflow

- Follow the branch naming convention: `claude/[description]-[session-id]`
- Write clear commit messages describing changes
- Push to the designated feature branch
- Create PRs with detailed summaries and test plans

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [GitHub GraphQL API](https://docs.github.com/en/graphql)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)

---

**Last Updated:** 2025-12-26
**Codebase Version:** Based on latest commit `a59e312`
