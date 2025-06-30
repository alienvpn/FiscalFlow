import {
  LayoutDashboard,
  Briefcase,
  Coins,
  FileText,
  Lightbulb,
  type Icon as LucideIcon,
  LoaderCircle,
  PlusCircle,
  Trash2,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  Dashboard: LayoutDashboard,
  Capex: Briefcase,
  Opex: Coins,
  Contracts: FileText,
  Forecasting: Lightbulb,
  Spinner: LoaderCircle,
  Add: PlusCircle,
  Delete: Trash2,
};
