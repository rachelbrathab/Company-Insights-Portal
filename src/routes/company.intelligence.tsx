import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Linkedin, Globe } from "lucide-react";
import { useCompany } from "@/lib/companyContext";
import { CompanyLogo } from "@/components/CompanyLogo";
import { buildIntelligenceSections } from "@/data/intelligenceData";
import { isNullishValue, splitItems } from "@/lib/companyData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/company/intelligence")({
  component: CompanyIntelligence,
});

function NotAvailable() {
  return <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs italic text-muted-foreground">Not Available</span>;
}

function renderValue(value: any, type?: string): React.ReactNode {
  if (isNullishValue(value)) return <NotAvailable />;
  const v = String(value);

  if (type === "url") {
    return (
      <a href={v} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#2563eb] hover:underline">
        {v.replace(/^https?:\/\//, "")} <ExternalLink className="h-3 w-3" />
      </a>
    );
  }
  if (type === "video") {
    return (
      <a href={v} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#2563eb] hover:underline">
        Watch video <ExternalLink className="h-3 w-3" />
      </a>
    );
  }
  if (type === "rating") {
    return <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-sm font-semibold text-amber-700">{v}</span>;
  }
  if (type === "list" || type === "auto" || (!type && (v.includes(";") || /,\s/.test(v)))) {
    const items = splitItems(v);
    if (items.length > 1) {
      return (
        <div className="flex flex-wrap gap-1.5">
          {items.map((i, idx) => (
            <span key={idx} className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-foreground">
              {i}
            </span>
          ))}
        </div>
      );
    }
  }
  if (type === "paragraph") return <p className="text-sm leading-relaxed text-foreground">{v}</p>;
  return <span className="text-sm text-foreground">{v}</span>;
}

function FieldRow({ label, value, type }: { label: string; value: any; type?: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border/60 py-2.5 last:border-b-0 sm:flex-row sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:w-1/3">{label}</dt>
      <dd className="sm:w-2/3">{renderValue(value, type)}</dd>
    </div>
  );
}

function CompanyIntelligence() {
  const navigate = useNavigate();
  const { selection, profile } = useCompany();
  const sections = useMemo(() => buildIntelligenceSections(profile), [profile]);
  const [active, setActive] = useState(0);
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    if (!selection && typeof window !== "undefined") {
      const raw = window.localStorage.getItem("selected-company");
      if (!raw) navigate({ to: "/" });
    }
  }, [selection, navigate]);

  useEffect(() => {
    const handler = () => {
      if (isScrollingRef.current) return;
      const top = window.scrollY + 200;
      let idx = 0;
      sectionRefs.current.forEach((el, i) => {
        if (el && el.offsetTop <= top) idx = i;
      });
      setActive(idx);
      const tab = tabRefs.current[idx];
      tab?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollToSection = (idx: number) => {
    const el = sectionRefs.current[idx];
    if (!el) return;
    isScrollingRef.current = true;
    setActive(idx);
    window.scrollTo({ top: el.offsetTop - 160, behavior: "smooth" });
    setTimeout(() => (isScrollingRef.current = false), 700);
  };

  if (!profile) {
    return (
      <div className="p-10 text-center text-muted-foreground">Loading company…</div>
    );
  }

  return (
    <div className="bg-background">
      <div className="sticky top-14 z-20 border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <CompanyLogo name={profile.name} logoUrl={profile.logo_url} websiteUrl={profile.website_url} size={40} />
            <div className="min-w-0">
              <h1 className="font-heading text-base font-semibold leading-tight truncate">{profile.name}</h1>
              <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {profile.category || "Industry"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isNullishValue(profile.website_url) && (
              <a
                href={profile.website_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs font-medium hover:bg-secondary"
              >
                <Globe className="h-3.5 w-3.5" /> Website
              </a>
            )}
            {!isNullishValue(profile.linkedin_url) && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs font-medium hover:bg-secondary"
              >
                <Linkedin className="h-3.5 w-3.5" /> LinkedIn
              </a>
            )}
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto max-w-7xl overflow-x-auto px-2 sm:px-4">
            <div className="flex gap-1 py-2">
              {sections.map((s, idx) => (
                <button
                  key={s.id}
                  ref={(el) => { tabRefs.current[idx] = el; }}
                  onClick={() => scrollToSection(idx)}
                  className={cn(
                    "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition",
                    active === idx
                      ? "bg-[#eff6ff] text-[#2563eb]"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          const populated = section.fields.filter((f) => !isNullishValue(profile[f.key])).length;
          return (
            <div
              key={section.id}
              ref={(el) => { sectionRefs.current[idx] = el; }}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#eff6ff] text-[#2563eb]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h2 className="font-heading text-lg font-semibold">{section.title}</h2>
                </div>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {populated}/{section.fields.length}
                </span>
              </div>
              <dl>
                {section.fields.map((f) => (
                  <FieldRow key={f.key} label={f.label} value={profile[f.key]} type={f.type} />
                ))}
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
}
