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
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  Dashboard: LayoutDashboard,
  Capex: Briefcase,
  Opex: Coins,
  Contracts: FileText,
  Forecasting: Lightbulb,
  MasterData: Database,
  Vendors: Building2,
  Spinner: LoaderCircle,
  Add: PlusCircle,
  Delete: Trash2,
};
