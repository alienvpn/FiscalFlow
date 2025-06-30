import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ContractReportPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-sm font-bold tracking-tight mb-2 print:text-[12px]">
        Contract Report
      </h2>
      <p className="text-muted-foreground mb-6 print:text-[10px]">
        View reports on active and expired contracts.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Contract Report Details</CardTitle>
          <CardDescription>
            Detailed analysis of contracts will be displayed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Report content is under development.</p>
        </CardContent>
      </Card>
    </div>
  );
}
