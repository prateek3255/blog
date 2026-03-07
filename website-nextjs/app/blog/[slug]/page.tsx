import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { allPosts } from '@/lib/data'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = allPosts.find((p) => p.slug === slug)
  if (!post) return {}
  return {
    title: `${post.title} — Alex Rivera`,
    description: post.description,
  }
}

// Placeholder body text for demo purposes
const PLACEHOLDER_BODY = `
This is a placeholder article body. In a real portfolio you would pull content from MDX files,
a CMS, or a database. The layout, typography, and navigation are fully functional.

## Getting started

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

\`\`\`ts
// Example code block
export function greet(name: string): string {
  return \`Hello, \${name}!\`
}
\`\`\`

## Going further

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
dicta sunt explicabo.
`

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = allPosts.find((p) => p.slug === slug)

  if (!post) notFound()

  const paragraphs = PLACEHOLDER_BODY.trim().split('\n\n')

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 pb-24">
        {/* Back link */}
        <div className="pt-10 pb-8">
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
          >
            <span
              aria-hidden="true"
              className="group-hover:-translate-x-0.5 transition-transform"
            >
              ←
            </span>
            All posts
          </Link>
        </div>

        {/* Header */}
        <header className="pb-10 border-b border-border">
          <h1 className="font-serif text-[2rem] leading-tight font-semibold text-balance">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-4 text-muted-foreground leading-relaxed text-[0.9375rem]">
              {post.description}
            </p>
          )}
          <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <time>{post.date}</time>
            {post.views && (
              <>
                <span aria-hidden="true">·</span>
                <span>{post.views} views</span>
              </>
            )}
            {post.archived && (
              <>
                <span aria-hidden="true">·</span>
                <span>Archived</span>
              </>
            )}
          </div>
        </header>

        {/* Body */}
        <article className="mt-10 prose-custom">
          {paragraphs.map((block, i) => {
            if (block.startsWith('## ')) {
              return (
                <h2
                  key={i}
                  className="font-serif text-xl font-semibold mt-10 mb-4 text-foreground"
                >
                  {block.replace('## ', '')}
                </h2>
              )
            }
            if (block.startsWith('```')) {
              const lines = block.split('\n')
              const lang = lines[0].replace('```', '')
              const code = lines.slice(1, -1).join('\n')
              return (
                <pre
                  key={i}
                  className="bg-muted rounded-lg p-4 overflow-x-auto text-xs leading-relaxed my-6"
                >
                  <code>{code}</code>
                </pre>
              )
            }
            return (
              <p
                key={i}
                className="text-[0.9375rem] leading-relaxed text-foreground/90 mb-5"
              >
                {block}
              </p>
            )
          })}
        </article>
      </main>

      <Footer />
    </>
  )
}
