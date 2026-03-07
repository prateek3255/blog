import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { talks } from '@/lib/data'

export const metadata = {
  title: 'Talks — Alex Rivera',
  description: 'Conference talks, presentations, and videos.',
}

export default function TalksPage() {
  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 pb-24">
        <section className="pt-16 pb-10 border-b border-border">
          <h1 className="font-serif text-3xl font-semibold">Talks</h1>
          <p className="mt-3 text-muted-foreground text-[0.9375rem] leading-relaxed">
            Conference talks and presentations I have given.
          </p>
        </section>

        <section className="pt-8">
          <div className="flex flex-col gap-12">
            {talks.map((talk) => (
              <article key={talk.title}>
                {/* YouTube thumbnail */}
                <a
                  href={`https://www.youtube.com/watch?v=${talk.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                  aria-label={`Watch ${talk.title} on YouTube`}
                >
                  <div className="relative w-full aspect-video bg-muted overflow-hidden border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://img.youtube.com/vi/${talk.youtubeId}/maxresdefault.jpg`}
                      alt={`Thumbnail for ${talk.title}`}
                      className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-background/90 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6 text-foreground ml-0.5"
                          aria-hidden="true"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>

                {/* Metadata */}
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span>{talk.event}</span>
                    <span aria-hidden="true">·</span>
                    <span>{talk.date}</span>
                  </div>
                  <h2 className="font-serif text-[1.125rem] leading-snug font-medium text-foreground text-balance">
                    {talk.title}
                  </h2>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {talk.description}
                  </p>
                  <a
                    href={`https://www.youtube.com/watch?v=${talk.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    Watch on YouTube
                    <span
                      aria-hidden="true"
                      className="group-hover:translate-x-0.5 transition-transform"
                    >
                      ↗
                    </span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
