import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { contactSchema, projectInputSchema, siteContentSchema, toProject, validateUpload, type MediaRow } from "./portfolio-content";

function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Portfolio storage is unavailable.");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
      headers.set("apikey", key);
      return fetch(input, { ...init, headers });
    } },
  });
}
type Client = ReturnType<typeof publicClient>;
async function requireOwner(client: Client, userId: string) {
  const { data, error } = await client.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || !data) throw new Error("This account is not authorized to edit the portfolio.");
}
async function withMediaUrls(client: Client): Promise<MediaRow[]> {
  const { data, error } = await client.from("media_library").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return Promise.all((data ?? []).map(async (item) => {
    const { data: signed, error: signingError } = await client.storage.from("portfolio-media").createSignedUrl(item.path, 3600);
    if (signingError || !signed) throw new Error("An uploaded file could not be loaded.");
    const url = new URL(signed.signedUrl);
    const browserBase = import.meta.env.VITE_SUPABASE_URL;
    return { ...item, url: browserBase ? `${browserBase}${url.pathname}${url.search}` : signed.signedUrl };
  }));
}
export const getPublicPortfolio = createServerFn({ method: "GET" }).handler(async () => {
  const client = publicClient();
  const [projects, settings, skills, media] = await Promise.all([
    client.from("projects").select("*").eq("published", true).order("sort_order"),
    client.from("site_settings").select("content").eq("id", 1).single(),
    client.from("skills").select("*").order("sort_order"), withMediaUrls(client),
  ]);
  if (projects.error || settings.error || skills.error) throw new Error("The portfolio could not be loaded.");
  return { projects: (projects.data ?? []).map((row, i) => toProject(row, i, media)),
    settings: siteContentSchema.parse(settings.data?.content), skills: skills.data ?? [], media };
});
export const getOwnerStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (error) throw new Error("Could not verify owner access.");
  return Boolean(data);
});
export const getAdminPortfolio = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  await requireOwner(context.supabase, context.userId);
  const [projects, settings, skills, media, messages, activity] = await Promise.all([
    context.supabase.from("projects").select("*").order("sort_order"),
    context.supabase.from("site_settings").select("content").eq("id", 1).single(),
    context.supabase.from("skills").select("*").order("sort_order"), withMediaUrls(context.supabase),
    context.supabase.from("contact_messages").select("id,name,email,subject,message,is_read,created_at").order("created_at", { ascending: false }).limit(100),
    context.supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(15),
  ]);
  for (const result of [projects, settings, skills, messages, activity]) if (result.error) throw new Error(result.error.message);
  return { projects: projects.data ?? [], settings: siteContentSchema.parse(settings.data?.content), skills: skills.data ?? [], media,
    messages: messages.data ?? [], activity: activity.data ?? [] };
});
export const saveProject = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => projectInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    await requireOwner(context.supabase, context.userId);
    const { error } = await context.supabase.from("projects").upsert(data);
    if (error) throw new Error(error.message);
    return { id: data.id };
  });
export const deleteProject = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireOwner(context.supabase, context.userId);
    const { data: media, error: readError } = await context.supabase.from("media_library").select("path").eq("project_id", data.id);
    if (readError) throw new Error(readError.message);
    if (media?.length) {
      const { error } = await context.supabase.storage.from("portfolio-media").remove(media.map((item) => item.path));
      if (error) throw new Error(error.message);
    }
    const { error } = await context.supabase.from("projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });
export const reorderProjects = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ ids: z.array(z.string()).max(100) }).parse(input))
  .handler(async ({ data, context }) => {
    await requireOwner(context.supabase, context.userId);
    const { error } = await context.supabase.rpc("reorder_projects", { _ids: data.ids });
    if (error) throw new Error(error.message);
    return true;
  });
export const saveSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => siteContentSchema.parse(input))
  .handler(async ({ data, context }) => {
    await requireOwner(context.supabase, context.userId);
    const { error } = await context.supabase.from("site_settings").upsert({ id: 1, content: data, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return true;
  });
export const saveSkill = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid(), name: z.string().trim().min(1).max(100), group_name: z.string().trim().min(1).max(100), sort_order: z.number().int().min(0) }).parse(input))
  .handler(async ({ data, context }) => {
    await requireOwner(context.supabase, context.userId);
    const { error } = await context.supabase.from("skills").upsert(data);
    if (error) throw new Error(error.message);
    return true;
  });
export const deleteSkill = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireOwner(context.supabase, context.userId);
    const { error } = await context.supabase.from("skills").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return true;
  });
const mediaInput = z.object({ id: z.string().uuid(), project_id: z.string().nullable(), path: z.string().regex(/^uploads\/[a-z0-9-]+\/[a-z0-9-]+\.(jpg|png|webp|pdf)$/), name: z.string().min(1).max(200), mime_type: z.string(), size_bytes: z.number().int().positive(), kind: z.enum(["cover","gallery","document","certificate","portrait"]), is_public: z.boolean(), caption: z.string().max(500), sort_order: z.number().int().min(0) });
export const saveMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => mediaInput.parse(input))
  .handler(async ({ data, context }) => {
    await requireOwner(context.supabase, context.userId);
    const validation = validateUpload({ type: data.mime_type, size: data.size_bytes });
    if (validation) throw new Error(validation);
    if (data.mime_type === "application/pdf" && !["document","certificate"].includes(data.kind)) throw new Error("Use an image for this purpose.");
    const directory = data.path.slice(0, data.path.lastIndexOf("/"));
    const filename = data.path.slice(data.path.lastIndexOf("/") + 1);
    const { data: objects, error: listError } = await context.supabase.storage.from("portfolio-media").list(directory, { search: filename });
    const object = objects?.find((item) => item.name === filename);
    if (listError || !object) throw new Error("Upload the file before saving it.");
    const actualSize = Number(object.metadata?.["size"]);
    const actualType = String(object.metadata?.["mimetype"] ?? "");
    if (validateUpload({type:actualType,size:actualSize}) || actualSize !== data.size_bytes || actualType !== data.mime_type) throw new Error("Uploaded file validation failed.");
    const { error } = await context.supabase.from("media_library").upsert(data);
    if (error) throw new Error(error.message);
    return true;
  });
export const deleteMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireOwner(context.supabase, context.userId);
    const { data: item, error } = await context.supabase.from("media_library").select("path").eq("id", data.id).single();
    if (error || !item) throw new Error("File not found.");
    const removed = await context.supabase.storage.from("portfolio-media").remove([item.path]);
    if (removed.error) throw new Error(removed.error.message);
    const result = await context.supabase.from("media_library").delete().eq("id", data.id);
    if (result.error) throw new Error(result.error.message);
    return true;
  });
export const updateMessage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid(), remove: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireOwner(context.supabase, context.userId);
    const result = data.remove ? await context.supabase.from("contact_messages").delete().eq("id", data.id) : await context.supabase.from("contact_messages").update({is_read:true}).eq("id", data.id);
    if (result.error) throw new Error(result.error.message);
    return true;
  });
export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website) return { success: true };
    const request = getRequest();
    const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
    const sender = Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2,"0")).join("");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: accepted, error } = await supabaseAdmin.rpc("accept_contact", {_name:data.name,_email:data.email,_subject:data.subject,_message:data.message,_sender:sender});
    if (error) throw new Error("Your message could not be sent. Please try again.");
    if (!accepted) throw new Error("Please wait one minute before sending another message.");
    return { success: true };
  });