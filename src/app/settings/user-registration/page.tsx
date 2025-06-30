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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { allModules } from "@/lib/navigation";
import {
  groups,
  organizations as allOrganizations,
  departments as allDepartments,
  subDepartments as allSubDepartments,
} from "@/lib/mock-data";

const permissionsSchema = z.record(z.enum(["read", "write", "full", "none"]));

const userRegistrationSchema = z
  .object({
    groupId: z.string().min(1, "Group is required."),
    organizationId: z.string().min(1, "Organization is required."),
    departmentId: z.string().min(1, "Department is required."),
    subDepartmentId: z.string().min(1, "Sub-department is required."),
    username: z.string().min(3, "Username must be at least 3 characters."),
    email: z.string().email("Invalid email address."),
    mobile: z.string().min(1, "Mobile number is required."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    permissions: permissionsSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type UserRegistrationFormValues = z.infer<typeof userRegistrationSchema>;

const modulesForPermissions = allModules.filter(
  (m) => m.href !== "/settings/user-registration" && m.href !== "/login" && m.href !== "/" && m.href !== "/home"
);

const defaultPermissions = modulesForPermissions.reduce(
  (acc, module) => ({ ...acc, [module.href]: "none" }),
  {}
);

export default function UserRegistrationPage() {
  const { toast } = useToast();
  const form = useForm<UserRegistrationFormValues>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      groupId: "",
      organizationId: "",
      departmentId: "",
      subDepartmentId: "",
      username: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      permissions: defaultPermissions,
    },
  });

  const { watch, setValue } = form;
  const groupId = watch("groupId");
  const organizationId = watch("organizationId");
  const departmentId = watch("departmentId");

  const availableOrganizations = React.useMemo(
    () => allOrganizations.filter((o) => o.groupId === groupId),
    [groupId]
  );
  const availableDepartments = React.useMemo(
    () => allDepartments.filter((d) => d.organizationId === organizationId),
    [organizationId]
  );
  const availableSubDepartments = React.useMemo(
    () => allSubDepartments.filter((d) => d.departmentId === departmentId),
    [departmentId]
  );

  React.useEffect(() => setValue("organizationId", ""), [groupId, setValue]);
  React.useEffect(() => setValue("departmentId", ""), [organizationId, setValue]);
  React.useEffect(() => setValue("subDepartmentId", ""), [departmentId, setValue]);

  function onSubmit(data: UserRegistrationFormValues) {
    console.log(data);
    toast({
      title: "User Created",
      description: `User "${data.username}" has been successfully created.`,
    });
    form.reset();
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-[14px] font-bold tracking-tight mb-2">
        User Registration
      </h2>
      <p className="text-muted-foreground mb-6 text-[12px]">
        Create a new user account and set their permissions.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[13px]">User Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="groupId" render={({ field }) => (<FormItem><FormLabel>Group</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a group" /></SelectTrigger></FormControl><SelectContent>{groups.map((g) => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name="organizationId" render={({ field }) => (<FormItem><FormLabel>Organization</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!groupId}><FormControl><SelectTrigger><SelectValue placeholder="Select an organization" /></SelectTrigger></FormControl><SelectContent>{availableOrganizations.map((o) => (<SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name="departmentId" render={({ field }) => (<FormItem><FormLabel>Department</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!organizationId}><FormControl><SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl><SelectContent>{availableDepartments.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name="subDepartmentId" render={({ field }) => (<FormItem><FormLabel>Sub Department</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!departmentId}><FormControl><SelectTrigger><SelectValue placeholder="Select a sub-department" /></SelectTrigger></FormControl><SelectContent>{availableSubDepartments.map((sd) => (<SelectItem key={sd.id} value={sd.id}>{sd.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                </div>
                <Separator />
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="username" render={({ field }) => (<FormItem><FormLabel>User Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name="mobile" render={({ field }) => (<FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                </div>
                 <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name="confirmPassword" render={({ field }) => (<FormItem><FormLabel>Re-Enter Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[13px]">Module Permissions</CardTitle>
                <CardDescription className="text-[12px]">Set access levels for each module.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-4 border-b pb-2 mb-2">
                    <div className="font-bold text-[11px]">Module / Section</div>
                    <div className="font-bold text-center text-[11px]">Read Only</div>
                    <div className="font-bold text-center text-[11px]">Read & Write</div>
                    <div className="font-bold text-center text-[11px]">Full Access</div>
                    <div className="font-bold text-center text-[11px]">No Access</div>
                </div>

                {modulesForPermissions.map((module) => (
                  <FormField
                    key={module.href}
                    control={form.control}
                    name={`permissions.${module.href}` as const}
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-x-4 py-2 border-b">
                        <FormLabel className="text-[11px] font-normal">
                          {module.title}
                        </FormLabel>
                        
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="col-span-4 grid grid-cols-4 items-center justify-items-center"
                        >
                          <FormItem className="flex items-center justify-center">
                            <FormControl>
                              <RadioGroupItem value="read" />
                            </FormControl>
                          </FormItem>
                          <FormItem className="flex items-center justify-center">
                             <FormControl>
                              <RadioGroupItem value="write" />
                            </FormControl>
                          </FormItem>
                          <FormItem className="flex items-center justify-center">
                             <FormControl>
                              <RadioGroupItem value="full" />
                            </FormControl>
                          </FormItem>
                          <FormItem className="flex items-center justify-center">
                             <FormControl>
                              <RadioGroupItem value="none" />
                            </FormControl>
                          </FormItem>
                        </RadioGroup>
                        
                        <FormMessage className="col-span-5" />
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
            </Card>
            <Button type="submit">Create User</Button>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[13px]">Password Policy</CardTitle>
              </CardHeader>
              <CardContent className="text-[12px] text-muted-foreground space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Minimum Requirements</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Minimum Length: 8 characters</li>
                    <li>Must include at least 3 of the following 4:
                      <ul className="list-['-_'] list-inside pl-4">
                        <li>Uppercase letters (A–Z)</li>
                        <li>Lowercase letters (a–z)</li>
                        <li>Numbers (0–9)</li>
                        <li>Special characters (e.g., !@#$%^&amp;*()_+-=[]{}|;:'",.&lt;&gt;?)</li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Password Change Policy</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Optional: Change every 180 days (configurable)</li>
                    <li>Cannot reuse the last 5 passwords</li>
                    <li>Must wait at least 24 hours before reusing the same password</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Account Lockout & Throttling</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Lock account after 5 failed attempts</li>
                    <li>Unlock after 15 minutes or via email/MFA verification</li>
                    <li>Apply progressive delays for repeated failed attempts (rate limiting)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
