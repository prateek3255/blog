export interface Post {
  slug: string
  title: string
  description: string
  date: string
  views: string
  featured?: boolean
  archived?: boolean
  externalUrl?: string
}

export const posts: Post[] = [
  {
    slug: 'building-for-developers',
    title: 'Building software that developers actually love',
    description:
      'Developer experience is the sum of all interactions a developer has with your product. Here is how I think about building great DX from the ground up.',
    date: '12th Feb 2025',
    views: '9,241',
    featured: true,
  },
  {
    slug: 'type-safe-api-design',
    title: 'Type-safe API design with TypeScript',
    description:
      'End-to-end type safety is one of the most underrated improvements you can make to a TypeScript codebase. Here is a practical approach.',
    date: '8th Nov 2024',
    views: '5,112',
    featured: true,
  },
  {
    slug: 'react-server-components',
    title: 'React Server Components in production',
    description:
      'After shipping RSC in several large projects, I have collected some patterns and pitfalls worth sharing.',
    date: '3rd Jul 2024',
    views: '14,830',
    featured: true,
  },
  {
    slug: 'css-animations-2024',
    title: 'Modern CSS animations',
    description:
      'The new @starting-style rule, view transitions, and scroll-driven animations change what is possible in pure CSS.',
    date: '18th Apr 2024',
    views: '7,655',
  },
  {
    slug: 'zod-validation-patterns',
    title: 'Zod patterns I use every day',
    description:
      'Zod is more powerful than most people realise. These are the patterns I reach for repeatedly in production apps.',
    date: '29th Jan 2024',
    views: '3,980',
  },
  {
    slug: 'nextjs-app-router',
    title: 'Migrating to the Next.js App Router',
    description:
      'A practical migration guide based on moving three production apps from Pages to App Router.',
    date: '14th Oct 2023',
    views: '22,450',
  },
  {
    slug: 'design-tokens',
    title: 'Design tokens at scale',
    description:
      'How to structure a token system that scales across multiple products and themes without turning into spaghetti.',
    date: '2nd Aug 2023',
    views: '4,300',
    archived: true,
  },
  {
    slug: 'turbopack-first-look',
    title: 'First look at Turbopack',
    description:
      'My impressions after migrating a mid-size monorepo to Turbopack and what it means for the build tooling landscape.',
    date: '5th Jun 2023',
    views: '6,100',
    archived: true,
  },
  {
    slug: 'headless-ui-patterns',
    title: 'Headless UI patterns in React',
    description:
      'Render props, compound components, and the new hook model — a tour of headless UI patterns and when to reach for each.',
    date: '11th Mar 2023',
    views: '8,750',
    archived: true,
  },
  {
    slug: 'realtime-with-websockets',
    title: 'Real-time features with WebSockets',
    description:
      'A deep dive into building robust real-time features: presence, live cursors, collaborative editing.',
    date: '22nd Jan 2023',
    views: '11,200',
    archived: true,
  },
]

export const featuredPosts = posts.filter((p) => p.featured)
export const allPosts = posts

export interface Project {
  name: string
  description: string
  url: string
  repo?: string
  tags: string[]
}

export const projects: Project[] = [
  {
    name: 'Velox UI',
    description:
      'An unstyled, accessible component library for React. Zero dependencies, fully typed, and built for customisation.',
    url: 'https://github.com',
    repo: 'https://github.com',
    tags: ['React', 'TypeScript', 'Open Source'],
  },
  {
    name: 'Schema Forge',
    description:
      'A visual schema editor that generates Zod, TypeScript, and JSON Schema from a single source of truth.',
    url: 'https://github.com',
    repo: 'https://github.com',
    tags: ['TypeScript', 'Zod', 'CLI'],
  },
  {
    name: 'Heatmap.fyi',
    description:
      'Dead-simple heatmaps for any website. Drop in one script tag, see where users actually click.',
    url: 'https://github.com',
    tags: ['SaaS', 'Analytics', 'Next.js'],
  },
  {
    name: 'Logpipe',
    description:
      'Structured log shipping from any Node.js or Edge runtime to your preferred sink — zero config, tiny footprint.',
    url: 'https://github.com',
    repo: 'https://github.com',
    tags: ['Node.js', 'Edge', 'Open Source'],
  },
]

export interface Talk {
  title: string
  event: string
  date: string
  description: string
  youtubeId: string
}

export const talks: Talk[] = [
  {
    title: 'Building at the Edge: Real-time Everything',
    event: 'Next.js Conf 2024',
    date: 'Nov 2024',
    description:
      'How edge runtimes and streaming change the architecture of real-time collaborative applications.',
    youtubeId: 'dQw4w9WgXcQ',
  },
  {
    title: 'DX is a Product Discipline',
    event: 'React Summit 2024',
    date: 'Jun 2024',
    description:
      'A talk on treating developer experience with the same rigor as user experience — metrics, feedback loops, and iteration.',
    youtubeId: 'dQw4w9WgXcQ',
  },
  {
    title: 'Type-safe APIs from End to End',
    event: 'TypeScript Congress 2023',
    date: 'Sep 2023',
    description:
      'Live-coding a full-stack app where TypeScript types flow from the database all the way to the frontend component.',
    youtubeId: 'dQw4w9WgXcQ',
  },
  {
    title: 'The Future of CSS Architecture',
    event: 'CSSDay 2023',
    date: 'Jun 2023',
    description:
      'Design tokens, cascade layers, and container queries — the building blocks of a scalable CSS architecture.',
    youtubeId: 'dQw4w9WgXcQ',
  },
]
