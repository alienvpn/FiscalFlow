import {
  LayoutDashboard,
  Briefcase,
  Coins,
  FileText,
  Lightbulb,
  Database,
  type Icon as LucideIcon,
  LoaderCircle,
  PlusCircle,
  Trash2,
  Building2,
  ClipboardList,
  ClipboardPlus,
  ClipboardEdit,
  Users,
  UserPlus,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  Dashboard: LayoutDashboard,
  Capex: Briefcase,
  Opex: Coins,
  Contracts: FileText,
  Forecasting: Lightbulb,
  Enterprise: Database,
  Vendors: Building2,
  Registry: ClipboardList,
  CapexRegistry: ClipboardPlus,
  OpexRegistry: ClipboardEdit,
  Spinner: LoaderCircle,
  Add: PlusCircle,
  Delete: Trash2,
  Users: Users,
  UserPlus: UserPlus,
};
