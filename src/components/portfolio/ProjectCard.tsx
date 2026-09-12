import { useState } from "react";
import { ArrowRight } from "lucide-react";

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
      <div className="project-thumb">
        {showImage ? (
          <img
            src={project.image}
            alt={project.imageAlt ?? `${project.name} screenshot`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="project-thumb-fallback" aria-hidden="true">
            <span>{project.number}</span>
          </div>
        )}
      </div>
      <div className="project-card-body">
        <div className="project-card-top">
          <span className="project-card-number">{project.number}</span>
          <p className="eyebrow">{project.category}</p>
        </div>
        <h3>{project.name}</h3>
        <button
          type="button"
          className="project-card-link"
          onClick={() => onOpenDetails(project)}
          aria-label={`View details for ${project.name}`}
        >
          View Details
          <ArrowRight aria-hidden="true" size={14} />
        </button>
      </div>
    </article>
  );
}
