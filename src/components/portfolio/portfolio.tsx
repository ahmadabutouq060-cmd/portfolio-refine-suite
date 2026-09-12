import { ArrowDownRight, ArrowRight, ArrowUpRight, Braces, Code2, Coffee, Database, FileCode2, Github, Linkedin, Mail, Menu, Palette, PenTool, Smartphone, Terminal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import portraitCutout from "@/assets/ahmad-abu-touq-portrait-cutout.png";
import { AmbientBackground } from "@/components/portfolio/AmbientBackground";
import { IntroOverlay } from "@/components/portfolio/IntroOverlay";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { ProjectDetails } from "@/components/portfolio/ProjectDetails";

import { Button } from "@/components/ui/button";
import { projects, type Project } from "@/data/projects";
import { EMAIL_ADDRESS, GITHUB_URL, LINKEDIN_URL } from "@/data/socials";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Projects" },
  { id: "contact", label: "Contact" },
];


const primaryStack = [
  { name: "Flutter", icon: Smartphone, color: "197 85% 62%", detail: "Mobile apps: Expense Tracker and Dice Roller." },
  { name: "Dart", icon: Code2, color: "174 70% 48%", detail: "Language behind every Flutter project here." },
  { name: "Java", icon: Coffee, color: "27 92% 58%", detail: "JavaFX desktop application AUShop." },
  { name: "C++", icon: Terminal, color: "220 85% 62%", detail: "Programming and data-structures coursework." },
  { name: "SQL", icon: Database, color: "160 70% 48%", detail: "MySQL / MariaDB schema behind AUShop." },
  { name: "HTML", icon: FileCode2, color: "18 90% 58%", detail: "Structure and markup behind the Ri'aya web platform." },
  { name: "CSS", icon: Palette, color: "212 88% 62%", detail: "Layout, responsive rules and styling for web interfaces." },
  { name: "JavaScript", icon: Braces, color: "48 95% 58%", detail: "Interactive behaviour and Supabase calls in Ri'aya." },
  { name: "UI/UX", icon: PenTool, color: "300 75% 66%", detail: "Designing clean, user-friendly interfaces across web and mobile projects." },
];


const expertise = [
  { label: "Web Development", detail: "Ri'aya — a role-based healthcare web platform built with HTML, JavaScript and Supabase." },
  { label: "Mobile Development", detail: "Flutter and Dart apps, from an expense tracker with charts to smaller practice builds." },
  { label: "Desktop Applications", detail: "AUShop — a JavaFX application over a MySQL/MariaDB database via JDBC." },
  { label: "Databases", detail: "Relational schema design and SQL used across the shop and platform projects." },
];




const focuses = [
  ["Advanced Flutter", "Building deeper mobile development knowledge."],
  ["Backend Development", "Learning how reliable application services fit together."],
  ["Software Architecture", "Understanding maintainable systems and clear boundaries."],
  ["Better Problem Solving", "Improving through deliberate practice and real projects."],
];

const projectFilters = ["All", "Web", "Mobile", "Desktop", "Design"] as const;
type Filter = (typeof projectFilters)[number];

const projectFilterById: Record<string, Exclude<Filter, "All">> = {
  riaya: "Web",
  aushop: "Desktop",
  expenses: "Mobile",
  dice: "Mobile",
  rikaz: "Design",
};

function SectionHeading({ number, label, title }: { number: string; label: string; title: string }) {
  return (
    <div className="section-heading">
      <span className="section-number" aria-hidden="true">({number})</span>
      <div>
        <p className="eyebrow">{label}</p>
        <h2>{title}</h2>
      </div>
    </div>
  );
}

