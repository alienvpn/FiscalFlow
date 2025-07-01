
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  groups,
  organizations,
  departments,
  subDepartments,
  mockUsers,
} from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  groupId: z.string().min(1, "Group is required."),
  organizationId: z.string().min(1, "Organization is required."),
  departmentId: z.string().min(1, "Department is required."),
  subDepartmentId: z.string().min(1, "Sub-department is required."),
  username: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      groupId: "grp-root",
      organizationId: "org-root",
      departmentId: "dept-root",
      subDepartmentId: "sub-dept-root",
      username: "rootuser",
      password: "rootuser26570",
    },
  });

  const { watch, setValue } = form;

  // Watchers for dependent dropdowns
  const groupId = watch("groupId");
  const organizationId = watch("organizationId");
  const departmentId = watch("departmentId");

  const availableOrganizations = React.useMemo(
    () => organizations.filter((o) => o.groupId === groupId),
    [groupId]
  );
  const availableDepartments = React.useMemo(
    () => departments.filter((d) => d.organizationId === organizationId),
    [organizationId]
  );
  const availableSubDepartments = React.useMemo(
    () => subDepartments.filter((sd) => sd.departmentId === departmentId),
    [departmentId]
  );

  React.useEffect(() => {
    if (availableOrganizations.length > 0) {
      if (!availableOrganizations.find(o => o.id === organizationId)) {
        setValue("organizationId", availableOrganizations[0].id);
      }
    } else {
        setValue("organizationId", "");
    }
  }, [groupId, availableOrganizations, organizationId, setValue]);

  React.useEffect(() => {
     if (availableDepartments.length > 0) {
      if (!availableDepartments.find(d => d.id === departmentId)) {
        setValue("departmentId", availableDepartments[0].id);
      }
    } else {
        setValue("departmentId", "");
    }
  }, [organizationId, availableDepartments, departmentId, setValue]);

  React.useEffect(() => {
    if (availableSubDepartments.length > 0) {
      if (!availableSubDepartments.find(sd => sd.id === watch("subDepartmentId"))) {
        setValue("subDepartmentId", availableSubDepartments[0].id);
      }
    } else {
        setValue("subDepartmentId", "");
    }
  }, [departmentId, availableSubDepartments, setValue, watch]);

  function onSubmit(values: z.infer<typeof loginSchema>) {
    const user = mockUsers.find(
      (u) => u.username === values.username && u.password === values.password
    );

    if (user) {
      console.log("Login successful:", values);
      router.push("/home");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            FiscalFlow
          </CardTitle>
          <CardDescription>
            Welcome! Please enter your credentials to log in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groups.map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organizationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!groupId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an organization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableOrganizations.map((o) => (
                          <SelectItem key={o.id} value={o.id}>
                            {o.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!organizationId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableDepartments.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subDepartmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!departmentId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a sub-department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSubDepartments.map((sd) => (
                          <SelectItem key={sd.id} value={sd.id}>
                            {sd.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
