import { Icons, type Icon } from "@/components/icons";

type NavLink = {
  title: string;
  href: string;
  icon: Icon;
  description: string;
};

export const menuItems: {
  title: string;
  links: NavLink[];
}[] = [
  {
    title: "Master",
    links: [
      {
        title: "Create Enterprise",
        href: "/master-data/company-profile",
        icon: Icons.Enterprise,
        description: "Manage core company, vendor, and organizational data.",
      },
      {
        title: "Create User",
        href: "/master-data/users",
        icon: Icons.UserPlus,
        description: "Create and manage application users and their permissions.",
      },
      {
        title: "Create Items/Devices/Services",
        href: "/item-registry",
        icon: Icons.Registry,
        description: "Register new devices, items, or services.",
      },
      {
        title: "Vendor",
        href: "/master-data/vendors",
        icon: Icons.Vendors,
        description: "Manage supplier and service provider information.",
      },
    ],
  },
  {
    title: "Budgeting",
    links: [
      {
        title: "CAPEX Registry",
        href: "/capex-registry",
        icon: Icons.CapexRegistry,
        description: "Create and manage yearly CAPEX sheets.",
      },
      {
        title: "OPEX Registry",
        href: "/opex-registry",
        icon: Icons.OpexRegistry,
        description: "Create and manage yearly OPEX sheets.",
      },
    ],
  },
  {
    title: "Contract Management",
    links: [
      {
        title: "Contracts",
        href: "/contracts",
        icon: Icons.Contracts,
        description: "Store and manage contracts, SLAs, and AMCs.",
      },
    ],
  },
  {
    title: "Reports",
    links: [
      {
        title: "CAPEX Report",
        href: "/reports/capex",
        icon: Icons.Capex,
        description: "View detailed reports on capital expenditures.",
      },
      {
        title: "OPEX Report",
        href: "/reports/opex",
        icon: Icons.Opex,
        description: "View detailed reports on operational expenditures.",
      },
      {
        title: "Contract Report",
        href: "/reports/contracts",
        icon: Icons.Contracts,
        description: "View reports on active and expired contracts.",
      },
      {
        title: "Vendor Report",
        href: "/reports/vendors",
        icon: Icons.Vendors,
        description: "View reports on supplier and vendor data.",
      },
    ],
  },
];

// Helper to get all modules for the home page
export const allModules: NavLink[] = [
  {
    title: "Executive Dashboard",
    href: "/dashboard",
    icon: Icons.Dashboard,
    description: "View key metrics, charts, and financial summaries.",
  },
  ...menuItems.flatMap((item) => item.links),
  {
    title: "CAPEX Analysis",
    href: "/capex-analysis",
    icon: Icons.Capex,
    description: "Compare capital expenditure quotes using AI.",
  },
  {
    title: "OPEX Tracker",
    href: "/opex-tracker",
    icon: Icons.Opex,
    description: "Log and categorize operational expenses for tracking.",
  },
  {
    title: "Budget Forecasting",
    href: "/budget-forecasting",
    icon: Icons.Forecasting,
    description: "Predict future budgetary needs with AI.",
  },
];
