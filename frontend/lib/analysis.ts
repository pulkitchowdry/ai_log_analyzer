/**
 * Helpers for presenting an analysis's identity consistently across the app.
 *
 * Each analysis is stored with a UUID `id`. Historically the UI only ever
 * showed "{domain} Analysis", which made two Kubernetes runs indistinguishable.
 * `shortAnalysisId` derives a stable, human-referenceable incident ID from that
 * UUID so users can point at a specific analysis ("INC-3F9A2C").
 */

/** Short, stable incident-style ID derived from an analysis UUID (e.g. "INC-3F9A2C"). */
export function shortAnalysisId(id: string): string {
  const hex = id.replace(/[^a-fA-F0-9]/g, "").slice(0, 6).toUpperCase();
  return `INC-${hex || "000000"}`;
}

/** Human title for an analysis, e.g. "Kubernetes Analysis". */
export function analysisTitle(domain: string): string {
  const name = (domain || "Log").trim();
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} Analysis`;
}
