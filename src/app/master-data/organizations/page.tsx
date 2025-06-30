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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/icons";

const initialGroups = [{ id: "grp-1", name: "Global Tech Inc." }];
const initialOrganizations = [
  { id: "org-1", name: "Qatar Branch", groupId: "grp-1" },
];

export default function OrganizationsPage() {
  const [groups, setGroups] = React.useState(initialGroups);
  const [organizations, setOrganizations] =
    React.useState(initialOrganizations);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-[13px]">Manage Organizations</CardTitle>
              <CardDescription className="text-[12px]">
                Business units under a group.
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Icons.Add className="mr-2 h-4 w-4" /> Add Organization
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Organization</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="org-group"
                      className="text-right text-[12px]"
                    >
                      Group
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3 text-[11px]">
                        <SelectValue placeholder="Select a group" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((g) => (
                          <SelectItem
                            key={g.id}
                            value={g.id}
                            className="text-[11px]"
                          >
                            {g.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="org-name"
                      className="text-right text-[12px]"
                    >
                      Name
                    </Label>
                    <Input
                      id="org-name"
                      className="col-span-3 text-[11px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Update</Button>
                  <Button type="submit">Save Data</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[12px]">
                  Organization Name
                </TableHead>
                <TableHead className="text-[12px]">Parent Group</TableHead>
                <TableHead className="text-right text-[12px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium text-[11px]">
                    {org.name}
                  </TableCell>
                  <TableCell className="text-[11px]">
                    {groups.find((g) => g.id === org.groupId)?.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
