export interface Project {
  name: string;
  description: string;
  url: string;
  repo?: string;
  tags: string[];
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
];

export interface Talk {
  title: string;
  event: string;
  date: string;
  description: string;
  youtubeId: string;
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
];
