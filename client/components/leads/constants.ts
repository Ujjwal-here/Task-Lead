export const LEAD_STATUSES = [
  "New",
  "Qualified",
  "Converted",
  "Follow-up",
] as const;

export const LEAD_FIELDS = [
  "Status",
  "Qualification",
  "Source",
  "Assigned To",
  "Interest",
] as const;

export type LeadStatusConst = typeof LEAD_STATUSES[number];
export type LeadFieldConst = typeof LEAD_FIELDS[number];


