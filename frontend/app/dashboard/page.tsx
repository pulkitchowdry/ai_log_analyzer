"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getAnalysisHistory, AnalysisHistory, User } from "@/lib/api";
import Link from "next/link";
import { FileText } from "lucide-react";
import LogUploader from "@/components/LogUploader";
import AppHeader from "@/components/AppHeader";
import { shortAnalysisId, analysisTitle } from "@/lib/analysis";
import StatusBadge from "@/components/StatusBadge";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        
        const history = await getAnalysisHistory();
        setAnalyses(history);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      <AppHeader user={user} />

      {/* Main Content — primary action first */}
      <main className="w-full px-6 py-8">
        {/* Log Uploader Component (primary workflow) */}
        <LogUploader />

        {/* Recent Analyses — secondary, quick access to prior runs */}
        {analyses.length > 0 && (
          <div className="mt-10 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-200">Recent analyses</h3>
              <Link href="/dashboard/history" className="text-sm text-blue-400 hover:text-blue-300">
                View all →
              </Link>
            </div>
            <div className="grid gap-3">
              {analyses.slice(0, 3).map((analysis) => (
                <Link
                  key={analysis.id}
                  href={`/dashboard/history/${analysis.id}`}
                  className="glass p-4 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-blue-300/90 bg-blue-950/40 border border-blue-900/50 rounded px-1.5 py-0.5">
                            {shortAnalysisId(analysis.id)}
                          </span>
                          <span className="font-medium text-slate-200">{analysisTitle(analysis.domain)}</span>
                        </div>
                        <div className="text-sm text-slate-400 mt-0.5">
                          {new Date(analysis.created_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={analysis.status} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
