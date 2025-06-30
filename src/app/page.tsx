import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons, type Icon } from "@/components/icons";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const modules: {
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

export default function HomePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">FiscalFlow</h1>
        <p className="text-muted-foreground mt-2">
          Your central hub for budget and contract management.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {modules.map((item) => {
          const ItemIcon = item.icon;
          return (
            <Card
              key={item.title}
              className="flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <ItemIcon className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {item.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={item.href}>
                  <Button variant="outline" size="sm" className="w-full">
                    Go to {item.title} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
