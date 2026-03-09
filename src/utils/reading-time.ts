import getReadingTime from 'reading-time';

/**
 * Compute reading time (minutes, rounded up) from raw MDX/Markdown body text.
 * Pass entry.body from a content collection entry.
 */
export function getReadTime(body: string | undefined): number {
  if (!body) return 1;
  const { minutes } = getReadingTime(body);
  return Math.max(1, Math.ceil(minutes));
}
