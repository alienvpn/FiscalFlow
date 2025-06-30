
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
import { Badge } from "@/components/ui/badge";
import { mockUsers } from "@/lib/mock-data";
import { menuItems } from "@/lib/navigation";

const getModuleTitle = (href: string) => {
  const allLinks = menuItems.flatMap(item => item.links);
  const module = allLinks.find(link => link.href === href);
  return module ? module.title : href.replace('/', '').replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const permissionColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  full: "default",
  write: "secondary",
  read: "outline",
  none: "destructive",
};

export default function UserAccessRightsReportPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-sm font-bold tracking-tight mb-2">
        User Access Rights Report
      </h2>
      <p className="text-muted-foreground mb-6">
        An overview of user roles and their permissions across different modules.
      </p>
      <Card>
        <CardHeader>
          <CardTitle className="text-[13px]">User Permissions</CardTitle>
          <CardDescription className="text-[12px]">
            The table below shows the access level for each user and module.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Approval Role</TableHead>
                  <TableHead>Permissions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-[11px] align-top">{user.username}</TableCell>
                    <TableCell className="text-[11px] align-top">{user.email}</TableCell>
                    <TableCell className="align-top">
                      {user.userRole ? <Badge variant="secondary">{user.userRole}</Badge> : <span className="text-muted-foreground text-[11px]">N/A</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        {Object.entries(user.permissions).map(([moduleHref, permission]) => (
                           permission !== 'none' && (
                            <div key={moduleHref} className="flex items-center justify-between text-[11px]">
                              <span>{getModuleTitle(moduleHref)}</span>
                              <Badge variant={permissionColors[permission] || "outline"} className="capitalize text-[10px]">
                                {permission}
                              </Badge>
                            </div>
                           )
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
