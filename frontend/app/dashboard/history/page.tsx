"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAnalysisHistory, getCurrentUser, User, type AnalysisHistory } from "@/lib/api";
import Link from "next/link";
import { FileText, Clock, Search } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { shortAnalysisId, analysisTitle } from "@/lib/analysis";

export default function AnalysisHistory() {
  const [analyses, setAnalyses] = useState<AnalysisHistory[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        
        const history = await getAnalysisHistory();
        setAnalyses(history);
      } catch (err) {
        console.error("Failed to load history:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  const filteredAnalyses = analyses.filter(a => {
    const q = searchTerm.toLowerCase();
    return a.domain.toLowerCase().includes(q) || shortAnalysisId(a.id).toLowerCase().includes(q);
  });

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

      <main className="w-full px-6 py-8">
        <PageHeader title="Analysis History" />

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by ID (INC-…) or domain (kubernetes, nginx, system)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Analyses List */}
        <div className="space-y-3">
          {filteredAnalyses.length === 0 ? (
            <div className="glass p-12 text-center rounded-lg border border-slate-700">
              <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-1">No analyses found</h3>
              <p className="text-slate-500">Upload logs to get started</p>
            </div>
          ) : (
            filteredAnalyses.map((analysis) => (
              <Link
                key={analysis.id}
                href={`/dashboard/history/${analysis.id}`}
                className="glass p-4 rounded-lg border border-slate-700 hover:border-blue-500 transition-all hover:shadow-lg block"
              >
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="p-2 bg-blue-900/20 rounded-lg shrink-0">
                      <FileText className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <span className="font-mono text-xs text-blue-300/90 bg-blue-950/40 border border-blue-900/50 rounded px-1.5 py-0.5">
                          {shortAnalysisId(analysis.id)}
                        </span>
                        <span className="font-semibold text-slate-200 text-lg break-words">
                          {analysisTitle(analysis.domain)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-4 sm:gap-6">
                    <StatusBadge status={analysis.status} />

                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                        <Clock className="h-4 w-4 shrink-0" />
                        {new Date(analysis.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-slate-600">
                        {new Date(analysis.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}