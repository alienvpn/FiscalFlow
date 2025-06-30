"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const structureItems = [
  {
    title: "Groups",
    description: "Manage top-level entities in your organization.",
    href: "/master-data/groups",
  },
  {
    title: "Organizations",
    description: "Manage business units under a group.",
    href: "/master-data/organizations",
  },
  {
    title: "Departments",
    description: "Manage functional divisions within an organization.",
    href: "/master-data/departments",
  },
  {
    title: "Sub-Departments",
    description: "Manage specific teams or units within a department.",
    href: "/master-data/sub-departments",
  },
  {
    title: "Suppliers / Vendors",
    description: "Manage suppliers, vendors, and service providers.",
    href: "/master-data/vendors",
  },
];

export default function CompanyProfilePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-[14px] font-bold tracking-tight mb-2 print:text-[12px]">
        Create Enterprise
      </h2>
      <p className="text-muted-foreground mb-6 text-[12px] print:text-[10px]">
        Select a category to manage your master data.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {structureItems.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="text-[13px]">{item.title}</CardTitle>
              <CardDescription className="text-[12px]">{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={item.href}>
                <Button variant="outline" size="sm">
                  Manage {item.title} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
