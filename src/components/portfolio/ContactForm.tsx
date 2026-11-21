import { Send, CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { contactSchema } from "@/lib/portfolio-content";
import { submitContact } from "@/lib/portfolio.functions";

export function ContactForm() {
  const submit = useServerFn(submitContact);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    const parsed = contactSchema.safeParse(fields);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Check your message."); return; }
    setBusy(true); setError("");
    try { await submit({data: parsed.data}); setSent(true); form.reset(); }
    catch (err) { setError(err instanceof Error ? err.message : "Your message could not be sent."); }
    finally { setBusy(false); }
  }
  return <form className="contact-form" onSubmit={send}>
    {sent ? <div className="form-success" role="status"><CheckCircle2 size={22} /><h3>Message received.</h3><p>Thank you for getting in touch.</p><Button variant="outline" onClick={() => setSent(false)} type="button">Send another message</Button></div> : <>
      <div className="form-two"><label>Your name<input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Name" /></label><label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label></div>
      <label>Subject<input name="subject" required minLength={3} maxLength={150} placeholder="What’s on your mind?" /></label>
      <label>Message<textarea name="message" required minLength={10} maxLength={5000} rows={5} placeholder="Let’s start a conversation." /></label>
      <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <Button type="submit" disabled={busy}>{busy ? "Sending…" : "Send message"}<Send size={15} aria-hidden="true" /></Button>
    </>}
  </form>;
}