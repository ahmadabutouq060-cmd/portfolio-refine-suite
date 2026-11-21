import ieee from "@/assets/cert-ieee.jpg.asset.json";
import v5 from "@/assets/cert-uiux-v5.jpg.asset.json";
import v6 from "@/assets/cert-uiux-v6.jpg.asset.json";
import { ArrowUpRight, FileText } from "lucide-react";
import type { MediaRow } from "@/lib/portfolio-content";

const originals = [
  {title:"UI/UX Contest V6", detail:"Participation · Applied Science Private University", date:"June 2026", url:v6.url},
  {title:"IEEE JSYP11 Conference", detail:"Certificate of appreciation · IEEE Jordan Section", date:"2026", url:ieee.url},
  {title:"UI/UX Contest V5", detail:"Participation · Applied Science Private University", date:"May 2025", url:v5.url},
];
export function Certificates({media}: {media:MediaRow[]}) {
  return <div className="certificate-grid">
    {originals.map((item) => <article className="certificate-card" key={item.title}><a href={item.url} target="_blank" rel="noopener noreferrer" className="certificate-shot" aria-label={`Open ${item.title} certificate`}><img src={item.url} alt={`${item.title} certificate awarded to Ahmad Abu Touq`} loading="lazy" /><ArrowUpRight size={18} aria-hidden="true" /></a><div><span className="eyebrow">{item.date}</span><h3>{item.title}</h3><p>{item.detail}</p></div></article>)}
    {media.filter((item) => item.kind === "certificate").map((item) => <article className="certificate-card" key={item.id}><a href={item.url} target="_blank" rel="noopener noreferrer" className="certificate-shot" aria-label={`Open ${item.name}`}>{item.mime_type.startsWith("image/") ? <img src={item.url} alt={item.caption || item.name} loading="lazy" /> : <FileText size={48} />}<ArrowUpRight size={18} aria-hidden="true" /></a><div><h3>{item.name}</h3><p>{item.caption}</p></div></article>)}
  </div>;
}