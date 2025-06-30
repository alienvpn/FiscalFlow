import { Icons, type Icon } from "@/components/icons";

export const modules: {
  title: string;
  description: string;
  href: string;
  icon: Icon;
}[] = [
  {
    title: "Executive Dashboard",
    description: "View key metrics, charts, and financial summaries.",
    href: "/dashboard",
    icon: Icons.Dashboard,
  },
  {
    title: "CAPEX Analysis",
    description: "Compare capital expenditure quotes using AI.",
    href: "/capex-analysis",
    icon: Icons.Capex,
  },
  {
    title: "OPEX Tracker",
    description: "Log and categorize operational expenses for tracking.",
    href: "/opex-tracker",
    icon: Icons.Opex,
  },
  {
    title: "OPEX Registry",
    description: "Create and manage yearly OPEX sheets.",
    href: "/opex-registry",
    icon: Icons.OpexRegistry,
  },
  {
    title: "Contracts",
    description: "Store and manage contracts, SLAs, and AMCs.",
    href: "/contracts",
    icon: Icons.Contracts,
  },
  {
    title: "Budget Forecasting",
    description: "Predict future budgetary needs with AI.",
    href: "/budget-forecasting",
    icon: Icons.Forecasting,
  },
  {
    title: "CAPEX Registry",
    description: "Create and manage yearly CAPEX sheets.",
    href: "/capex-registry",
    icon: Icons.CapexRegistry,
  },
  {
    title: "Device/Item/Service Registry",
    description: "Register new devices, items, or services.",
    href: "/item-registry",
    icon: Icons.Registry,
  },
  {
    title: "Master Data",
    description: "Manage core company, vendor, and organizational data.",
    href: "/master-data/company-profile",
    icon: Icons.MasterData,
  },
  {
    title: "Vendors",
    description: "Manage supplier and service provider information.",
    href: "/master-data/vendors",
    icon: Icons.Vendors,
  },
];
