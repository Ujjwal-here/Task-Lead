import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import AddLeadDialog from "@/components/leads/AddLeadDialog";
import InlineFilters, { type FilterCondition } from "@/components/leads/InlineFilters";
import LeadsTable from "@/components/leads/LeadsTable";
import { demoLeads, type LeadRow } from "@/components/leads/types";
import { Button } from "@/components/ui/button";
import { Funnel, CheckCircle2, X } from "lucide-react";
import { filterLeads } from "@/components/leads/filter";

export default function Index() {
  const [leads, setLeads] = useState<LeadRow[]>(demoLeads);
  const [query, setQuery] = useState("");
  const [conditions, setConditions] = useState<FilterCondition[]>([]);
  const [match, setMatch] = useState<"AND" | "OR">("AND");
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  const filtered = useMemo(() => filterLeads(leads, query, conditions, match), [leads, query, conditions, match]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white shadow-sm p-5 gap-4">
        <div>
          <h1 className="text-xl md:text-[25px] leading-6 font-black">Leads</h1>
          <p className="text-sm md:text-[14px] pt-1 font-medium text-muted-foreground">Manage and track your leads</p>
        </div>
        <div className="flex items-center gap-2">
          <AddLeadDialog onAdd={(lead) => addLeadAndToast(lead)} />
        </div>
      </div>

      <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center py-4 px-6">
        <Input
          placeholder="Search leads..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:flex-1 text-sm"
        />
        <Button
          variant="outline"
          className="gap-2 w-full sm:w-auto text-sm"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
        >
          <Funnel className="h-4 w-4" /> {showFilters ? "Hide Filters" : "Filters"}
        </Button>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          showFilters ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
        aria-hidden={!showFilters}
      >
        <div className="overflow-hidden">
          <div className={`mx-6 mt-8 mb-4 flex flex-col gap-3 sm:flex-row sm:items-center justify-between transition-opacity duration-200 ${showFilters ? "opacity-100" : "opacity-0"}`}>
            <h2 className="text-2xl sm:text-2xl ml-2 font-bold text-gray-800">Leads Management</h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" className="gap-2 bg-white w-full sm:w-auto text-sm" onClick={() => setShowFilters(false)}>
                <Funnel className="h-4 w-4" /> Hide Filters
              </Button>
              <AddLeadDialog
                onAdd={(lead) => addLeadAndToast(lead)}
                triggerClassName="px-4 py-3 text-sm text-white bg-gray-800 rounded-md hover:bg-gray-900 flex items-center gap-3 w-full sm:w-auto justify-center"
                triggerLabel="Add New Lead"
                dialogTitle="Add New Lead"
              />
            </div>
          </div>

          <InlineFilters
            initial={conditions.length ? conditions : undefined}
            initialMatch={match}
            initialQuery={query}
            onClose={() => setShowFilters(false)}
            onClear={() => { setConditions([]); setMatch("AND"); setQuery(""); }}
            onApply={(c, m, q) => { setConditions(c); setMatch(m); setQuery(q); setShowFilters(false); }}
          />
        </div>
      </div>

      <LeadsTable rows={filtered} />

      {toast && (
        <div className={`fixed right-4 top-4 z-50 transition-all duration-300 ${toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
          <div className="flex items-start gap-3 rounded-md border bg-white px-4 py-3 shadow-lg">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-foreground">Success</div>
              <div className="text-sm text-muted-foreground">{toast}</div>
            </div>
            <button className="ml-2 text-muted-foreground hover:text-foreground" onClick={() => setToastVisible(false)} aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
  function addLeadAndToast(lead: LeadRow) {
    setLeads((s) => [lead, ...s]);
    setToast(`Lead "${lead.name}" added successfully`);
    setToastVisible(true);
    window.clearTimeout((window as any).__lead_toast);
    (window as any).__lead_toast = window.setTimeout(() => setToastVisible(false), 2600);
  }
}
