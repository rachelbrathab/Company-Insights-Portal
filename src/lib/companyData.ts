export type CompanySummary = {
  company_id: number;
  name: string;
  short_name: string;
  logo_url: string;
  category: string;
  company_type: string;
  incorporation_year: number | string;
  employee_size: string;
  headquarters_address: string;
  operating_countries: string;
  office_locations: string;
  yoy_growth_rate: string;
  website_url: string;
};

export type CompanyProfile = CompanySummary & Record<string, any>;

export type DashboardSkill = {
  id: number;
  name: string;
  level: number;
  proficiency: string;
};

export const asString = (v: any): string => {
  if (v === undefined || v === null) return "";
  return String(v);
};

export const asRecord = (v: any): Record<string, any> => {
  if (!v || typeof v !== "object") return {};
  return v as Record<string, any>;
};

export const isNullishValue = (v: any): boolean => {
  if (v === null || v === undefined) return true;
  const s = String(v).trim().toLowerCase();
  return ["", "na", "n/a", "none", "-", "null", "undefined"].includes(s);
};

export const splitItems = (input: string): string[] => {
  if (!input) return [];
  return input
    .split(/\r?\n|•|·|;|(?<=\D)\.\s+|,\s+/g)
    .map((s) => s.trim())
    .filter(Boolean);
};

export const titleCaseFromCode = (s: string): string =>
  s.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

export const scoreToDifficulty = (score: number): "EXPERT" | "ADVANCED" | "PRO" | "BEGINNER" => {
  if (score >= 8) return "EXPERT";
  if (score >= 6) return "ADVANCED";
  if (score >= 4) return "PRO";
  return "BEGINNER";
};

export function normalizeCompanySummary(short: Record<string, any>, company_id: number): CompanySummary {
  const r = asRecord(short);
  return {
    company_id,
    name: asString(r.name),
    short_name: asString(r.short_name || r.name),
    logo_url: asString(r.logo_url),
    category: asString(r.category),
    company_type: asString(r.company_type),
    incorporation_year: r.incorporation_year ?? "",
    employee_size: asString(r.employee_size),
    headquarters_address: asString(r.headquarters_address),
    operating_countries: asString(r.operating_countries),
    office_locations: asString(r.office_locations),
    yoy_growth_rate: asString(r.yoy_growth_rate),
    website_url: asString(r.website_url),
  };
}

export function normalizeCompanyProfile(
  full: Record<string, any>,
  short: Record<string, any>,
  company_id: number,
): CompanyProfile {
  const summary = normalizeCompanySummary({ ...short, ...full }, company_id);
  return { ...summary, ...asRecord(full) };
}

export function normalizeDashboardSkills(
  skillLevels: Array<{ skill_set_id: number; skill_set_name: string; required_level: number; required_proficiency: string }>,
): DashboardSkill[] {
  return (skillLevels || []).map((s) => ({
    id: s.skill_set_id,
    name: s.skill_set_name,
    level: Number(s.required_level) || 0,
    proficiency: asString(s.required_proficiency),
  }));
}
