
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useData } from "@/context/data-context";
import { Icons } from "@/components/icons";
import { subDepartmentSchema, type SubDepartmentFormValues, type SubDepartment } from "@/lib/types";

export default function SubDepartmentsPage() {
  const { subDepartments, setSubDepartments, departments } = useData();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingSubDept, setEditingSubDept] = React.useState<SubDepartment | null>(null);

  const form = useForm<SubDepartmentFormValues>({
    resolver: zodResolver(subDepartmentSchema),
    defaultValues: { name: "", departmentId: "" },
  });
  
  React.useEffect(() => {
    if (editingSubDept) {
      form.reset(editingSubDept);
    } else {
      form.reset({ name: "", departmentId: "" });
    }
  }, [editingSubDept, form, isDialogOpen]);

  const getDepartmentName = (deptId: string) => {
    return departments.find((d) => d.id === deptId)?.name || "N/A";
  };
  
  const handleAddNew = () => {
    setEditingSubDept(null);
    setIsDialogOpen(true);
  };
  
  const handleEdit = (subDept: SubDepartment) => {
    setEditingSubDept(subDept);
    setIsDialogOpen(true);
  };

  const handleDelete = (subDeptId: string) => {
    setSubDepartments(subDepartments.filter(sd => sd.id !== subDeptId));
  };

  const onSubmit = (values: SubDepartmentFormValues) => {
    if (editingSubDept) {
      setSubDepartments(subDepartments.map(sd => sd.id === editingSubDept.id ? {...values, id: sd.id} : sd));
    } else {
      setSubDepartments([...subDepartments, { ...values, id: `sub-dept-${Date.now()}` }]);
    }
    setIsDialogOpen(false);
    setEditingSubDept(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-[13px]">Manage Sub-Departments</CardTitle>
              <CardDescription className="text-[12px]">
                Specific teams or units within a department.
              </CardDescription>
            </div>
            <Button onClick={handleAddNew} size="sm" disabled={departments.length === 0}>
                <Icons.Add className="mr-2"/> Add New Sub-Department
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[12px]">Sub-Department Name</TableHead>
                <TableHead className="text-[12px]">Sub-Department ID</TableHead>
                <TableHead className="text-[12px]">Parent Department</TableHead>
                <TableHead className="text-right text-[12px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subDepartments.length > 0 ? (
                subDepartments.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium text-[11px]">{sub.name}</TableCell>
                    <TableCell className="text-[11px] font-mono">{sub.id}</TableCell>
                    <TableCell className="text-[11px]">{getDepartmentName(sub.departmentId)}</TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(sub)}>Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(sub.id)}><Icons.Delete className="h-4 w-4"/></Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No sub-departments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingSubDept ? "Edit Sub-Department" : "Add New Sub-Department"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-Department Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Network Team" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">{editingSubDept ? "Save Changes" : "Create Sub-Department"}</Button>
              </DialogFooter>
            </form>
          </Form>
      </DialogContent>
      </Dialog>
    </div>
  );
}
