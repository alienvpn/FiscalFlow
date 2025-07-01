
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
  organizations as initialOrganizations,
  groups as initialGroups,
} from "@/lib/mock-data";

export default function OrganizationsPage() {

  const getGroupName = (groupId: string) => {
    return initialGroups.find((g) => g.id === groupId)?.name || `ID not found: ${groupId}`;
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-[13px]">Manage Organizations</CardTitle>
          <CardDescription className="text-[12px]">
            Business units under a group. Data is managed in `src/lib/mock-data.ts`.
          </CardDescription>
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
              {initialOrganizations.length > 0 ? (
                initialOrganizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium text-[11px]">{org.name}</TableCell>
                    <TableCell className="text-[11px] font-mono">{org.id}</TableCell>
                    <TableCell className="text-[11px]">{getGroupName(org.groupId)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No organizations found in `src/lib/mock-data.ts`.
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
