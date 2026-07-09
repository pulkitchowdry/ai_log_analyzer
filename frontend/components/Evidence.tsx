import { useState } from "react";
import { CollectedEvidence } from "@/lib/types";

const severityStyles = {
  healthy: "border-emerald-700/50 bg-emerald-950/20 text-emerald-300",
  info: "border-blue-700/50 bg-blue-950/20 text-blue-300",
  warning: "border-amber-700/50 bg-amber-950/20 text-amber-300",
  critical: "border-red-700/50 bg-red-950/20 text-red-300",
};

export default function Evidence({ ids, evidence = [] }: { ids?: string[]; evidence?: CollectedEvidence[] }) {
  const [open, setOpen] = useState(false);
  const selected = ids?.length
    ? evidence.filter((item) => ids.includes(item.id))
    : evidence;

  if ((!ids || ids.length === 0) && selected.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="text-xs font-medium text-blue-400 hover:text-blue-300"
      >
        {open ? "Hide" : "Show"} evidence ({selected.length || ids?.length || 0})
      </button>

      {open && (
        <div className="mt-2 space-y-2">
          {selected.length > 0 ? selected.map((item) => (
            <div key={item.id} className="rounded border border-slate-700 bg-slate-950/50 p-3 text-xs text-slate-300">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-mono text-slate-400">{item.id}</div>
                <span className={`rounded-full border px-2 py-0.5 capitalize ${severityStyles[item.severity]}`}>
                  {item.severity}
                </span>
              </div>
              <div className="mt-2 text-slate-200">{item.message}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-slate-500">
                <span>{item.source}</span>
                <span>{item.component}</span>
                {item.timestamp && <span>{item.timestamp}</span>}
              </div>
              {item.metadata.length > 0 && (
                <dl className="mt-2 grid gap-1 sm:grid-cols-2">
                  {item.metadata.slice(0, 6).map((meta) => (
                    <div key={`${item.id}-${meta.key}`} className="min-w-0">
                      <dt className="text-slate-500">{meta.key}</dt>
                      <dd className="truncate font-mono text-slate-300">{meta.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          )) : (
            <ul className="space-y-1 text-xs text-slate-400">
              {ids?.map((id) => <li key={id} className="font-mono">{id}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
