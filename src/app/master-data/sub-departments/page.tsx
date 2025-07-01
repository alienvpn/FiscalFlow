"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  departments,
  subDepartments,
} from "@/lib/mock-data";

export default function SubDepartmentsPage() {
  const getDepartmentName = (deptId: string) => {
    return departments.find((d) => d.id === deptId)?.name || `ID not found: ${deptId}`;
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="text-[13px]">Manage Sub-Departments</CardTitle>
            <CardDescription className="text-[12px]">
              Specific teams or units within a department. Data is managed in src/lib/mock-data.ts.
            </CardDescription>
          </div>
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
              {subDepartments.length > 0 ? (
                subDepartments.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium text-[11px]">{sub.name}</TableCell>
                    <TableCell className="text-[11px] font-mono">{sub.id}</TableCell>
                    <TableCell className="text-[11px]">
                      {getDepartmentName(sub.departmentId)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      No sub-departments found. Add data to src/lib/mock-data.ts and refresh.
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
