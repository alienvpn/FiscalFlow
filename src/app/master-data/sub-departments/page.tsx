
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
  subDepartments as initialSubDepartments,
  departments as initialDepartments,
} from "@/lib/mock-data";

export default function SubDepartmentsPage() {
  const getDepartmentName = (deptId: string) => {
    return initialDepartments.find((d) => d.id === deptId)?.name || `ID not found: ${deptId}`;
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-[13px]">Manage Sub-Departments</CardTitle>
          <CardDescription className="text-[12px]">
            Specific teams or units within a department. Data is managed in `src/lib/mock-data.ts`.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[12px]">Sub-Department Name</TableHead>
                <TableHead className="text-[12px]">Sub-Department ID</TableHead>
                <TableHead className="text-[12px]">Parent Department</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialSubDepartments.length > 0 ? (
                initialSubDepartments.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium text-[11px]">{sub.name}</TableCell>
                    <TableCell className="text-[11px] font-mono">{sub.id}</TableCell>
                    <TableCell className="text-[11px]">{getDepartmentName(sub.departmentId)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No sub-departments found in `src/lib/mock-data.ts`.
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
