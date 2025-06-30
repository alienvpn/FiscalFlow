import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function VendorReportPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-sm font-bold tracking-tight mb-2">
        Vendor Report
      </h2>
      <p className="text-muted-foreground mb-6">
        View reports on supplier and vendor data.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Vendor Report Details</CardTitle>
          <CardDescription>
            Detailed analysis of vendors will be displayed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Report content is under development.</p>
        </CardContent>
      </Card>
    </div>
  );
}
