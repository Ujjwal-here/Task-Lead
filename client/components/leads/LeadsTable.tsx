import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { LeadRow, LeadStatus } from "./types";
import { ArrowUpDown, ChevronDown } from "lucide-react";

export type SortKey = keyof Pick<LeadRow, "name" | "contact" | "status" | "qualification" | "interest" | "source" | "assignedTo" | "updatedAt">;

function StatusBadge({ status }: { status: LeadStatus }) {
  const styles: Record<LeadStatus, string> = {
    "New": "bg-blue-100 text-blue-700 border-blue-200",
    "Qualified": "bg-green-100 text-green-700 border-green-200",
    "Converted": "bg-purple-100 text-purple-700 border-purple-200",
    "Follow-up": "bg-orange-100 text-orange-700 border-orange-200",
  };
  return <Badge className={styles[status]} variant="outline">{status}</Badge>;
}

interface Props {
  rows: LeadRow[];
}

export default function LeadsTable({ rows }: Props) {
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" } | null>(null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    
    const copy = [...rows];
    copy.sort((a, b) => {
      const va = a[sort.key] ?? "";
      const vb = b[sort.key] ?? "";
      const aVal = typeof va === "string" ? va.toLowerCase() : String(va);
      const bVal = typeof vb === "string" ? vb.toLowerCase() : String(vb);
      if (aVal < bVal) return sort.dir === "asc" ? -1 : 1;
      if (aVal > bVal) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [rows, sort]);

  function toggle(key: SortKey) {
    setSort((s) => {
      if (!s || s.key !== key) {
        return { key, dir: "asc" };
      }
      return s.dir === "asc" ? { key, dir: "desc" } : null;
    });
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm mx-2 sm:mx-6 my-2">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <Table className="min-w-[1000px]">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="cursor-pointer py-6 w-[120px] sm:w-[180px]" onClick={() => toggle("name")}>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-sm md:text-sm">Name</span>
                <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer w-[100px] sm:w-[140px]" onClick={() => toggle("contact")}>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-sm md:text-sm">Contact</span>
                <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer w-[80px] sm:w-[100px]" onClick={() => toggle("status")}>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-sm md:text-sm">Status</span>
                <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer w-[100px] sm:w-[140px]" onClick={() => toggle("qualification")}>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-sm md:text-sm">Qualification</span>
                <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer w-[100px] sm:w-[120px]" onClick={() => toggle("interest")}>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-sm md:text-sm">Interest</span>
                <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer w-[80px] sm:w-[100px]" onClick={() => toggle("source")}>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-sm md:text-sm">Source</span>
                <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer w-[100px] sm:w-[140px]" onClick={() => toggle("assignedTo")}>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-sm md:text-sm">Assigned To</span>
                <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer w-[100px] sm:w-[120px]" onClick={() => toggle("updatedAt")}>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-sm md:text-sm">Updated At</span>
                <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            </TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-semibold text-primary text-sm md:text-sm">
                {r.name}
              </TableCell>
              <TableCell className="font-medium text-sm md:text-sm">
                {r.contact}
              </TableCell>
              <TableCell className="font-medium">
                <div className="scale-90 sm:scale-100 origin-left">
                  <StatusBadge status={r.status} />
                </div>
              </TableCell>
              <TableCell className="font-medium text-sm md:text-sm">
                {r.qualification}
              </TableCell>
              <TableCell className="font-medium text-sm md:text-sm">
                {r.interest}
              </TableCell>
              <TableCell className="font-medium text-sm md:text-sm">
                {r.source}
              </TableCell>
              <TableCell className="font-medium text-sm md:text-sm">
                {r.assignedTo}
              </TableCell>
              <TableCell className="font-medium">
                <div className="text-sm md:text-sm">
                  <div>{new Date(r.updatedAt).toLocaleDateString()}</div>
                  <div>{new Date(r.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </TableCell>
              <TableCell>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>
    </div>
  );
}
