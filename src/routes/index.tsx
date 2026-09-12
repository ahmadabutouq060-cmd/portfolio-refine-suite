import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "@/components/portfolio/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ahmad Abu Touq — Software Engineering Student" },
      { name: "description", content: "Portfolio of Ahmad Abu Touq, a Software Engineering student in Amman building thoughtful mobile and software projects." },
      { property: "og:title", content: "Ahmad Abu Touq — Software Engineering Student" },
      { property: "og:description", content: "A growing portfolio of software, mobile development, and engineering projects." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Portfolio,
});
