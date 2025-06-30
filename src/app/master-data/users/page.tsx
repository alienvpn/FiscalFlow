
"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { organizations, departments, subDepartments } from "@/lib/mock-data";
import { allModules } from "@/lib/navigation";

const accessLevels = [
  "Read Only",
  "View Only",
  "Read & Write",
  "Full Access Including Deleting of Data",
] as const;

const moduleAccessSchema = z.object({
  moduleId: z.string(),
  moduleTitle: z.string(),
  accessLevel: z.enum(accessLevels),
});

const userSchema = z
  .object({
    // For now, let's assume no groups as it's not in mock-data
    // groupId: z.string().min(1, "Group is required."),
    organizationId: z.string().min(1, "Organization is required."),
    departmentId: z.string().min(1, "Department is required."),
    subDepartmentId: z.string().min(1, "Sub-department is required."),
    username: z.string().min(3, "Username must be at least 3 characters."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    email: z.string().email("Invalid email address."),
    mobile: z.string().min(1, "Mobile number is required."),
    moduleAccess: z.array(moduleAccessSchema),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UserFormValues = z.infer<typeof userSchema>;

export default function CreateUserPage() {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      organizationId: "",
      departmentId: "",
      subDepartmentId: "",
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      mobile: "",
      moduleAccess: allModules.map((module) => ({
        moduleId: module.href,
        moduleTitle: module.title,
        accessLevel: "Read Only",
      })),
    },
  });
  
  const { fields } = useFieldArray({
    control: form.control,
    name: "moduleAccess",
  });

  const { watch, setValue } = form;
  const organizationId = watch("organizationId");
  const departmentId = watch("departmentId");

  const availableDepartments = React.useMemo(() => {
    if (!organizationId) return [];
    return departments.filter((d) => d.organizationId === organizationId);
  }, [organizationId]);

  const availableSubDepartments = React.useMemo(() => {
    if (!departmentId) return [];
    return subDepartments.filter((sd) => sd.departmentId === departmentId);
  }, [departmentId]);
  
  React.useEffect(() => {
    setValue("departmentId", "");
    setValue("subDepartmentId", "");
  }, [organizationId, setValue]);
  
  React.useEffect(() => {
    setValue("subDepartmentId", "");
  }, [departmentId, setValue]);

  function onSubmit(data: UserFormValues) {
    console.log("User data:", data);
    // Here you would typically call an API to save the user
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-[14px] font-bold tracking-tight mb-2">
        Create New User
      </h2>
      <p className="text-muted-foreground mb-6 text-[12px]">
        Set up a new user account and assign access permissions.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-[13px]">User Allocation</CardTitle>
              <CardDescription className="text-[12px]">
                Assign the user to an organizational unit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="organizationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px]">Organization</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-[11px]">
                            <SelectValue placeholder="Select an organization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {organizations.map((org) => (
                            <SelectItem
                              key={org.id}
                              value={org.id}
                              className="text-[11px]"
                            >
                              {org.name}
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
                      <FormLabel className="text-[12px]">Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!organizationId}
                      >
                        <FormControl>
                          <SelectTrigger className="text-[11px]">
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableDepartments.map((dept) => (
                            <SelectItem
                              key={dept.id}
                              value={dept.id}
                              className="text-[11px]"
                            >
                              {dept.name}
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
                      <FormLabel className="text-[12px]">Sub-Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!departmentId}
                      >
                        <FormControl>
                          <SelectTrigger className="text-[11px]">
                            <SelectValue placeholder="Select a sub-department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableSubDepartments.map((sub) => (
                            <SelectItem
                              key={sub.id}
                              value={sub.id}
                              className="text-[11px]"
                            >
                              {sub.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[13px]">User Credentials & Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField control={form.control} name="username" render={({ field }) => ( <FormItem> <FormLabel className="text-[12px]">User Name</FormLabel> <FormControl> <Input className="text-[11px]" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel className="text-[12px]">Email Address</FormLabel> <FormControl> <Input type="email" className="text-[11px]" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={form.control} name="mobile" render={({ field }) => ( <FormItem> <FormLabel className="text-[12px]">Mobile Number</FormLabel> <FormControl> <Input className="text-[11px]" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="password" render={({ field }) => ( <FormItem> <FormLabel className="text-[12px]">Password</FormLabel> <FormControl> <Input type="password" className="text-[11px]" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                 <FormField control={form.control} name="confirmPassword" render={({ field }) => ( <FormItem> <FormLabel className="text-[12px]">Re-Enter Password</FormLabel> <FormControl> <Input type="password" className="text-[11px]" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[13px]">Module Access Permissions</CardTitle>
              <CardDescription className="text-[12px]">
                Select the access level for each module in the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[12px] w-[300px]">Module</TableHead>
                      <TableHead className="text-[12px]">Permissions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-[12px] align-top pt-4">
                          {item.moduleTitle}
                          <p className="text-[11px] font-normal text-muted-foreground mt-1">{allModules.find(m => m.href === item.moduleId)?.description}</p>
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`moduleAccess.${index}.accessLevel`}
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex flex-col space-y-2"
                                  >
                                    {accessLevels.map((level) => (
                                      <div key={level} className="flex items-center space-x-3">
                                        <RadioGroupItem
                                          value={level}
                                          id={`${item.id}-${level.replace(/\s+/g, '-')}`}
                                        />
                                        <Label
                                          htmlFor={`${item.id}-${level.replace(/\s+/g, '-')}`}
                                          className="font-normal text-[11px]"
                                        >
                                          {level}
                                        </Label>
                                      </div>
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-4">
            <Button type="submit">Save User</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
