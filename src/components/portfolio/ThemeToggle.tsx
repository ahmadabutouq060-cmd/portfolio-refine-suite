import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme") === "light";
    setLight(saved);
    document.documentElement.dataset["theme"] = saved ? "light" : "dark";
  }, []);
  return <Button variant="icon" size="icon" className="theme-toggle" title={light ? "Switch to dark theme" : "Switch to light theme"} aria-label={light ? "Switch to dark theme" : "Switch to light theme"} onClick={() => {
    const next = !light;
    setLight(next);
    document.documentElement.dataset["theme"] = next ? "light" : "dark";
    localStorage.setItem("portfolio-theme", next ? "light" : "dark");
  }}>{light ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}</Button>;
}