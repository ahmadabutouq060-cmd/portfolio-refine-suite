import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { FigmaButton, GitHubButton, LiveDemoButton } from "@/components/portfolio/GitHubButton";
import { TechBadgeList } from "@/components/portfolio/TechBadge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/data/projects";

export function ProjectCard({
  project,
  onOpenDetails,
}: {
  project: Project;
  onOpenDetails: (project: Project) => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(project.image) && !imageFailed;

  return (
    <article className="project-card">
      <div className="project-media">
        {showImage ? (
          <img
            src={project.image}
            alt={project.imageAlt ?? `${project.name} screenshot`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="project-media-fallback" aria-hidden="true">
            <span>{project.number}</span>
            <strong>{project.name}</strong>
          </div>
        )}
      </div>
      <div className="project-card-body">
        <div className="project-card-top">
          <span className="project-card-number">{project.number}</span>
          <p className="eyebrow">{project.category}</p>
          <span className="project-card-status">{project.status}</span>
        </div>
        <h3>{project.name}</h3>
        <p className="project-card-description">{project.description}</p>
        <TechBadgeList items={project.technologies} />
        <div className="project-card-actions">
          {project.figmaUrl ? (
            <FigmaButton url={project.figmaUrl} projectName={project.name} />
          ) : project.githubUrl ? (
            <GitHubButton url={project.githubUrl} projectName={project.name} />
          ) : null}
          {project.liveUrl ? <LiveDemoButton url={project.liveUrl} projectName={project.name} /> : null}
          <Button variant="ghost" onClick={() => onOpenDetails(project)}>
            Project Details
            <ArrowUpRight aria-hidden="true" size={15} />
          </Button>
        </div>
      </div>
    </article>
  );
}
