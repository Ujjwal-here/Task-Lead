export type LeadStatus = "New" | "Qualified" | "Converted" | "Follow-up";

export type FilterField = "Status" | "Qualification" | "Source" | "Assigned To" | "Interest";

export interface FilterCondition {
  field: FilterField;
  value: string;
}

export interface LeadRow {
  id: string;
  name: string;
  contact: string; // phone
  email?: string;
  status: LeadStatus;
  qualification: string;
  interest: string;
  source: string;
  assignedTo: string;
  updatedAt: string; // ISO string
}

export const demoLeads: LeadRow[] = [
  {
    id: "1",
    name: "Karl Legros",
    contact: "857-256-0540",
    email: "karl@example.com",
    status: "Follow-up",
    qualification: "Masters",
    interest: "Mobile Development",
    source: "Email Campaign",
    assignedTo: "John Doe",
    updatedAt: "2025-05-22T23:02:00Z",
  },
  {
    id: "2",
    name: "Bridget Hayes",
    contact: "1-318-365-9874",
    email: "bridget@example.com",
    status: "Qualified",
    qualification: "PhD",
    interest: "Digital Marketing",
    source: "Website",
    assignedTo: "John Doe",
    updatedAt: "2025-05-21T10:23:00Z",
  },
  {
    id: "3",
    name: "Dr. Lawrence Cummings IV",
    contact: "314-612-3224",
    status: "Qualified",
    qualification: "High School",
    interest: "Mobile Development",
    source: "Cold Call",
    assignedTo: "Jane Smith",
    updatedAt: "2025-05-20T15:06:00Z",
  },
  {
    id: "4",
    name: "Amos D'Amore",
    contact: "275-600-3449",
    status: "Converted",
    qualification: "Bachelors",
    interest: "Data Science",
    source: "Social Media",
    assignedTo: "Jane Smith",
    updatedAt: "2025-05-19T20:35:00Z",
  },
  {
    id: "5",
    name: "Miss Norma Predovic",
    contact: "(866) 273-8835",
    status: "Converted",
    qualification: "High School",
    interest: "Data Science",
    source: "Website",
    assignedTo: "Emily Davis",
    updatedAt: "2025-05-19T18:02:00Z",
  },
  {
    id: "6",
    name: "Raul Kub",
    contact: "1-982-565-4955",
    status: "Qualified",
    qualification: "Other",
    interest: "Web Development",
    source: "Social Media",
    assignedTo: "Jane Smith",
    updatedAt: "2025-05-18T20:54:00Z",
  },
  {
    id: "7",
    name: "Rickey Swift",
    contact: "(389) 546-9831",
    status: "New",
    qualification: "Masters",
    interest: "Mobile Development",
    source: "Social Media",
    assignedTo: "Robert Johnson",
    updatedAt: "2025-05-18T17:19:00Z",
  },
  {
    id: "8",
    name: "Ernestine Leannon",
    contact: "(744) 349-5353",
    status: "New",
    qualification: "High School",
    interest: "Web Development",
    source: "Website",
    assignedTo: "Emily Davis",
    updatedAt: "2025-05-17T19:23:00Z",
  },
];
