import { useState } from "react";
import { Search, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterCondition, FilterField } from "./types";
import { LEAD_FIELDS, LEAD_STATUSES } from "./constants";

interface Props {
  initial?: FilterCondition[];
  initialMatch?: "AND" | "OR";
  initialQuery?: string;
  onApply: (conditions: FilterCondition[], match: "AND" | "OR", query: string) => void;
  onClear?: () => void;
  onClose?: () => void;
}

export default function InlineFilters({ 
  initial = [{ field: "Status" as FilterField, value: "" }], 
  initialMatch = "AND", 
  initialQuery = "", 
  onApply, 
  onClear, 
  onClose 
}: Props) {
  const [match, setMatch] = useState<"AND" | "OR">(initialMatch);
  const [conditions, setConditions] = useState<FilterCondition[]>(initial);
  const [query, setQuery] = useState<string>(initialQuery);

  function apply() {
    onApply(conditions.filter((c) => c.value), match, query);
  }

  return (
    <div className="mt-3 rounded-lg bg-white border p-6 shadow-sm mx-6 mb-4">
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name, email or phone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 text-sm"
        />
      </div>
      <div className="rounded-lg border bg-gray-50 p-4">
        <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">Advanced Filters</h3>
        </div>
      <div className="mt-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-sm font-medium text-gray-800">Match</div>
          <label className="flex items-center gap-2 text-sm text-gray-800 whitespace-nowrap">
            <input 
              type="radio" 
              className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500 accent-gray-800" 
              checked={match === "AND"} 
              onChange={() => setMatch("AND")} 
            /> 
            <span>
              ALL <span className="hidden sm:inline">conditions</span> (AND)
            </span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-800 whitespace-nowrap">
            <input 
              type="radio" 
              className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500 accent-gray-800" 
              checked={match === "OR"} 
              onChange={() => setMatch("OR")} 
            /> 
            <span>
              ANY <span className="hidden sm:inline">condition</span> (OR)
            </span>
          </label>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {conditions.map((c, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Select value={c.field} onValueChange={(v) => {
              const copy = [...conditions];
              const nextField = v as FilterCondition["field"];
              // Reset value when switching field types to avoid stale values
              copy[idx] = { ...copy[idx], field: nextField, value: "" };
              setConditions(copy);
            }}>
              <SelectTrigger className="w-full sm:w-44 bg-white border-gray-300 text-gray-800 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-sm">
                {LEAD_FIELDS.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {c.field === "Status" ? (
              <Select value={c.value} onValueChange={(v) => {
                const copy = [...conditions];
                copy[idx] = { ...copy[idx], value: v };
                setConditions(copy);
              }}>
                <SelectTrigger className="w-full sm:flex-1 bg-white border-gray-300 text-gray-800 text-sm">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="text-sm">
                  {LEAD_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input 
                value={c.value} 
                onChange={(e) => {
                  const copy = [...conditions];
                  copy[idx] = { ...copy[idx], value: e.target.value };
                  setConditions(copy);
                }} 
                placeholder={`Enter ${c.field.toLowerCase()}`}
                className="w-full sm:flex-1 bg-white border-gray-300 text-gray-800 text-sm placeholder:text-black"
              />
            )}
            <button 
              className="text-gray-500 hover:text-gray-700 sm:ml-2"
              onClick={() => {
                const copy = conditions.filter((_, i) => i !== idx);
                setConditions(copy.length === 0 ? [{ field: "Status", value: "" }] : copy);
              }}
            >
              ×
            </button>
          </div>
        ))}
        <div>
          <button
            className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 w-full sm:w-auto"
            onClick={() => setConditions([...conditions, { field: "Status", value: "" }])}
          >
            Add Filter
          </button>
        </div>
      </div>

      <div className="my-4 border-t border-gray-200"></div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
        <Button variant="outline" onClick={onClear} className="h-11 px-5 text-sm w-full sm:w-auto">
          Clear
        </Button>
        <Button onClick={apply} className="h-11 px-5 text-sm text-white bg-gray-800 hover:bg-gray-900 w-full sm:w-auto">
          Apply Filters
        </Button>
      </div>
      </div>
    </div>
  );
}
