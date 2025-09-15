import { LeadRow } from "./types";

export function searchLeads(leads: LeadRow[], searchTerm: string): LeadRow[] {
  if (!searchTerm.trim()) return leads;
  
  const term = searchTerm.toLowerCase().trim();
  
  return leads.filter(lead => {
    // Search in name, email, and contact (phone) fields
    return (
      (lead.name?.toLowerCase().includes(term)) ||
      (lead.email?.toLowerCase().includes(term)) ||
      (lead.contact?.toLowerCase().includes(term))
    );
  });
}

// Enhanced debounce function with TypeScript types and cancel method
export type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): DebouncedFunction<T> {
  let timeout: NodeJS.Timeout | null = null;
  
  const debounced = function(this: any, ...args: Parameters<T>): void {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
  
  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  return debounced as DebouncedFunction<T>;
}
