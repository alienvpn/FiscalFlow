
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
import { Input } from "@/components/ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  subDepartmentSchema,
  type SubDepartment,
  type SubDepartmentFormValues,
} from "@/lib/types";
import {
  subDepartments as initialSubDepartments,
  departments as initialDepartments,
} from "@/lib/mock-data";

export default function SubDepartmentsPage() {
  const { toast } = useToast();
  const [subDepartments, setSubDepartments] = React.useState<SubDepartment[]>(initialSubDepartments);
  const [editingSubDeptId, setEditingSubDeptId] = React.useState<string | null>(null);

  // Statically load departments for the dropdown
  const departments = initialDepartments;

  const form = useForm<SubDepartmentFormValues>({
    resolver: zodResolver(subDepartmentSchema),
    defaultValues: {
      name: "",
      departmentId: "",
    },
  });

  const getDepartmentName = (deptId: string) => {
    return departments.find((d) => d.id === deptId)?.name || `ID not found: ${deptId}`;
  };

  const handleEdit = (subDept: SubDepartment) => {
    setEditingSubDeptId(subDept.id);
    form.reset({ name: subDept.name, departmentId: subDept.departmentId });
  };

  const handleCreateNew = () => {
    setEditingSubDeptId(null);
    form.reset({ name: "", departmentId: "" });
  };

  const handleDelete = (subDeptId: string) => {
    setSubDepartments(subDepartments.filter((sd) => sd.id !== subDeptId));
    toast({
      title: "Sub-Department Deleted",
      description: "The sub-department has been removed for this session.",
    });
  };

  function onSubmit(values: SubDepartmentFormValues) {
    if (editingSubDeptId) {
      setSubDepartments(
        subDepartments.map((sd) =>
          sd.id === editingSubDeptId ? { ...sd, ...values } : sd
        )
      );
      toast({
        title: "Sub-Department Updated",
        description: "The sub-department's details have been saved for this session.",
      });
    } else {
      const newSubDept: SubDepartment = {
        id: `sub-dept-${Date.now()}`,
        ...values,
      };
      setSubDepartments([...subDepartments, newSubDept]);
      toast({
        title: "Sub-Department Created",
        description: "The new sub-department has been added for this session.",
      });
    }
    setEditingSubDeptId(null);
    form.reset({ name: "", departmentId: "" });
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-[13px]">
                {editingSubDeptId ? "Edit Sub-Department" : "Create New Sub-Department"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[12px]">Sub-Department Name</FormLabel>
                        <FormControl>
                          <Input className="text-[11px]" placeholder="e.g. Infrastructure" {...field} />
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
                        <FormLabel className="text-[12px]">Parent Department</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="text-[11px]">
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id} className="text-[11px]">
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">
                      {editingSubDeptId ? "Save Changes" : "Create Sub-Department"}
                    </Button>
                    {editingSubDeptId && (
                      <Button type="button" variant="outline" size="sm" onClick={handleCreateNew}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-[13px]">Manage Sub-Departments</CardTitle>
              <CardDescription className="text-[12px]">
                Specific teams or units within a department.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[12px]">Sub-Department Name</TableHead>
                    <TableHead className="text-[12px]">Sub-Department ID</TableHead>
                    <TableHead className="text-[12px]">Parent Department</TableHead>
                    <TableHead className="text-[12px] text-right">Actions</TableHead>
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
                           <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(sub.id)}>Delete</Button>
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
        </div>
      </div>
    </div>
  );
}
