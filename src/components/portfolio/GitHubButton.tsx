import { ArrowUpRight, Figma, Github } from "lucide-react";

import { Button } from "@/components/ui/button";

export function GitHubButton({
  url,
  label = "View on GitHub",
  projectName,
}: {
  url: string;
  label?: string;
  projectName: string;
}) {
  return (
    <Button asChild variant="outline">
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${label} — ${projectName} (opens in a new tab)`}
      >
        <Github aria-hidden="true" size={15} />
        {label}
      </a>
    </Button>
  );
}

export function FigmaButton({ url, projectName }: { url: string; projectName: string }) {
  return (
    <Button asChild variant="outline">
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`View on Figma — ${projectName} (opens in a new tab)`}
      >
        <Figma aria-hidden="true" size={15} />
        View on Figma
      </a>
    </Button>
  );
}

export function LiveDemoButton({ url, projectName }: { url: string; projectName: string }) {
  return (
    <Button asChild>
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Live demo of ${projectName} (opens in a new tab)`}
      >
        Live demo
        <ArrowUpRight aria-hidden="true" size={15} />
      </a>
    </Button>
  );
}
