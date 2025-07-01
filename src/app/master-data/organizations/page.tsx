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
  groups,
  organizations,
} from "@/lib/mock-data";

export default function OrganizationsPage() {
  const getGroupName = (groupId: string) => {
    return groups.find((g) => g.id === groupId)?.name || `ID not found: ${groupId}`;
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="text-[13px]">Manage Organizations</CardTitle>
            <CardDescription className="text-[12px]">
              Business units under a group. Data is managed in src/lib/mock-data.ts.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[12px]">Organization Name</TableHead>
                <TableHead className="text-[12px]">Organization ID</TableHead>
                <TableHead className="text-[12px]">Parent Group</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.length > 0 ? (
                organizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium text-[11px]">{org.name}</TableCell>
                    <TableCell className="text-[11px] font-mono">{org.id}</TableCell>
                    <TableCell className="text-[11px]">
                      {getGroupName(org.groupId)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                 <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                        No organizations found. Add data to src/lib/mock-data.ts and refresh.
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
