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

const initialDepartments = [
  { id: "dept-1", name: "IT Division", organizationId: "org-1" },
];
const initialSubDepartments = [
  { id: "sub-dept-1", name: "Infrastructure", departmentId: "dept-1" },
];

export default function SubDepartmentsPage() {
  const [departments, setDepartments] = React.useState(initialDepartments);
  const [subDepartments, setSubDepartments] = React.useState(
    initialSubDepartments
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-[13px]">Manage Sub-Departments</CardTitle>
              <CardDescription className="text-[12px]">
                Specific teams or units within a department.
              </CardDescription>
            </div>
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
  );
}
