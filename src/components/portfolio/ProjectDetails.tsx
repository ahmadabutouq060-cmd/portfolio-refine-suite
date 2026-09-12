import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import { FigmaButton, GitHubButton, LiveDemoButton } from "@/components/portfolio/GitHubButton";
import { TechBadgeList } from "@/components/portfolio/TechBadge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/data/projects";

export function ProjectDetails({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !project) return;
    dialog.showModal();
    return () => dialog.close();
  }, [project]);

  if (!project) return null;

  return (
    <dialog
      ref={dialogRef}
      className="project-dialog"
      aria-labelledby="project-dialog-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <article className="dialog-panel">
        <div className="dialog-topline">
          <span>
            {project.number} / {project.category}
          </span>
          <Button variant="icon" onClick={onClose} aria-label="Close project details" autoFocus>
            <X aria-hidden="true" size={19} />
          </Button>
        </div>

        <p className="eyebrow">{project.status}</p>
        <h2 id="project-dialog-title">{project.name}</h2>

        {project.image ? (
          <figure className="featured-shot">
            <img src={project.image} alt={project.imageAlt ?? `${project.name} screenshot`} loading="lazy" />
          </figure>
        ) : null}

        <section className="dialog-section">
          <h3>Overview</h3>
          <p className="dialog-description">{project.description}</p>
          {project.solution ? <p className="dialog-description">{project.solution}</p> : null}
        </section>

        {project.features && project.features.length > 0 ? (
          <section className="dialog-section">
            <h3>Main features</h3>
            <ul className="dialog-list">
              {project.features.slice(0, 5).map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="dialog-section">
          <h3>Tech stack</h3>
          <TechBadgeList items={project.technologies} />
        </section>

        <div className="project-card-actions dialog-actions">
          {project.figmaUrl ? (
            <FigmaButton url={project.figmaUrl} projectName={project.name} />
          ) : project.githubUrl ? (
            <GitHubButton url={project.githubUrl} projectName={project.name} />
          ) : null}
          {project.liveUrl ? <LiveDemoButton url={project.liveUrl} projectName={project.name} /> : null}
        </div>
      </article>
    </dialog>
  );
}
