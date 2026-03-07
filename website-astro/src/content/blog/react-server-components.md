---
title: 'React Server Components in production'
description: 'After shipping RSC in several large projects, I have collected some patterns and pitfalls worth sharing.'
date: '3rd Jul 2024'
views: '14,830'
featured: true
archived: true
---

React Server Components represent the most significant shift in how we write React since hooks. After shipping RSC in production across several projects over the past year, I have a clearer picture of where they shine and where they introduce friction.

## The mental model that actually works

Stop thinking of RSC as a performance optimisation and start thinking of it as a data-fetching primitive. The key insight is that server components run on the server and can directly access databases, file systems, and internal services — with zero client bundle impact.

```tsx
// This component never ships to the client
// It can talk directly to your database
async function UserProfile({ id }: { id: string }) {
  const user = await db.users.findUnique({ where: { id } });
  if (!user) notFound();

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

## The boundary is the hard part

The `'use client'` boundary is not just a performance concern — it is an architectural decision. Once you cross it, you are back in client-land: hooks, event handlers, browser APIs. Everything above the boundary in the component tree is server-only.

Getting this boundary wrong is the most common mistake I see teams make. The instinct is to put `'use client'` at the top of any interactive component, which ends up pulling large subtrees into the client bundle unnecessarily.

The correct mental model: push the boundary as deep as possible. Extract only the interactive piece into a client component and keep the surrounding structure as server components.

## Caching is the footgun

RSC caching in Next.js App Router has changed significantly across minor versions. The default behaviour has flip-flopped, the APIs have been renamed, and the mental model is genuinely complex. My current rule of thumb: be explicit about caching intent everywhere. Do not rely on defaults.

This will settle as the ecosystem matures, but for now, treat every caching decision as something that deserves a comment explaining why.
