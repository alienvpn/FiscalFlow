
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
import { groups as initialGroups } from "@/lib/mock-data";

export default function GroupsPage() {

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-[13px]">Manage Groups</CardTitle>
          <CardDescription className="text-[12px]">
            Top-level entities in your organization. Data is managed in `src/lib/mock-data.ts`.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[12px]">Group Name</TableHead>
                <TableHead className="text-[12px]">Group ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialGroups.length > 0 ? (
                initialGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium text-[11px]">{group.name}</TableCell>
                    <TableCell className="text-[11px] font-mono">{group.id}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                    No groups found in `src/lib/mock-data.ts`.
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
