/**
 * Maps slug-style tag keys (as used in blog frontmatter) to human-readable display names.
 * Matches the old tagsCase.yaml from the Eleventy site.
 */
export const TAG_DISPLAY_NAMES: Record<string, string> = {
  react: 'React',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  'next-js': 'Next.js',
  'remix-run': 'Remix',
  'react-query': 'React Query',
  go: 'Go',
  tutorial: 'Tutorial',
  'best-practices': 'Best Practices',
  webpack: 'Webpack',
  storybook: 'Storybook',
  eslint: 'ESLint',
  'vs-code': 'VS Code',
  productivity: 'Productivity',
  http: 'HTTP'
};

/**
 * Returns the display name for a given tag slug.
 * Falls back to capitalising the first letter if the tag is unknown.
 */
export function getTagDisplayName(slug: string): string {
  return (
    TAG_DISPLAY_NAMES[slug] ??
    slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
}