export function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<Filter>("All");

  const visibleProjects = useMemo(
    () => (filter === "All" ? projects : projects.filter((project) => projectFilterById[project.id] === filter)),
    [filter],
  );


  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);


  useEffect(() => {
    const revealElements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const sections = document.querySelectorAll<HTMLElement>("main section[id]");

    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-visible", "true");
          revealObserver.unobserve(entry.target);
        }
      }),
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );
    revealElements.forEach((element) => revealObserver.observe(element));

    const sectionObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      }),
      { rootMargin: "-30% 0px -55%", threshold: 0 },
    );
    sections.forEach((section) => sectionObserver.observe(section));

    const updateProgress = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      const progress = available > 0 ? window.scrollY / available : 0;
      document.documentElement.style.setProperty("--scroll-progress", String(progress));
      document.documentElement.dataset["scrolled"] = window.scrollY > 24 ? "true" : "false";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  return (
    <div className="portfolio-shell">
      <IntroOverlay />
      <AmbientBackground />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="scroll-progress" aria-hidden="true" />

      <header className="site-header">
        <div className="header-inner">
          <a href="#top" className="brand" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark" aria-hidden="true">AT</span>
            <span className="brand-name">Ahmad<span aria-hidden="true"> Abu Touq</span></span>
          </a>
          <nav className="site-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={activeSection === item.id ? "is-active" : undefined}
                aria-current={activeSection === item.id ? "location" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-socials">
            <Button asChild variant="icon" className="social-round">
              <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener" aria-label="Ahmad Abu Touq on GitHub">
                <Github aria-hidden="true" size={16} />
              </a>
            </Button>
            <Button asChild variant="icon" className="social-round">
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer noopener" aria-label="Ahmad Abu Touq on LinkedIn">
                <Linkedin aria-hidden="true" size={16} />
              </a>
            </Button>
            <Button asChild variant="icon" className="social-round">
              <a href={`mailto:${EMAIL_ADDRESS}`} aria-label={`Email ${EMAIL_ADDRESS}`}>
                <Mail aria-hidden="true" size={16} />
              </a>
            </Button>
          </div>
          <button
            type="button"
            className="menu-round"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
          </button>
        </div>
      </header>

      <div
        className={cn("mobile-menu", menuOpen && "is-open")}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="mobile-menu-head">
          <a href="#top" className="brand" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark" aria-hidden="true">AT</span>
            <span className="brand-name">Ahmad<span aria-hidden="true"> Abu Touq</span></span>
          </a>
          <button
            type="button"
            className="menu-round"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>
        <nav className="mobile-menu-links" aria-label="Mobile navigation">
          {navItems.map((item, index) => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setMenuOpen(false)}>
              <span aria-hidden="true">0{index + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </div>


      <main id="main-content">
        <section id="top" className="hero">
          <div className="hero-beam" aria-hidden="true" />
          <div className="hero-particles" aria-hidden="true" />
          <div className="hero-inner container-wide">
            <div className="hero-copy">
              <p className="eyebrow hero-rise">I am</p>
              <h1 className="hero-name hero-rise hero-delay-1"><span>Ahmad</span><span>Abu Touq</span></h1>
              <p className="hero-role hero-rise hero-delay-2">Software Engineering Student &amp; Developer</p>
              <p className="hero-intro hero-rise hero-delay-2">
                I build thoughtful mobile and software experiences with clean code, useful interfaces, and a focus on solving real problems.
              </p>
              <div className="hero-actions hero-rise hero-delay-3">
                <Button asChild><a href="#work">View My Work <ArrowRight aria-hidden="true" size={16} /></a></Button>
                <Button asChild variant="outline"><a href="#contact">Contact Me <ArrowDownRight aria-hidden="true" size={15} /></a></Button>
              </div>
            </div>

            <div className="hero-visual hero-rise hero-delay-2">
              <p className="hero-bigtype" aria-hidden="true">Software</p>
              <div className="hero-circle" aria-hidden="true" />
              <img
                className="hero-portrait"
                src={portraitCutout}
                alt="Ahmad Abu Touq wearing a navy suit and tie"
                fetchPriority="high"
              />
              <p className="hero-outlinetype" aria-hidden="true">Developer</p>
            </div>
          </div>
        </section>

        <section id="about" className="about-section container-wide section-space" data-reveal>
          <SectionHeading number="01" label="About me" title="A developer in progress." />
          <div className="about-copy">
            <p className="lead">I’m a third-year Software Engineering student at Applied Science Private University in Amman, Jordan.</p>
            <p>My journey has taken me across programming, mobile development, databases, and software engineering fundamentals. I enjoy meaningful projects, learning through practice, and building software that is useful, thoughtful, and human.</p>
            <dl className="about-facts">
              <div><dt>Year</dt><dd>03</dd></div>
              <div><dt>Focus</dt><dd>Build · Learn · Improve</dd></div>
            </dl>
          </div>
        </section>

        <section id="skills" className="skills-section container-wide section-space" data-reveal>
          <SectionHeading number="02" label="Skills" title="Technologies I work with." />
          <p className="section-intro">The core stack behind my web, mobile and desktop projects.</p>
          <div className="skills-grid">
            {primaryStack.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <article key={skill.name} style={{ ["--skill-color" as string]: `hsl(${skill.color})` }}>
                  <span className="skill-icon" aria-hidden="true"><Icon /></span>
                  <span className="skill-index">0{index + 1}</span>
                  <h3>{skill.name}</h3>
                  <p>{skill.detail}</p>
                </article>
              );
            })}
          </div>
        </section>


        <section id="expertise" className="expertise-section container-wide section-space" data-reveal>
          <SectionHeading number="03" label="What I build" title="Where my projects live." />
          <div className="expertise-list">
            {expertise.map((item, index) => (
              <article key={item.label}>
                <span>0{index + 1}</span>
                <h3>{item.label}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="work-section container-wide section-space" data-reveal>
          <div className="work-head">
            <SectionHeading number="04" label="Selected work" title="Things I’ve built." />
            <div className="project-filters" role="group" aria-label="Filter projects">
              {projectFilters.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={cn("project-filter", filter === item && "is-active")}
                  aria-pressed={filter === item}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <p className="section-intro">Real repositories and design work — every technology, feature and link below comes from the project source itself.</p>

          <div className="project-list" aria-label="Projects">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onOpenDetails={setSelectedProject} />
            ))}
          </div>
        </section>

        <section className="focus-section container-wide section-space" data-reveal>
          <SectionHeading number="05" label="Current focus" title="Where I’m growing next." />
          <div className="focus-list">
            {focuses.map(([title, description], index) => (
              <article key={title} className={index % 2 === 0 ? "focus-cyan" : "focus-violet"}>
                <span className="focus-label"><i className="focus-ring" aria-hidden="true" />0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="contact-section container-wide section-space" data-reveal>
          <div>
            <p className="eyebrow">06 / Contact</p>
            <h2>Get in touch.</h2>
            <p>I’m interested in opportunities to learn, collaborate, and contribute to useful software.</p>
          </div>
          <div className="contact-links" aria-label="Contact links">
            <a href={`mailto:${EMAIL_ADDRESS}`}><Mail aria-hidden="true" size={19} /><span><small>Email</small>{EMAIL_ADDRESS}</span><ArrowUpRight aria-hidden="true" size={16} /></a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener"><Github aria-hidden="true" size={19} /><span><small>GitHub</small>ahmadabutouq060-cmd</span><ArrowUpRight aria-hidden="true" size={16} /></a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer noopener"><Linkedin aria-hidden="true" size={19} /><span><small>LinkedIn</small>ahmad-abu-touq</span><ArrowUpRight aria-hidden="true" size={16} /></a>
          </div>
        </section>
      </main>

      <footer className="site-footer container-wide">
        <div className="footer-identity">
          <span className="footer-name">Ahmad Abu Touq</span>
          <span>Software Engineering Student &amp; Developer</span>
        </div>
        <div className="footer-links">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener"><Github aria-hidden="true" size={14} /> GitHub</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer noopener"><Linkedin aria-hidden="true" size={14} /> LinkedIn</a>
          <a href={`mailto:${EMAIL_ADDRESS}`}><Mail aria-hidden="true" size={14} /> Email</a>
        </div>
        
      </footer>

      <ProjectDetails project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
