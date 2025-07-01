
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
  departmentSchema,
  type Department,
  type DepartmentFormValues,
} from "@/lib/types";
import {
  departments as initialDepartments,
  organizations as initialOrganizations,
} from "@/lib/mock-data";

export default function DepartmentsPage() {
  const { toast } = useToast();
  const [departments, setDepartments] = React.useState<Department[]>(initialDepartments);
  const [editingDeptId, setEditingDeptId] = React.useState<string | null>(null);
  
  // Statically load organizations for the dropdown
  const organizations = initialOrganizations;

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      organizationId: "",
    },
  });

  const getOrganizationName = (orgId: string) => {
    return organizations.find((o) => o.id === orgId)?.name || `ID not found: ${orgId}`;
  };

  const handleEdit = (dept: Department) => {
    setEditingDeptId(dept.id);
    form.reset({ name: dept.name, organizationId: dept.organizationId });
  };

  const handleCreateNew = () => {
    setEditingDeptId(null);
    form.reset({ name: "", organizationId: "" });
  };

  const handleDelete = (deptId: string) => {
    setDepartments(departments.filter((d) => d.id !== deptId));
    toast({
      title: "Department Deleted",
      description: "The department has been removed for this session.",
    });
  };

  function onSubmit(values: DepartmentFormValues) {
    if (editingDeptId) {
      setDepartments(
        departments.map((d) =>
          d.id === editingDeptId ? { ...d, ...values } : d
        )
      );
      toast({
        title: "Department Updated",
        description: "The department's details have been saved for this session.",
      });
    } else {
      const newDept: Department = {
        id: `dept-${Date.now()}`,
        ...values,
      };
      setDepartments([...departments, newDept]);
      toast({
        title: "Department Created",
        description: "The new department has been added for this session.",
      });
    }
    setEditingDeptId(null);
    form.reset({ name: "", organizationId: "" });
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-[13px]">
                {editingDeptId ? "Edit Department" : "Create New Department"}
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
                        <FormLabel className="text-[12px]">Department Name</FormLabel>
                        <FormControl>
                          <Input className="text-[11px]" placeholder="e.g. IT Department" {...field} />
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
                        <FormLabel className="text-[12px]">Parent Organization</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="text-[11px]">
                              <SelectValue placeholder="Select an organization" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {organizations.map((org) => (
                              <SelectItem key={org.id} value={org.id} className="text-[11px]">
                                {org.name}
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
                      {editingDeptId ? "Save Changes" : "Create Department"}
                    </Button>
                    {editingDeptId && (
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
              <CardTitle className="text-[13px]">Manage Departments</CardTitle>
              <CardDescription className="text-[12px]">
                Functional divisions within an organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[12px]">Department Name</TableHead>
                    <TableHead className="text-[12px]">Department ID</TableHead>
                    <TableHead className="text-[12px]">Parent Organization</TableHead>
                    <TableHead className="text-[12px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.length > 0 ? (
                    departments.map((dept) => (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium text-[11px]">{dept.name}</TableCell>
                        <TableCell className="text-[11px] font-mono">{dept.id}</TableCell>
                        <TableCell className="text-[11px]">{getOrganizationName(dept.organizationId)}</TableCell>
                        <TableCell className="text-right space-x-2">
                           <Button variant="ghost" size="sm" onClick={() => handleEdit(dept)}>Edit</Button>
                           <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(dept.id)}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No departments found.
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
