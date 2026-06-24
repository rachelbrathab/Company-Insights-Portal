import { useState } from "react";

type Props = {
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  size?: number;
  className?: string;
};

const LOGO_DEV_KEY = (import.meta as any).env?.VITE_LOGO_DEV_PUBLISHABLE_KEY as string | undefined;

function domainFrom(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function CompanyLogo({ name, logoUrl, websiteUrl, size = 48, className = "" }: Props) {
  const domain = domainFrom(websiteUrl);
  const logoDev = LOGO_DEV_KEY && domain ? `https://img.logo.dev/${domain}?token=${LOGO_DEV_KEY}&size=128` : null;
  const candidates = [logoDev, logoUrl].filter(Boolean) as string[];
  const [idx, setIdx] = useState(0);
  const current = candidates[idx];

  if (current) {
    return (
      <img
        src={current}
        alt={`${name} logo`}
        width={size}
        height={size}
        className={`rounded-md object-contain bg-white border border-border ${className}`}
        onError={() => setIdx((i) => i + 1)}
      />
    );
  }

  const letter = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <div
      style={{ width: size, height: size }}
      className={`flex items-center justify-center rounded-md bg-secondary text-secondary-foreground font-semibold border border-border ${className}`}
    >
      {letter}
    </div>
  );
}
