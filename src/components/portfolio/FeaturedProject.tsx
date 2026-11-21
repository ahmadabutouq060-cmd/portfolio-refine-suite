import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechBadgeList } from "./TechBadge";
import type { Project } from "@/data/projects";

export function FeaturedProject({project, onOpenDetails}: {project:Project; onOpenDetails:(p:Project)=>void}) {
  return <article className="featured-project">
    <div className="featured-info"><p className="eyebrow">{project.number} / Featured project</p><h3>{project.name}</h3><p className="featured-category">{project.category}</p><p>{project.description}</p><TechBadgeList items={project.technologies} />
      <div className="project-card-actions"><Button onClick={() => onOpenDetails(project)} aria-label={`View details for ${project.name}`}>Explore case study <ArrowUpRight size={17} aria-hidden="true" /></Button>{project.liveUrl && <Button variant="outline" asChild><a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live demo <ArrowUpRight size={15} aria-hidden="true" /></a></Button>}</div>
      {project.id === "riaya" && <p className="featured-philosophy">AI assists, doctors decide.</p>}
    </div>
    {project.image ? <figure className="featured-shot"><img src={project.image} alt={project.imageAlt ?? `${project.name} screenshot`} loading="lazy" /><figcaption>{project.name} / {project.status}</figcaption></figure> : <div className="featured-no-image"><span>{project.number}</span><strong>{project.name}</strong></div>}
  </article>;
}