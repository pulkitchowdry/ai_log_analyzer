import { CheckCircle2, XCircle, Clock } from "lucide-react";

/**
 * Consistent status pill for an analysis (completed / failed / pending).
 * Previously this markup was duplicated — with slightly different styling —
 * across the dashboard, history list, and analysis detail pages.
 */

type Variant = {
  badge: string;
  icon: typeof CheckCircle2;
};

const VARIANTS: Record<string, Variant> = {
  completed: { badge: "bg-emerald-900/30 text-emerald-400 border-emerald-800/50", icon: CheckCircle2 },
  failed: { badge: "bg-red-900/30 text-red-400 border-red-800/50", icon: XCircle },
  pending: { badge: "bg-amber-900/30 text-amber-400 border-amber-800/50", icon: Clock },
};

const SIZES = {
  sm: "px-2.5 py-1 text-xs gap-1.5",
  md: "px-3 py-1.5 text-sm gap-2",
} as const;

export default function StatusBadge({
  status,
  size = "sm",
  className = "",
}: {
  status: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const variant = VARIANTS[status?.toLowerCase()] ?? VARIANTS.pending;
  const Icon = variant.icon;
  const iconSize = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium capitalize ${variant.badge} ${SIZES[size]} ${className}`}
    >
      <Icon className={iconSize} />
      {status}
    </span>
  );
}
