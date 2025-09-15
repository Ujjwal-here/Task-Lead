import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LEAD_STATUSES } from "./constants";
import { Plus } from "lucide-react";
import type { LeadRow, LeadStatus } from "./types";

interface Props {
  onAdd: (lead: LeadRow) => void;
  triggerClassName?: string;
  triggerLabel?: string;
  dialogTitle?: string;
}

type FormState = {
  name: string;
  phone: string;
  altPhone: string;
  email: string;
  altEmail: string;
  status: LeadStatus;
  qualification: string;
  interestField: string;
  source: string;
  assignedTo: string;
  jobInterest: string;
  state: string;
  city: string;
  passoutYear: string;
  heardFrom: string;
};

type Touched = Partial<Record<keyof FormState, boolean>>;

const initialState: FormState = {
  name: "",
  phone: "",
  altPhone: "",
  email: "",
  altEmail: "",
  status: "New",
  qualification: "High School",
  interestField: "Web Development",
  source: "Website",
  assignedTo: "John Doe",
  jobInterest: "",
  state: "",
  city: "",
  passoutYear: "",
  heardFrom: "",
};

export default function AddLeadDialog({ onAdd, triggerClassName, triggerLabel, dialogTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialState);
  const [touched, setTouched] = useState<Touched>({});

    const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    // Remove any non-digit characters and check length
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check if the cleaned number has 10-15 digits and contains only numbers
    const re = /^\d{10,15}$/;
    return { isValid: re.test(digitsOnly), digitsOnly };
  };

  const formatPhoneInput = (value: string) => {
    // Only allow digits and format as user types (e.g., (123) 456-7890)
    const digits = value.replace(/\D/g, '').slice(0, 15);
    const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    
    if (match) {
      const formatted = match[1] + 
        (match[2] ? `-${match[2]}` : '') + 
        (match[3] ? `-${match[3]}` : '');
      return formatted.trim();
    }
    return digits;
  };

  const handlePhoneChange = (value: string, field: 'phone' | 'altPhone') => {
    const formatted = formatPhoneInput(value);
    setForm(prev => ({
      ...prev,
      [field]: formatted
    }));
  };

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};
    
    // Name validation
    if (!form.name.trim()) {
      e.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      e.name = "Name must be at least 2 characters";
    }

    // Phone validation
    if (!form.phone.trim()) {
      e.phone = "Phone is required";
    } else {
      const { isValid } = validatePhone(form.phone);
      if (!isValid) {
        e.phone = "Please enter a valid phone number (10-15 digits, numbers only)";
      }
    }

    // Email validation
    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      e.email = "Please enter a valid email address";
    }

    // Alt Email validation
    if (form.altEmail && !validateEmail(form.altEmail)) {
      e.altEmail = "Please enter a valid email address";
    }

    // Alt Phone validation
    if (form.altPhone) {
      const { isValid, digitsOnly } = validatePhone(form.altPhone);
      if (!isValid) {
        e.altPhone = "Please enter a valid phone number (10-15 digits, numbers only)";
      } else if (form.phone && digitsOnly === form.phone.replace(/\D/g, '')) {
        e.altPhone = "Alternate phone must be different from primary phone";
      }
    }

    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  function markTouched<K extends keyof FormState>(key: K) {
    setTouched((t) => ({ ...t, [key]: true }));
  }

  const submit = () => {
    // Mark all required fields as touched to show errors
    const requiredFields: (keyof FormState)[] = ['name', 'phone', 'email'];
    const newTouched = { ...touched };
    requiredFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    // Check required fields and validate formats
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    
    // Check required fields
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const formattedPhone = form.phone.replace(/\D/g, '');
    const formattedAltPhone = form.altPhone ? form.altPhone.replace(/\D/g, '') : undefined;

    // Only proceed with submission if all validations pass
    const newLead: LeadRow = {
      id: Math.random().toString(36).slice(2),
      name: form.name.trim(),
      contact: formattedPhone,
      email: form.email.trim(),
      status: form.status,
      qualification: form.qualification,
      interest: form.interestField,
      source: form.source,
      assignedTo: form.assignedTo,
      updatedAt: new Date().toISOString(),
    };

    onAdd(newLead);
    setOpen(false);
    setForm(initialState);
    setTouched({});
  };

  useEffect(() => {
    if (!open) {
      setForm(initialState);
      setTouched({});
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={triggerClassName ?? "bg-primary shadow-sm hover:bg-primary/90 flex items-center gap-3"}>
          {triggerLabel ? "" : <Plus className="h-5 w-5" />}
          <span>{triggerLabel ?? "Add Lead"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] sm:max-w-xl shadow-xl sm:rounded-xl max-h-[90vh] overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{dialogTitle ?? "Add Lead"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Name <span className="text-red-500">*</span></label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onBlur={() => markTouched("name")}
              aria-invalid={!!errors.name && touched.name}
              className={touched.name && errors.name ? "border-red-400 focus-visible:ring-red-500" : undefined}
            />
            {touched.name && errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone <span className="text-red-500">*</span></label>
            <Input
              value={form.phone}
              onChange={(e) => handlePhoneChange(e.target.value, 'phone')}
              onBlur={() => markTouched("phone")}
              aria-invalid={!!errors.phone && touched.phone}
              className={touched.phone && errors.phone ? "border-red-400 focus-visible:ring-red-500" : undefined}
            />
            {touched.phone && errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Alt. Phone</label>
            <Input 
              value={form.altPhone}
              onChange={(e) => handlePhoneChange(e.target.value, 'altPhone')}
              onBlur={() => markTouched("altPhone")}
              aria-invalid={!!errors.altPhone && touched.altPhone}
              className={touched.altPhone && errors.altPhone ? "border-red-400 focus-visible:ring-red-500" : undefined}
            />
            {touched.altPhone && errors.altPhone && (
              <p className="mt-1 text-xs text-red-600">{errors.altPhone}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email <span className="text-red-500">*</span></label>
            <Input 
              type="email" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onBlur={() => markTouched("email")}
              aria-invalid={!!errors.email && touched.email}
              className={touched.email && errors.email ? "border-red-400 focus-visible:ring-red-500" : undefined}
            />
            {touched.email && errors.email ? (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            ) : null}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Alt. Email</label>
            <Input 
              type="email" 
              value={form.altEmail} 
              onChange={(e) => setForm({ ...form, altEmail: e.target.value })}
              onBlur={() => markTouched("altEmail")}
              aria-invalid={!!errors.altEmail && touched.altEmail}
              className={touched.altEmail && errors.altEmail ? "border-red-400 focus-visible:ring-red-500" : undefined}
            />
            {touched.altEmail && errors.altEmail && (
              <p className="mt-1 text-xs text-red-600">{errors.altEmail}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as LeadStatus })}>
              <SelectTrigger className="text-sm"><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent className="text-sm">
                {LEAD_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Qualification</label>
            <Select value={form.qualification} onValueChange={(v) => setForm({ ...form, qualification: v })}>
              <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
              <SelectContent className="text-sm">
                <SelectItem value="High School">High School</SelectItem>
                <SelectItem value="Bachelors">Bachelors</SelectItem>
                <SelectItem value="Masters">Masters</SelectItem>
                <SelectItem value="PhD">PhD</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Interest Field</label>
            <Select value={form.interestField} onValueChange={(v) => setForm({ ...form, interestField: v })}>
              <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
              <SelectContent className="text-sm">
                <SelectItem value="Web Development">Web Development</SelectItem>
                <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Source</label>
            <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
              <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
              <SelectContent className="text-sm">
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Social Media">Social Media</SelectItem>
                <SelectItem value="Cold Call">Cold Call</SelectItem>
                <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Assigned To</label>
            <Select value={form.assignedTo} onValueChange={(v) => setForm({ ...form, assignedTo: v })}>
              <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
              <SelectContent className="text-sm">
                <SelectItem value="John Doe">John Doe</SelectItem>
                <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                <SelectItem value="Robert Johnson">Robert Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Job Interest</label>
            <Input value={form.jobInterest} onChange={(e) => setForm({ ...form, jobInterest: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">State</label>
            <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">City</label>
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Passout Year</label>
            <Input value={form.passoutYear} onChange={(e) => setForm({ ...form, passoutYear: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Heard From</label>
            <Input value={form.heardFrom} onChange={(e) => setForm({ ...form, heardFrom: e.target.value })} />
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={() => setOpen(false)} className="text-sm">
            Cancel
          </Button>
          <Button type="submit" className="text-sm" disabled={!isValid} onClick={submit}>
            Add Lead
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
