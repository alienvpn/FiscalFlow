"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { menuItems } from "@/lib/navigation";

const reportLinks = menuItems.find(item => item.title === "Reports")?.links || [];
// We filter out the overview page from being displayed as a card on itself.
const reportItems = reportLinks.filter(link => link.href !== '/reports');

export default function ReportsHubPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-[14px] font-bold tracking-tight mb-2">
        Reports Center
      </h2>
      <p className="text-muted-foreground mb-6 text-[12px]">
        Select a category to view a specific report.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportItems.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="text-[13px]">{item.title}</CardTitle>
              <CardDescription className="text-[12px]">{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={item.href}>
                <Button variant="outline" size="sm">
                  View Report <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
