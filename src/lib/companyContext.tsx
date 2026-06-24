import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { SEED_COMPANIES } from "@/data/seedCompanies";
import { normalizeCompanyProfile, type CompanyProfile } from "@/lib/companyData";

const STORAGE_KEY = "selected-company";

type Selection = { companyId: number; companyName: string; logoUrl: string };

type Ctx = {
  selection: Selection | null;
  profile: CompanyProfile | null;
  selectCompany: (s: Selection) => void;
  clear: () => void;
};

const CompanyContext = createContext<Ctx | null>(null);

function loadFromStorage(): Selection | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Selection;
  } catch {
    return null;
  }
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection | null>(null);

  useEffect(() => {
    setSelection(loadFromStorage());
  }, []);

  const profile =
    selection &&
    (() => {
      const seed = SEED_COMPANIES.find((c) => c.company_id === selection.companyId);
      if (!seed) return null;
      return normalizeCompanyProfile(seed.full_json, seed.short_json, seed.company_id);
    })();

  const selectCompany = (s: Selection) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    }
    setSelection(s);
  };

  const clear = () => {
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    setSelection(null);
  };

  return (
    <CompanyContext.Provider value={{ selection, profile: profile || null, selectCompany, clear }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used inside CompanyProvider");
  return ctx;
}
