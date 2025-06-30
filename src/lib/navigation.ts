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
    title: "Approvals",
    links: [
      {
        title: "Approval Inbox",
        href: "/approvals/inbox",
        icon: Icons.Approvals,
        description: "Review and approve submitted budget sheets.",
      },
    ],
  },
  {
    title: "Reports",
    links: [
      {
        title: "Reports Overview",
        href: "/reports",
        icon: Icons.Reports,
        description: "An overview of all available reports.",
      },
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
  {
    title: "Settings",
    links: [
      {
        title: "User Registration",
        href: "/settings/user-registration",
        icon: Icons.UserPlus,
        description: "Create and manage user accounts and permissions.",
      },
      {
        title: "Approval Matrix",
        href: "/settings/approval-matrix",
        icon: Icons.Users,
        description: "Configure the approval workflow and levels.",
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
].filter((v,i,a)=>a.findIndex(v2=>(v2.href===v.href))===i); // Make unique
