import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useCompany } from "@/lib/companyContext";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/company")({
  component: CompanyLayout,
});

function CompanyLayout() {
  const navigate = useNavigate();
  const { selection } = useCompany();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Hydrate from localStorage; if still nothing after first render, bounce home
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("selected-company");
    if (!raw && !selection) {
      navigate({ to: "/" });
    }
  }, [selection, navigate]);

  // /company → /company/intelligence
  useEffect(() => {
    if (pathname === "/company") {
      navigate({ to: "/company/intelligence", replace: true });
    }
  }, [pathname, navigate]);

  const crumb = pathname.includes("/skills") ? "Skill Intelligence" : "Company Intelligence";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-white px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-5" />
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{selection?.companyName || "Company"}</span>
              <span>/</span>
              <span className="font-medium text-foreground">{crumb}</span>
            </nav>
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
