import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { MapPin, Users, TrendingUp, TrendingDown, ArrowRight, Search, X } from "lucide-react";
import { SEED_COMPANIES } from "@/data/seedCompanies";
import { normalizeCompanySummary, isNullishValue, type CompanySummary } from "@/lib/companyData";
import { CompanyLogo } from "@/components/CompanyLogo";
import { useCompany } from "@/lib/companyContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KITS Companies Research & Placement Analytics Portal" },
      { name: "description", content: "Your strategic edge for campus placements at Karunya Institute of Technology and Sciences." },
    ],
  }),
  component: IndexPage,
});

const CATEGORY_STYLES: Record<string, string> = {
  "Super Dream": "bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/30",
  Dream: "bg-[#2563eb]/10 text-[#2563eb] border-[#2563eb]/30",
  Standard: "bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/30",
  Regular: "bg-[#d97706]/10 text-[#d97706] border-[#d97706]/30",
};

const FILTERS = ["All", "Super Dream", "Dream", "Standard", "Regular"] as const;

function NotAvailable() {
  return <span className="italic text-muted-foreground">not publicly available</span>;
}

function CompanyCard({ company, onSelect }: { company: CompanySummary; onSelect: (c: CompanySummary) => void }) {
  const growth = company.yoy_growth_rate;
  const negative = typeof growth === "string" && growth.trim().startsWith("-");
  const GrowthIcon = negative ? TrendingDown : TrendingUp;
  const badgeClass = CATEGORY_STYLES[company.company_type] || "bg-secondary text-secondary-foreground border-border";

  return (
    <button
      type="button"
      onClick={() => onSelect(company)}
      className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-left transition hover:border-[#2563eb]/40 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40"
    >
      <div className="flex items-start gap-3">
        <CompanyLogo name={company.name} logoUrl={company.logo_url} websiteUrl={company.website_url} size={48} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", badgeClass)}>
              {company.company_type || "Uncategorized"}
            </span>
          </div>
          <h3 className="mt-1 font-heading text-base font-semibold leading-tight truncate">{company.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{company.short_name}</p>
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-1.5 text-xs text-foreground">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="truncate">{isNullishValue(company.headquarters_address) ? <NotAvailable /> : company.headquarters_address}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="truncate">{isNullishValue(company.employee_size) ? <NotAvailable /> : company.employee_size}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <GrowthIcon className={cn("h-3.5 w-3.5", negative ? "text-red-600" : "text-emerald-600")} />
          <span className={cn(negative && "text-red-600")}>
            {isNullishValue(growth) ? <NotAvailable /> : `YoY ${growth}`}
          </span>
        </div>
      </dl>

      <ArrowRight className="absolute bottom-3 right-3 h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-[#2563eb]" />
    </button>
  );
}

function CardSkeleton() {
  return <div className="h-44 animate-pulse rounded-xl border border-border bg-secondary/40" />;
}

function IndexPage() {
  const navigate = useNavigate();
  const { selectCompany } = useCompany();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [loading, setLoading] = useState(true);
  const debounced = useDeferredValue(query);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const summaries = useMemo(
    () => SEED_COMPANIES.map((c) => normalizeCompanySummary({ ...c.short_json }, c.company_id)),
    [],
  );

  const counts = useMemo(() => {
    const base: Record<string, number> = { All: summaries.length };
    for (const f of FILTERS) if (f !== "All") base[f] = summaries.filter((s) => s.company_type === f).length;
    return base;
  }, [summaries]);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return summaries.filter((s) => {
      if (filter !== "All" && s.company_type !== filter) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.short_name.toLowerCase().includes(q) ||
        s.headquarters_address.toLowerCase().includes(q)
      );
    });
  }, [summaries, debounced, filter]);

  const handleSelect = (c: CompanySummary) => {
    selectCompany({ companyId: c.company_id, companyName: c.name, logoUrl: c.logo_url });
    navigate({ to: "/company/intelligence" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full border border-[#2563eb]/30 bg-[#eff6ff] px-3 py-1 text-[11px] font-semibold tracking-wider text-[#2563eb]">
            KITS · INTELLIGENCE PLATFORM
          </span>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Karunya Institute Of Technology And Sciences — Companies Research & Placement Analytics Portal
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your strategic edge for campus placements.
          </p>
          <div className="relative mt-6 max-w-2xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies, HQ, or short name"
              className="h-11 w-full rounded-lg border border-border bg-white pl-10 pr-10 text-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
            />
            {query && (
              <button
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f;
            const style = f === "All" ? "" : CATEGORY_STYLES[f];
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  active
                    ? f === "All"
                      ? "border-foreground bg-foreground text-background"
                      : style
                    : "border-border bg-white text-muted-foreground hover:border-foreground/30",
                )}
              >
                <span>{f}</span>
                <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-[10px] font-bold">
                  {counts[f] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
            : filtered.map((c) => <CompanyCard key={c.company_id} company={c} onSelect={handleSelect} />)}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="mt-12 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-white p-12 text-center">
            <p className="text-sm text-muted-foreground">No companies match your filters.</p>
            <button
              onClick={() => {
                setQuery("");
                setFilter("All");
              }}
              className="rounded-md bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e40af]"
            >
              Reset filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
