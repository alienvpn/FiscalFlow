import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function CapexReportPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-sm font-bold tracking-tight mb-2">
        CAPEX Report
      </h2>
      <p className="text-muted-foreground mb-6">
        View detailed reports on capital expenditures.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>CAPEX Report Details</CardTitle>
          <CardDescription>
            Detailed analysis of capital expenditures will be displayed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Report content is under development.</p>
        </CardContent>
      </Card>
    </div>
  );
}
