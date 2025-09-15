import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, Menu } from "lucide-react";
import { 
  Squares2X2Icon, 
  UserGroupIcon, 
  CalendarDaysIcon, 
  ChartBarIcon, 
  CubeIcon, 
  BellIcon, 
  Cog6ToothIcon 
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const nav = [
  { label: "Dashboard", icon: Squares2X2Icon, to: "/dashboard" },
  { label: "Leads", icon: UserGroupIcon, to: "/" },
  { label: "Follow-Ups", icon: CalendarDaysIcon, to: "/follow-ups" },
  { label: "Sales Activity", icon: ChartBarIcon, to: "/sales-activity" },
  { label: "Products", icon: CubeIcon, to: "/products" },
  { label: "Notifications", icon: BellIcon, to: "/notifications" },
  { label: "Settings", icon: Cog6ToothIcon, to: "/settings" }
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-[100dvh]">
      <div className="flex min-h-[100dvh]">
        <aside
          className={cn(
            "sticky top-0 shrink-0 min-h-[100dvh] border-r bg-sidebar text-sidebar-foreground transition-all",
            open ? "w-60 sm:w-64" : "w-14 sm:w-16"
          )}
        >
          <div className={cn("flex items-center justify-between py-4 sm:py-6", open ? "px-3 sm:px-4" : "px-1 sm:px-2 justify-center")}>
            {open ? (
              <>
                <Link to="/" className="font-bold tracking-tight text-[16px] sm:text-[20px]">LeadCRM</Link>
                <button
                  className="rounded-md p-1.5 sm:p-2 hover:bg-sidebar-accent"
                  onClick={() => setOpen(false)}
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </>
            ) : (
              <button
                className="rounded-md hover:bg-sidebar-accent p-1 sm:p-0"
                onClick={() => setOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            )}
          </div>
          <Separator className={cn(open ? "mx-3 sm:mx-4" : "mx-1 sm:mx-2")} />
          <nav className={cn("pb-3 pt-3 sm:pb-4 sm:pt-4", open ? "px-3 sm:px-4" : "px-1 sm:px-2")}>
            {nav.map((item) => {
              const Icon = item.icon;
              const active =
                item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
              return (
                <Link
                  to={item.to}
                  key={item.to}
                  className={cn(
                    "relative flex items-center gap-2 sm:gap-3 rounded-md px-2 sm:px-3 text-[13px] sm:text-[15px] leading-4 sm:leading-5 mb-1.5 sm:mb-2",
                    open ? "h-9 sm:h-10" : "h-10 sm:h-12 justify-center",
                    active
                      ? "bg-sidebar-accent text-sidebar-foreground font-semibold"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground font-medium",
                  )}
                >
                  {active && <span className="absolute left-0 h-4 sm:h-5 w-0.5 rounded bg-primary" />}
                  <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", !open && "h-6 w-6 sm:h-12 sm:w-12")} />
                  {open && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 min-h-[100dvh]">
          {children}
        </main>
      </div>
    </div>
  );
}
