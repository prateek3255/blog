import Link from 'next/link'
import { type Post } from '@/lib/data'

interface PostCardProps {
  post: Post
  showDescription?: boolean
}

export function PostCard({ post, showDescription = false }: PostCardProps) {
  const href = post.externalUrl ?? `/blog/${post.slug}`
  const isExternal = !!post.externalUrl

  return (
    <article>
      <Link
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="group block py-5 border-b border-border last:border-0"
      >
        <h2 className="font-serif text-[1.125rem] leading-snug font-medium text-foreground group-hover:opacity-70 transition-opacity text-balance">
          {post.title}
        </h2>

        {showDescription && post.description && (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {post.description}
          </p>
        )}

        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{post.date}</span>
          {post.views && (
            <>
              <span aria-hidden="true">·</span>
              <span>{post.views} views</span>
            </>
          )}
          {isExternal && (
            <>
              <span aria-hidden="true">·</span>
              <span className="opacity-60">{new URL(post.externalUrl!).hostname}</span>
            </>
          )}
          {post.archived && (
            <>
              <span aria-hidden="true">·</span>
              <span className="opacity-60">Archived</span>
            </>
          )}
        </div>
      </Link>
    </article>
  )
}
