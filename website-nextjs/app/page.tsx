import Link from 'next/link'
import { Nav } from '@/components/nav'
import { PostCard } from '@/components/post-card'
import { ProjectCard } from '@/components/project-card'
import { NewsletterForm } from '@/components/newsletter-form'
import { Footer } from '@/components/footer'
import { featuredPosts, projects } from '@/lib/data'

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 pb-24">
        {/* Hero */}
        <section className="pt-16 pb-14 border-b border-border">
          <h1 className="font-serif text-3xl font-semibold leading-tight text-balance">
            Hey, I&apos;m Alex Rivera
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed text-[0.9375rem]">
            It&apos;s nice to meet you. I&apos;m a product-minded web engineer, currently building
            developer tooling at{' '}
            <a
              href="https://github.com"
              className="text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity"
              target="_blank"
              rel="noopener noreferrer"
            >
              Acme Corp
            </a>
            . I write about web development, DX, and design systems.
          </p>
        </section>

        {/* Featured posts */}
        <section className="pt-10 pb-14 border-b border-border">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">Writing</p>
          <div className="divide-y divide-border">
            {featuredPosts.map((post) => (
              <PostCard key={post.slug} post={post} showDescription />
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
            >
              All articles
              <span aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </Link>
          </div>
        </section>

        {/* Projects */}
        <section className="pt-10 pb-14 border-b border-border">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">Projects</p>
          <div className="flex flex-col gap-4">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/projects"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
            >
              All projects
              <span aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </Link>
          </div>
        </section>

        {/* Newsletter */}
        <section className="pt-10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">Newsletter</p>
          <NewsletterForm />
        </section>
      </main>

      <Footer />
    </>
  )
}
