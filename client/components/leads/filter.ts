import type { LeadRow } from "./types";
import type { FilterCondition } from "./types";

export function filterLeads(
  leads: LeadRow[],
  query: string,
  conditions: FilterCondition[],
  match: "AND" | "OR"
): LeadRow[] {
  const normalizedQuery = query.trim().toLowerCase();

  const base = normalizedQuery
    ? leads.filter(
        (l) =>
          l.name?.toLowerCase().includes(normalizedQuery) ||
          l.email?.toLowerCase().includes(normalizedQuery) ||
          l.contact?.toLowerCase().includes(normalizedQuery)
      )
    : leads;

  if (!conditions.length) return base;

  return base.filter((row) => {
    const checks = conditions
      .filter((c) => String(c.value ?? "").trim().length > 0)
      .map((c) => {
        const value = (() => {
          switch (c.field) {
            case "Status":
              return row.status;
            case "Qualification":
              return row.qualification;
            case "Source":
              return row.source;
            case "Assigned To":
              return row.assignedTo;
            case "Interest":
              return row.interest;
            default:
              return "";
          }
        })();
        return String(value).toLowerCase() === String(c.value).toLowerCase();
      });

    if (!checks.length) return true;
    return match === "AND" ? checks.every(Boolean) : checks.some(Boolean);
  });
}
