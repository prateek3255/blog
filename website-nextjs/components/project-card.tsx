import { type Project } from '@/lib/data'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="py-5 border-b border-border last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-serif text-[1.0625rem] font-medium text-foreground leading-snug">
              {project.name}
            </h2>
            <div className="flex items-center gap-1.5 flex-wrap">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[0.6875rem] uppercase tracking-wide text-muted-foreground border border-border rounded-sm px-1.5 py-0.5 leading-none"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
            {project.description}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground pt-0.5">
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              aria-label={`${project.name} source code on GitHub`}
            >
              Source
            </a>
          )}
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
            aria-label={`${project.name} live site`}
          >
            Visit ↗
          </a>
        </div>
      </div>
    </article>
  )
}
