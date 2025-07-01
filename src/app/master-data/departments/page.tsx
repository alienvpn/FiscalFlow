
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  departments as initialDepartments,
  organizations as initialOrganizations,
} from "@/lib/mock-data";

export default function DepartmentsPage() {

  const getOrganizationName = (orgId: string) => {
    return initialOrganizations.find((o) => o.id === orgId)?.name || `ID not found: ${orgId}`;
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-[13px]">Manage Departments</CardTitle>
          <CardDescription className="text-[12px]">
            Functional divisions within an organization. Data is managed in `src/lib/mock-data.ts`.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[12px]">Department Name</TableHead>
                <TableHead className="text-[12px]">Department ID</TableHead>
                <TableHead className="text-[12px]">Parent Organization</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialDepartments.length > 0 ? (
                initialDepartments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium text-[11px]">{dept.name}</TableCell>
                    <TableCell className="text-[11px] font-mono">{dept.id}</TableCell>
                    <TableCell className="text-[11px]">{getOrganizationName(dept.organizationId)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No departments found in `src/lib/mock-data.ts`.
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
