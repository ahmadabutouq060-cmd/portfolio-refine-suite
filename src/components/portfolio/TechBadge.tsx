import { Code2, Database, FileText, Globe, LayoutGrid, ScanText, Server, Smartphone, Sparkles } from "lucide-react";
import type { IconType } from "react-icons";
import { FaJava } from "react-icons/fa6";
import { SiCplusplus, SiDart, SiFlutter, SiHtml5, SiJavascript, SiMysql, SiSupabase } from "react-icons/si";

const iconMap: Record<string, IconType> = {
  html: SiHtml5,
  javascript: SiJavascript,
  supabase: SiSupabase,
  java: FaJava,
  "mysql / mariadb": SiMysql,
  mysql: SiMysql,
  sql: Database,
  flutter: SiFlutter,
  dart: SiDart,
  "c++": SiCplusplus,
  "tesseract.js ocr": ScanText,
  "pdf.js": FileText,
  pwa: Smartphone,
  "tabler icons": Sparkles,
  javafx: LayoutGrid,
  jdbc: Database,
  "material design": LayoutGrid,
  uuid: Code2,
  intl: Globe,
  "responsive ui": Smartphone,
  "relational databases": Database,
  "git & github": Code2,
  oop: Code2,
  "data structures": Code2,
};

export function TechBadge({ label }: { label: string }) {
  const key = label.toLowerCase();
  const Icon = iconMap[key] ?? Code2;
  return (
    <span className="tech-badge" data-tech={key}>
      <Icon aria-hidden="true" size={14} />
      {label}
    </span>
  );
}

export function TechBadgeList({ items, label }: { items: string[]; label?: string }) {
  return (
    <div className="tech-badge-list" aria-label={label ?? "Technologies"}>
      {items.map((item) => (
        <TechBadge key={item} label={item} />
      ))}
    </div>
  );
}
