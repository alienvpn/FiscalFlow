
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
  DialogFooter,
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
import {
  organizations as initialOrganizations,
  departments as initialDepartments,
} from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

type Department = (typeof initialDepartments)[0];
type Organization = (typeof initialOrganizations)[0];

export default function DepartmentsPage() {
  const { toast } = useToast();
  const [organizations, setOrganizations] =
    React.useState<Organization[]>(initialOrganizations);
  const [departments, setDepartments] = React.useState<Department[]>(initialDepartments);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingDept, setEditingDept] = React.useState<Department | null>(null);
  const [deptName, setDeptName] = React.useState("");
  const [selectedOrgId, setSelectedOrgId] = React.useState("");
  
  const handleAddNew = () => {
    setEditingDept(null);
    setDeptName("");
    setSelectedOrgId("");
    setIsDialogOpen(true);
  };

  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    setDeptName(dept.name);
    setSelectedOrgId(dept.organizationId);
    setIsDialogOpen(true);
  };

  const handleDelete = (deptId: string) => {
    setDepartments(departments.filter((d) => d.id !== deptId));
    toast({
      title: "Department Deleted",
      description: "The department has been removed.",
      variant: "destructive",
    });
  };

  const handleSave = () => {
    if (!deptName.trim() || !selectedOrgId) {
      toast({
        title: "Validation Error",
        description: "Department name and organization are required.",
        variant: "destructive",
      });
      return;
    }

    if (editingDept) {
      setDepartments(
        departments.map((d) =>
          d.id === editingDept.id
            ? { ...d, name: deptName, organizationId: selectedOrgId }
            : d
        )
      );
      toast({
        title: "Department Updated",
        description: `Department "${deptName}" has been successfully updated.`,
      });
    } else {
      const newDept = {
        id: `dept-${Date.now()}`,
        name: deptName,
        organizationId: selectedOrgId,
      };
      setDepartments([...departments, newDept]);
      toast({
        title: "Department Added",
        description: `Department "${deptName}" has been successfully added.`,
      });
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-[13px]">Manage Departments</CardTitle>
              <CardDescription className="text-[12px]">
                Functional divisions within an organization.
              </CardDescription>
            </div>
            <Button size="sm" onClick={handleAddNew}>
              <Icons.Add className="mr-2 h-4 w-4" /> Add Department
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[12px]">Department Name</TableHead>
                <TableHead className="text-[12px]">Parent Organization</TableHead>
                <TableHead className="text-right text-[12px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium text-[11px]">{dept.name}</TableCell>
                    <TableCell className="text-[11px]">
                      {organizations.find((o) => o.id === dept.organizationId)?.name || `ID: ${dept.organizationId}`}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(dept)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(dept.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No departments found. Click "Add Department" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDept ? 'Edit Department' : 'Add New Department'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dept-org" className="text-right text-[12px]">
                Organization
              </Label>
              <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                <SelectTrigger className="col-span-3 text-[11px]">
                  <SelectValue placeholder="Select an organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((o) => (
                    <SelectItem key={o.id} value={o.id} className="text-[11px]">
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dept-name" className="text-right text-[12px]">
                Name
              </Label>
              <Input
                id="dept-name"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                className="col-span-3 text-[11px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>Save Data</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
