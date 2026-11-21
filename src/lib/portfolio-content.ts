import { z } from "zod";
import type { Project } from "@/data/projects";
import type { Database } from "@/integrations/supabase/types";

const link = z.string().trim().max(2048).refine((value) => !value || /^https:\/\//i.test(value), "Use a full https:// address.");
export const siteContentSchema = z.object({
  name: z.string().trim().min(1).max(100), title: z.string().trim().min(1).max(150),
  heroText: z.string().trim().max(500), about: z.string().trim().max(3000),
  university: z.string().trim().max(200), graduation: z.string().trim().max(100),
  email: z.union([z.literal(""), z.string().email()]), github: link, linkedin: link,
  focus: z.array(z.string().trim().min(1).max(150)).max(10),
});
export type SiteContent = z.infer<typeof siteContentSchema>;
export const projectInputSchema = z.object({
  id: z.string().min(1).max(100), name: z.string().trim().min(1).max(150),
  category: z.string().trim().min(1).max(150), filter_group: z.enum(["Web", "Mobile", "Desktop", "Design"]),
  description: z.string().trim().max(5000), technologies: z.array(z.string().trim().min(1).max(100)).max(30),
  github_url: link, figma_url: link, live_url: link,
  image_url: z.string().max(2048).refine((v) => !v || /^https:\/\//.test(v) || v.startsWith("/__l5e/assets-v1/"), "Choose an uploaded image or an https:// image URL."),
  image_alt: z.string().max(300), featured: z.boolean(), published: z.boolean(), sort_order: z.number().int().min(0),
  status: z.string().trim().max(150), problem: z.string().max(5000), solution: z.string().max(5000),
  features: z.array(z.string().trim().min(1).max(1000)).max(40), role_text: z.string().max(3000),
  contributions: z.string().max(5000), outcomes: z.string().max(5000),
});
export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type MediaRow = Database["public"]["Tables"]["media_library"]["Row"] & { url: string };
export function toProject(row: ProjectRow, number: number, media: MediaRow[] = []): Project {
  const items = media.filter((item) => item.project_id === row.id);
  const cover = items.find((item) => item.kind === "cover");
  return {
    id: row.id, number: String(number + 1).padStart(2, "0"), name: row.name, category: row.category,
    description: row.description, technologies: row.technologies, status: row.status,
    githubUrl: row.github_url, figmaUrl: row.figma_url, liveUrl: row.live_url,
    image: cover?.url || row.image_url, imageAlt: cover?.caption || row.image_alt || `${row.name} project screenshot`,
    featured: row.featured, published: row.published, filterGroup: row.filter_group,
    problem: row.problem, solution: row.solution, features: row.features,
    role: row.role_text, contributions: row.contributions, outcomes: row.outcomes,
    gallery: items.filter((item) => item.kind === "gallery").map((item) => ({ url: item.url, caption: item.caption })),
    documents: items.filter((item) => item.kind === "document").map((item) => ({ url: item.url, name: item.name })),
  };
}
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email.").max(254),
  subject: z.string().trim().min(3, "Please enter a subject.").max(150),
  message: z.string().trim().min(10, "Please write at least 10 characters.").max(5000),
  website: z.string().max(200).default(""),
});
export const IMAGE_LIMIT = 10 * 1024 * 1024;
export const DOCUMENT_LIMIT = 20 * 1024 * 1024;
export const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;
export function validateUpload(file: { type: string; size: number }): string | null {
  if (!allowedMimeTypes.some((type) => type === file.type)) return "Choose a JPG, PNG, WebP image or PDF document.";
  if (file.size <= 0) return "The file is empty.";
  if (file.size > (file.type === "application/pdf" ? DOCUMENT_LIMIT : IMAGE_LIMIT)) return "Images must be under 10 MB and PDFs under 20 MB.";
  return null;
}
export function canReadMedia(published: boolean, projectPublished: boolean | null): boolean {
  return published && projectPublished !== false;
}