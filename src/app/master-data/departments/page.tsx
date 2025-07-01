
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
import { departmentSchema, type DepartmentFormValues, type Department } from "@/lib/types";

export default function DepartmentsPage() {
  const { departments, setDepartments, organizations } = useData();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingDept, setEditingDept] = React.useState<Department | null>(null);
  const [isClient, setIsClient] = React.useState(false);

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: { name: "", organizationId: "" },
  });
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  React.useEffect(() => {
    if (editingDept) {
      form.reset(editingDept);
    } else {
      form.reset({ name: "", organizationId: "" });
    }
  }, [editingDept, form, isDialogOpen]);

  const getOrganizationName = (orgId: string) => {
    return organizations.find((o) => o.id === orgId)?.name || "N/A";
  };
  
  const handleAddNew = () => {
    setEditingDept(null);
    setIsDialogOpen(true);
  };
  
  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    setIsDialogOpen(true);
  };

  const handleDelete = (deptId: string) => {
    setDepartments(departments.filter(d => d.id !== deptId));
  };

  const onSubmit = (values: DepartmentFormValues) => {
    if (editingDept) {
      setDepartments(departments.map(d => d.id === editingDept.id ? {...values, id: d.id} : d));
    } else {
      setDepartments([...departments, { ...values, id: `dept-${Date.now()}` }]);
    }
    setIsDialogOpen(false);
    setEditingDept(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-[13px]">Manage Departments</CardTitle>
              <CardDescription className="text-[12px]">
                Functional divisions within an organization.
              </CardDescription>
            </div>
            <Button onClick={handleAddNew} size="sm" disabled={organizations.length === 0}>
                <Icons.Add className="mr-2"/> Add New Department
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[12px]">Department Name</TableHead>
                <TableHead className="text-[12px]">Department ID</TableHead>
                <TableHead className="text-[12px]">Parent Organization</TableHead>
                <TableHead className="text-right text-[12px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isClient ? (
                departments.length > 0 ? (
                  departments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium text-[11px]">{dept.name}</TableCell>
                      <TableCell className="text-[11px] font-mono">{dept.id}</TableCell>
                      <TableCell className="text-[11px]">{getOrganizationName(dept.organizationId)}</TableCell>
                      <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(dept)}>Edit</Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(dept.id)}><Icons.Delete className="h-4 w-4"/></Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No departments found.
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        Loading...
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingDept ? "Edit Department" : "Add New Department"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Information Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="organizationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Organization</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an organization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {organizations.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
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
                <Button type="submit">{editingDept ? "Save Changes" : "Create Department"}</Button>
              </DialogFooter>
            </form>
          </Form>
      </DialogContent>
      </Dialog>
    </div>
  );
}
