import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Lock } from "lucide-react";
import { useCompany } from "@/lib/companyContext";
import { CompanyLogo } from "@/components/CompanyLogo";
import { SEED_COMPANIES } from "@/data/seedCompanies";
import { normalizeDashboardSkills, type DashboardSkill } from "@/lib/companyData";
import { SKILL_TOPICS } from "@/data/skillTopics";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/company/skills")({
  component: SkillIntelligence,
});

type Bloom = "CU" | "AP" | "AS" | "EV" | "CR";
const BLOOM_INFO: Record<Bloom, { label: string; color: string; bg: string }> = {
  CU: { label: "Remember", color: "#3b82f6", bg: "#eff6ff" },
  AP: { label: "Apply", color: "#22c55e", bg: "#ecfdf5" },
  AS: { label: "Analyze", color: "#eab308", bg: "#fefce8" },
  EV: { label: "Evaluate", color: "#ef4444", bg: "#fef2f2" },
  CR: { label: "Create", color: "#a855f7", bg: "#faf5ff" },
};

const proficiencyToBloom = (level: number): Bloom => {
  if (level <= 2) return "CU";
  if (level <= 4) return "AP";
  if (level <= 6) return "AS";
  if (level <= 8) return "EV";
  return "CR";
};

const scoreToCriticality = (level: number): "Critical" | "Important" | "Baseline" => {
  if (level >= 7) return "Critical";
  if (level >= 5) return "Important";
  return "Baseline";
};

const CRIT_STYLE: Record<string, string> = {
  Critical: "bg-red-50 text-red-700 border-red-200",
  Important: "bg-amber-50 text-amber-700 border-amber-200",
  Baseline: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function SkillCard({ skill }: { skill: DashboardSkill }) {
  const [open, setOpen] = useState(false);
  const bloom = proficiencyToBloom(skill.level);
  const crit = scoreToCriticality(skill.level);
  const info = BLOOM_INFO[bloom];
  const topics = SKILL_TOPICS[skill.id] || [];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-base font-semibold">{skill.name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span
              className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold"
              style={{ borderColor: info.color, color: info.color, backgroundColor: info.bg }}
            >
              {bloom} · {info.label}
            </span>
            <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold", CRIT_STYLE[crit])}>
              {crit}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-heading text-2xl font-bold" style={{ color: info.color }}>
            {skill.level}<span className="text-sm text-muted-foreground">/10</span>
          </div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{skill.proficiency}</div>
        </div>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full transition-all" style={{ width: `${skill.level * 10}%`, backgroundColor: info.color }} />
      </div>

      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#2563eb] hover:underline"
      >
        {open ? "Hide roadmap" : "View 10-level roadmap"}
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      {open && (
        <ol className="mt-3 space-y-1.5">
          {topics.map((t, i) => {
            const lvl = i + 1;
            const locked = lvl > skill.level;
            return (
              <li
                key={lvl}
                className={cn(
                  "flex items-start gap-2 rounded-md border px-3 py-2 text-xs",
                  locked
                    ? "border-dashed border-border bg-secondary/30 text-muted-foreground"
                    : "border-border bg-white text-foreground",
                )}
              >
                <span
                  className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={
                    locked
                      ? { backgroundColor: "#f1f5f9", color: "#94a3b8" }
                      : { backgroundColor: info.bg, color: info.color }
                  }
                >
                  {lvl}
                </span>
                <span className="flex-1">{t}</span>
                {locked && (
                  <span className="inline-flex items-center gap-1 text-[10px] italic">
                    <Lock className="h-3 w-3" /> Beyond scope
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function SkillIntelligence() {
  const navigate = useNavigate();
  const { selection, profile } = useCompany();

  useEffect(() => {
    if (!selection && typeof window !== "undefined") {
      const raw = window.localStorage.getItem("selected-company");
      if (!raw) navigate({ to: "/" });
    }
  }, [selection, navigate]);

  const skills = useMemo<DashboardSkill[]>(() => {
    if (!selection) return [];
    const seed = SEED_COMPANIES.find((c) => c.company_id === selection.companyId);
    if (!seed) return [];
    return normalizeDashboardSkills(seed.skill_levels).sort((a, b) => b.level - a.level);
  }, [selection]);

  if (!profile) return <div className="p-10 text-center text-muted-foreground">Loading skills…</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <header className="flex items-center gap-3">
        <CompanyLogo name={profile.name} logoUrl={profile.logo_url} websiteUrl={profile.website_url} size={44} />
        <div>
          <h1 className="font-heading text-2xl font-bold">{profile.short_name || profile.name} Skill Intelligence</h1>
          <p className="text-sm text-muted-foreground">Bloom-mapped readiness ladder for placement targets.</p>
        </div>
      </header>

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bloom Levels</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {(Object.keys(BLOOM_INFO) as Bloom[]).map((k) => {
            const i = BLOOM_INFO[k];
            return (
              <div key={k} className="rounded-md border border-border p-2 text-center" style={{ backgroundColor: i.bg }}>
                <div className="font-heading text-sm font-bold" style={{ color: i.color }}>{k}</div>
                <div className="text-[10px] text-muted-foreground">{i.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Criticality</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {(["Critical", "Important", "Baseline"] as const).map((c) => (
            <div key={c} className={cn("rounded-md border p-3 text-sm font-semibold", CRIT_STYLE[c])}>
              {c}
              <p className="mt-0.5 text-[11px] font-normal opacity-80">
                {c === "Critical" ? "Must-have, score ≥ 7" : c === "Important" ? "Strong plus, score ≥ 5" : "Foundational, score < 5"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {skills.map((s) => (
          <SkillCard key={s.id} skill={s} />
        ))}
      </section>
    </div>
  );
}
