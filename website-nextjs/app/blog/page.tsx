import { Nav } from '@/components/nav'
import { PostCard } from '@/components/post-card'
import { Footer } from '@/components/footer'
import { allPosts } from '@/lib/data'

export const metadata = {
  title: 'Blog — Alex Rivera',
  description: 'Articles on web development, developer experience, and design systems.',
}

export default function BlogPage() {
  const active = allPosts.filter((p) => !p.archived)
  const archived = allPosts.filter((p) => p.archived)

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 pb-24">
        <section className="pt-16 pb-10 border-b border-border">
          <h1 className="font-serif text-3xl font-semibold">Blog posts</h1>
          <p className="mt-3 text-muted-foreground text-[0.9375rem] leading-relaxed">
            Posts on developer experience and web development
          </p>
        </section>

        {/* Active posts */}
        <section className="pt-2">
          <div className="divide-y divide-border">
            {active.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        {/* Archived posts */}
        {archived.length > 0 && (
          <section className="mt-12">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Archived
            </p>
            <div className="divide-y divide-border">
              {archived.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}
