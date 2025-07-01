
"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  pendingApprovals as initialPendingApprovals,
  organizations,
  departments,
} from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import type { ApprovalItem } from "@/lib/types";

export default function ApprovalInboxPage() {
  const { toast } = useToast();
  const [approvals, setApprovals] = React.useState<ApprovalItem[]>(initialPendingApprovals);

  const handleApprove = (id: string) => {
    toast({
      title: "Sheet Approved",
      description: `The budget sheet has been approved.`,
    });
    setApprovals(approvals.filter((a) => a.id !== id));
  };

  const handleReject = (id: string) => {
    toast({
      title: "Sheet Rejected",
      description: `The budget sheet has been rejected and sent back to the originator.`,
      variant: "destructive",
    });
    setApprovals(approvals.filter((a) => a.id !== id));
  };
  
  const getDepartmentName = (id: string) => departments.find(d => d.id === id)?.name || "N/A";
  const getOrganizationName = (id: string) => {
      const dept = departments.find(d => d.id === id);
      if(dept) {
        return organizations.find(o => o.id === dept.organizationId)?.name || `ID: ${id}`
      }
      return organizations.find(o => o.id === id)?.name || `ID: ${id}`;
  }


  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-[14px] font-bold tracking-tight mb-2 print:text-[12px]">
        Approval Inbox
      </h2>
      <p className="text-muted-foreground mb-6 text-[12px] print:text-[10px]">
        Review and process submitted budget sheets pending your approval.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-[13px]">Pending Items</CardTitle>
          <CardDescription className="text-[12px]">
            {approvals.length} sheet(s) require your attention.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Organization / Department</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Total Value (QAR)</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvals.length > 0 ? (
                approvals.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant={item.type === 'CAPEX' ? 'default' : 'secondary'}>{item.type}</Badge>
                    </TableCell>
                    <TableCell className="text-[11px] font-medium">
                      <div>{getOrganizationName(item.organizationId)}</div>
                      <div className="text-muted-foreground">{getDepartmentName(item.departmentId)}</div>
                    </TableCell>
                    <TableCell className="text-[11px]">{item.year}</TableCell>
                    <TableCell className="text-[11px] font-semibold">{item.totalValue.toLocaleString()}</TableCell>
                    <TableCell className="text-[11px]">{item.submittedBy}</TableCell>
                    <TableCell className="text-[11px]">{format(item.submittedOn, "PPP p")}</TableCell>
                    <TableCell><Badge variant="outline">{item.status}</Badge></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline">View Sheet</Button>
                      <Button size="sm" onClick={() => handleApprove(item.id)}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(item.id)}>Reject</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    Your inbox is clear. No items are pending your approval.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
