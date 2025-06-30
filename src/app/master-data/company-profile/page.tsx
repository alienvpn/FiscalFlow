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

// Mock Data
const initialGroups = [{ id: "grp-1", name: "Global Tech Inc." }];
const initialOrganizations = [
  { id: "org-1", name: "Qatar Branch", groupId: "grp-1" },
];
const initialDepartments = [
  { id: "dept-1", name: "IT Division", organizationId: "org-1" },
];
const initialSubDepartments = [
  { id: "sub-dept-1", name: "Infrastructure", departmentId: "dept-1" },
];

export default function CompanyProfilePage() {
  const [groups, setGroups] = React.useState(initialGroups);
  const [organizations, setOrganizations] =
    React.useState(initialOrganizations);
  const [departments, setDepartments] = React.useState(initialDepartments);
  const [subDepartments, setSubDepartments] = React.useState(
    initialSubDepartments
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-[14px] font-bold tracking-tight mb-2">
        Company Profile
      </h2>
      <p className="text-muted-foreground mb-6 text-[12px]">
        Manage the organizational structure including groups, organizations,
        departments, and sub-departments.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Groups Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-[13px]">Groups</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Icons.Add className="mr-2 h-4 w-4" /> Add Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Group</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="group-name"
                        className="text-right text-[12px]"
                      >
                        Name
                      </Label>
                      <Input
                        id="group-name"
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
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <CardDescription className="text-[12px]">
              Top-level entities in your organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[12px]">Group Name</TableHead>
                  <TableHead className="text-right text-[12px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium text-[11px]">
                      {group.name}
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

        {/* Organizations Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-[13px]">Organizations</CardTitle>
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
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <CardDescription className="text-[12px]">
              Business units under a group.
            </CardDescription>
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

        {/* Departments Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-[13px]">Departments</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Icons.Add className="mr-2 h-4 w-4" /> Add Department
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Department</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="dept-org"
                        className="text-right text-[12px]"
                      >
                        Organization
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3 text-[11px]">
                          <SelectValue placeholder="Select an organization" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations.map((o) => (
                            <SelectItem
                              key={o.id}
                              value={o.id}
                              className="text-[11px]"
                            >
                              {o.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="dept-name"
                        className="text-right text-[12px]"
                      >
                        Name
                      </Label>
                      <Input
                        id="dept-name"
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
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <CardDescription className="text-[12px]">
              Functional divisions within an organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[12px]">Department Name</TableHead>
                  <TableHead className="text-[12px]">
                    Parent Organization
                  </TableHead>
                  <TableHead className="text-right text-[12px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium text-[11px]">
                      {dept.name}
                    </TableCell>
                    <TableCell className="text-[11px]">
                      {
                        organizations.find(
                          (o) => o.id === dept.organizationId
                        )?.name
                      }
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

        {/* Sub-Departments Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-[13px]">Sub-Departments</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Icons.Add className="mr-2 h-4 w-4" /> Add Sub-Department
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Sub-Department</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="sub-dept-dept"
                        className="text-right text-[12px]"
                      >
                        Department
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3 text-[11px]">
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((d) => (
                            <SelectItem
                              key={d.id}
                              value={d.id}
                              className="text-[11px]"
                            >
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="sub-dept-name"
                        className="text-right text-[12px]"
                      >
                        Name
                      </Label>
                      <Input
                        id="sub-dept-name"
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
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <CardDescription className="text-[12px]">
              Specific teams or units within a department.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[12px]">
                    Sub-Department Name
                  </TableHead>
                  <TableHead className="text-[12px]">
                    Parent Department
                  </TableHead>
                  <TableHead className="text-right text-[12px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subDepartments.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium text-[11px]">
                      {sub.name}
                    </TableCell>
                    <TableCell className="text-[11px]">
                      {
                        departments.find((d) => d.id === sub.departmentId)
                          ?.name
                      }
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
    </div>
  );
}
