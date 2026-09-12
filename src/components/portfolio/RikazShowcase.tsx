import { ArrowUpRight, Figma } from "lucide-react";

import rikazOnboarding from "@/assets/rikaz-onboarding.png.asset.json";
import { Button } from "@/components/ui/button";
import type { Project } from "@/data/projects";

export function RikazShowcase({ project }: { project: Project }) {
  return (
    <article className="rikaz-showcase" data-reveal>
      <a
        href={project.figmaUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="rikaz-visual"
        aria-label={`View ${project.name} on Figma`}
      >
        <div className="rikaz-frame">
          <img
            src={rikazOnboarding.url}
            alt="Rikaz onboarding screen showing the brand mascot and Arabic welcome message"
            loading="lazy"
          />
        </div>
      </a>
      <div className="rikaz-meta">
        <div className="rikaz-labels">
          <span className="rikaz-number">{project.number}</span>
          <span className="rikaz-category">{project.category}</span>
        </div>
        <h3 className="rikaz-title">Rikaz — ركاز</h3>
        <div className="rikaz-footer">
          <span className="rikaz-tech">
            <Figma aria-hidden="true" size={14} />
            Figma
          </span>
          <Button asChild variant="outline" className="rikaz-cta">
            <a
              href={project.figmaUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`View ${project.name} on Figma`}
            >
              View Project
              <ArrowUpRight aria-hidden="true" size={15} />
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
