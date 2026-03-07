---
title: 'Type-safe API design with TypeScript'
description: 'End-to-end type safety is one of the most underrated improvements you can make to a TypeScript codebase. Here is a practical approach.'
date: '8th Nov 2024'
views: '5,112'
featured: true
---

End-to-end type safety sounds like a luxury. In practice, once you have it, going back feels like developing without a safety net. Types that flow from your database schema all the way to your frontend component mean that a schema change surfaces as a compile error rather than a runtime surprise in production.

## The type boundary problem

Most TypeScript codebases are type-safe within each layer but have untyped boundaries between them. The API call returns `any`. The database query returns `unknown`. The environment variable is a `string | undefined` that gets cast somewhere it shouldn't.

These boundaries are where bugs live.

```ts
// The boundary problem
async function getUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  return res.json(); // returns Promise<any> — type safety stops here
}

// The typed boundary
async function getUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  const data = await res.json();
  return UserSchema.parse(data); // Zod validates + narrows the type
}
```

## Schema as the single source of truth

The cleanest approach I have found is to define your data shapes once as Zod schemas and derive everything else from them. Types for your application code, validators for your API routes, and serializers for your client — all from one definition.

```ts
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  createdAt: z.coerce.date(),
});

// Derive the TypeScript type — no duplication
export type User = z.infer<typeof UserSchema>;
```

## tRPC for the full stack

If you control both the client and server, tRPC eliminates the API boundary entirely. Your frontend calls server functions directly, with full type inference, zero codegen, and no schema duplication. It is the closest thing to end-to-end type safety I have found in practice.

The tradeoff is coupling — your client and server must share a monorepo or package. For most teams building a single product, that is a perfectly reasonable tradeoff for the safety and productivity gains.
