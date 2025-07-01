
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
  departments as initialDepartments,
  subDepartments as initialSubDepartments,
} from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

type SubDepartment = (typeof initialSubDepartments)[0];
type Department = (typeof initialDepartments)[0];

export default function SubDepartmentsPage() {
  const { toast } = useToast();
  const [departments, setDepartments] = React.useState<Department[]>(initialDepartments);
  const [subDepartments, setSubDepartments] = React.useState<SubDepartment[]>(initialSubDepartments);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingSubDept, setEditingSubDept] = React.useState<SubDepartment | null>(null);
  const [subDeptName, setSubDeptName] = React.useState("");
  const [selectedDeptId, setSelectedDeptId] = React.useState("");

  const handleAddNew = () => {
    setEditingSubDept(null);
    setSubDeptName("");
    setSelectedDeptId("");
    setIsDialogOpen(true);
  };

  const handleEdit = (subDept: SubDepartment) => {
    setEditingSubDept(subDept);
    setSubDeptName(subDept.name);
    setSelectedDeptId(subDept.departmentId);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (subDeptId: string) => {
    setSubDepartments(subDepartments.filter((s) => s.id !== subDeptId));
    toast({
      title: "Sub-Department Deleted",
      description: "The sub-department has been removed.",
      variant: "destructive",
    });
  };

  const handleSave = () => {
    if (!subDeptName.trim() || !selectedDeptId) {
      toast({
        title: "Validation Error",
        description: "Sub-department name and parent department are required.",
        variant: "destructive",
      });
      return;
    }

    if (editingSubDept) {
      setSubDepartments(
        subDepartments.map((s) =>
          s.id === editingSubDept.id
            ? { ...s, name: subDeptName, departmentId: selectedDeptId }
            : s
        )
      );
      toast({
        title: "Sub-Department Updated",
        description: `Sub-Department "${subDeptName}" has been successfully updated.`,
      });
    } else {
      const newSubDept = {
        id: `sub-dept-${Date.now()}`,
        name: subDeptName,
        departmentId: selectedDeptId,
      };
      setSubDepartments([...subDepartments, newSubDept]);
      toast({
        title: "Sub-Department Added",
        description: `Sub-Department "${subDeptName}" has been successfully added.`,
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
              <CardTitle className="text-[13px]">Manage Sub-Departments</CardTitle>
              <CardDescription className="text-[12px]">
                Specific teams or units within a department.
              </CardDescription>
            </div>
            <Button size="sm" onClick={handleAddNew}>
              <Icons.Add className="mr-2 h-4 w-4" /> Add Sub-Department
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[12px]">Sub-Department Name</TableHead>
                <TableHead className="text-[12px]">Parent Department</TableHead>
                <TableHead className="text-right text-[12px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subDepartments.length > 0 ? (
                subDepartments.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium text-[11px]">{sub.name}</TableCell>
                    <TableCell className="text-[11px]">
                      {departments.find((d) => d.id === sub.departmentId)?.name || "N/A"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="ghost" size="sm" onClick={() => handleEdit(sub)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(sub.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      No sub-departments found. Click "Add Sub-Department" to create one.
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
            <DialogTitle>{editingSubDept ? 'Edit Sub-Department' : 'Add New Sub-Department'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sub-dept-dept" className="text-right text-[12px]">
                Department
              </Label>
              <Select value={selectedDeptId} onValueChange={setSelectedDeptId}>
                <SelectTrigger className="col-span-3 text-[11px]">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id} className="text-[11px]">
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sub-dept-name" className="text-right text-[12px]">
                Name
              </Label>
              <Input
                id="sub-dept-name"
                value={subDeptName}
                onChange={(e) => setSubDeptName(e.target.value)}
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
