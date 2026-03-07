import { Nav } from '@/components/nav'
import { ProjectCard } from '@/components/project-card'
import { Footer } from '@/components/footer'
import { projects } from '@/lib/data'

export const metadata = {
  title: 'Projects — Alex Rivera',
  description: 'Open source tools and side projects I have built.',
}

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 pb-24">
        <section className="pt-16 pb-10 border-b border-border">
          <h1 className="font-serif text-3xl font-semibold">Projects</h1>
          <p className="mt-3 text-muted-foreground text-[0.9375rem] leading-relaxed">
            Open source tools, side projects, and experiments.
          </p>
        </section>

        <section className="pt-2">
          <div className="divide-y divide-border">
            {projects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
