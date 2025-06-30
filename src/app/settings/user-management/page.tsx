
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  organizations as mockOrgs,
  departments as mockDepts,
  subDepartments as mockSubDepts,
} from "@/lib/mock-data";

// Mock data for groups, assuming a structure
const mockGroups = [{ id: "grp-1", name: "Global Tech Inc." }];

const modules = [
  "Master Data",
  "Budgeting",
  "Contract Management",
  "Reports",
  "AI Tools",
  "Settings",
];

const permissionsSchema = z.record(z.enum(["read-only", "view-only", "read-write", "full-access"]));

const userManagementSchema = z
  .object({
    groupId: z.string().min(1, "Group is required."),
    organizationId: z.string().min(1, "Organization is required."),
    departmentId: z.string().min(1, "Department is required."),
    subDepartmentId: z.string().min(1, "Sub-department is required."),
    username: z.string().min(3, "Username must be at least 3 characters."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    email: z.string().email("Invalid email address."),
    mobile: z.string().min(5, "Mobile number is required."),
    permissions: permissionsSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type UserFormValues = z.infer<typeof userManagementSchema>;

const defaultPermissions = modules.reduce((acc, module) => {
  acc[module] = "read-only";
  return acc;
}, {} as Record<string, "read-only" | "view-only" | "read-write" | "full-access">);


export default function UserManagementPage() {
  const { toast } = useToast();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userManagementSchema),
    defaultValues: {
      groupId: "",
      organizationId: "",
      departmentId: "",
      subDepartmentId: "",
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      mobile: "",
      permissions: defaultPermissions,
    },
  });

  function onSubmit(values: UserFormValues) {
    console.log(values);
    toast({
      title: "User Created Successfully",
      description: `User "${values.username}" has been created.`,
    });
    form.reset();
  }

  const PasswordPolicy = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Password Policy</CardTitle>
        <CardDescription className="text-xs">
          Requirements for user passwords.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold">Minimum Requirements</h4>
          <ul className="list-disc pl-5 text-muted-foreground text-xs">
            <li>Minimum Length: 8 characters</li>
            <li>Must include 3 of the following 4:
              <ul className="list-disc pl-5">
                <li>Uppercase letters (A-Z)</li>
                <li>Lowercase letters (a-z)</li>
                <li>Numbers (0-9)</li>
                <li>Special characters (!@#$...)</li>
              </ul>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Password Change Policy</h4>
          <ul className="list-disc pl-5 text-muted-foreground text-xs">
            <li>Change every 180 days (optional)</li>
            <li>Cannot reuse the last 5 passwords</li>
            <li>Must wait 24 hours before reuse</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Account Lockout & Throttling</h4>
          <ul className="list-disc pl-5 text-muted-foreground text-xs">
            <li>Lock account after 5 failed attempts</li>
            <li>Unlock after 15 minutes or via email</li>
            <li>Progressive delays for repeated failures</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-sm font-bold tracking-tight mb-2">
        User Management
      </h2>
      <p className="text-muted-foreground mb-6">
        Create new users and manage their access permissions for the application.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Create New User</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="groupId" render={({ field }) => ( <FormItem> <FormLabel>Group</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select a group" /> </SelectTrigger> </FormControl> <SelectContent> {mockGroups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="organizationId" render={({ field }) => ( <FormItem> <FormLabel>Organization</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select an organization" /> </SelectTrigger> </FormControl> <SelectContent> {mockOrgs.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="departmentId" render={({ field }) => ( <FormItem> <FormLabel>Department</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select a department" /> </SelectTrigger> </FormControl> <SelectContent> {mockDepts.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="subDepartmentId" render={({ field }) => ( <FormItem> <FormLabel>Sub Department</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select a sub-department" /> </SelectTrigger> </FormControl> <SelectContent> {mockSubDepts.map(sd => <SelectItem key={sd.id} value={sd.id}>{sd.name}</SelectItem>)} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                  </div>
                  <Separator />
                  <div className="grid md:grid-cols-2 gap-4">
                     <FormField control={form.control} name="username" render={({ field }) => ( <FormItem> <FormLabel>User Name</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                     <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email Address</FormLabel> <FormControl> <Input type="email" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                     <FormField control={form.control} name="password" render={({ field }) => ( <FormItem> <FormLabel>Password</FormLabel> <FormControl> <Input type="password" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                     <FormField control={form.control} name="confirmPassword" render={({ field }) => ( <FormItem> <FormLabel>Re-Enter Password</FormLabel> <FormControl> <Input type="password" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                     <FormField control={form.control} name="mobile" render={({ field }) => ( <FormItem> <FormLabel>Mobile Number</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Module Access Permissions</CardTitle>
                  <CardDescription>
                    Select the level of access for each application module.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableCell className="font-semibold">Module</TableCell>
                          <TableCell className="font-semibold text-center">Read Only</TableCell>
                          <TableCell className="font-semibold text-center">View Only</TableCell>
                          <TableCell className="font-semibold text-center">Read & Write</TableCell>
                          <TableCell className="font-semibold text-center">Full Access</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {modules.map((module) => (
                          <FormField
                            key={module}
                            control={form.control}
                            name={`permissions.${module}`}
                            render={({ field }) => (
                              <TableRow>
                                <TableCell>{module}</TableCell>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid grid-cols-4 items-center"
                                  >
                                  <TableCell className="text-center"> <FormControl> <RadioGroupItem value="read-only" /> </FormControl> </TableCell>
                                  <TableCell className="text-center"> <FormControl> <RadioGroupItem value="view-only" /> </FormControl> </TableCell>
                                  <TableCell className="text-center"> <FormControl> <RadioGroupItem value="read-write" /> </FormControl> </TableCell>
                                  <TableCell className="text-center"> <FormControl> <RadioGroupItem value="full-access" /> </FormControl> </TableCell>
                                </RadioGroup>
                              </TableRow>
                            )}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit">Create User</Button>

            </div>
            <div className="space-y-6">
              <PasswordPolicy />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
