
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { allModules } from "@/lib/navigation";
import { useData } from "@/context/data-context";
import { userRegistrationSchema, type User as UserRegistrationFormValues } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";

const modulesForPermissions = allModules.filter(
  (m) =>
    m.href !== "/settings/user-registration" &&
    m.href !== "/login" &&
    m.href !== "/" &&
    m.href !== "/home"
);

const defaultPermissions = modulesForPermissions.reduce(
  (acc, module) => ({ ...acc, [module.href]: "none" }),
  {}
);

const defaultValues: UserRegistrationFormValues = {
  groupId: "",
  organizationId: "",
  departmentId: "",
  username: "",
  email: "",
  mobile: "",
  userRole: "",
  password: "",
  confirmPassword: "",
  permissions: defaultPermissions,
};

export default function UserRegistrationPage() {
  const { toast } = useToast();
  const { 
    users, setUsers,
    groups, 
    organizations, 
    departments, 
    approvalWorkflows, 
  } = useData();

  const [activeTab, setActiveTab] = React.useState("view");
  const [editingUserId, setEditingUserId] = React.useState<string | null>(null);
  const [isClient, setIsClient] = React.useState(false);

  const form = useForm<UserRegistrationFormValues>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: defaultValues,
  });

  const { watch, setValue, reset } = form;
  const groupId = watch("groupId");
  const organizationId = watch("organizationId");
  const departmentId = watch("departmentId");

  const availableOrganizations = React.useMemo(() => {
    return organizations.filter((o) => o.groupId === groupId);
  }, [groupId, organizations]);

  const availableDepartments = React.useMemo(() => {
    return departments.filter((d) => d.organizationId === organizationId);
  }, [organizationId, departments]);

  const allApprovalRoles = React.useMemo(() => {
    const budgetRoles = approvalWorkflows.budget.map(
      (level: any) => level.approverRole
    );
    const contractRoles = approvalWorkflows.contract.map(
      (level: any) => level.approverRole
    );
    const allRoles = [...budgetRoles, ...contractRoles];
    return [...new Set(allRoles)];
  }, [approvalWorkflows]);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (editingUserId) {
      const userToEdit = users.find((u) => u.id === editingUserId);
      if (userToEdit) {
        // Merge existing permissions with the default set to handle any new modules.
        const completePermissions = {
          ...defaultPermissions,
          ...userToEdit.permissions,
        };
        reset({ ...userToEdit, permissions: completePermissions });
      }
    } else {
      reset(defaultValues);
    }
  }, [editingUserId, users, reset]);


  React.useEffect(() => {
    // When the available organizations change, check if the current one is still valid.
    if (organizationId && !availableOrganizations.some(o => o.id === organizationId)) {
      // If not, clear the organization and the dependent department.
      setValue("organizationId", "");
      setValue("departmentId", "");
    }
  }, [organizationId, availableOrganizations, setValue]);

  React.useEffect(() => {
    // When the available departments change, check if the current one is still valid.
    if (departmentId && !availableDepartments.some(d => d.id === departmentId)) {
      // If not, clear the department.
      setValue("departmentId", "");
    }
  }, [departmentId, availableDepartments, setValue]);

  function handleEdit(userId: string) {
    setEditingUserId(userId);
    setActiveTab("create");
  }

  function handleCreateNew() {
      setEditingUserId(null);
      reset(defaultValues);
      setActiveTab("create");
  }

  function handleDelete(userId: string) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast({
          title: "User Deleted",
          description: "The user has been successfully removed.",
      });
  }

  function onSubmit(data: UserRegistrationFormValues) {
    if (editingUserId) {
        setUsers(prev => prev.map(u => u.id === editingUserId ? { ...data, id: u.id } : u));
        toast({
            title: "User Updated",
            description: `User "${data.username}" has been updated successfully.`
        });
    } else {
        const newUser = { ...data, id: `user-${Date.now()}`};
        setUsers(prevUsers => [...prevUsers, newUser]);
        toast({
          title: "User Created",
          description: `User "${data.username}" has been created successfully.`,
        });
    }
    setEditingUserId(null);
    setActiveTab("view");
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-[14px] font-bold tracking-tight mb-2 print:text-[12px]">
        User Registration & Management
      </h2>
      <p className="text-muted-foreground mb-6 text-[12px] print:text-[10px]">
        Create, edit, and manage user accounts and their permissions.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view">View Users</TabsTrigger>
            <TabsTrigger value="create">{editingUserId ? "Edit User" : "Create New User"}</TabsTrigger>
        </TabsList>
        <TabsContent value="view">
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle className="text-[13px]">Existing Users</CardTitle>
                    <CardDescription className="text-[12px]">Browse and manage all registered users.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Approval Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isClient ? (
                                users.length > 0 ? (
                                    users.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium text-[11px]">{user.username}</TableCell>
                                            <TableCell className="text-[11px]">{user.email}</TableCell>
                                            <TableCell>
                                                {user.userRole ? <Badge variant="secondary">{user.userRole}</Badge> : <span className="text-muted-foreground text-[11px]">N/A</span>}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(user.id!)}>Edit</Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id!)} disabled={user.username === 'rootuser'}>
                                                    <Icons.Delete className="h-4 w-4 text-destructive"/>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            No users found.
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
                    <Button size="sm" className="mt-4" onClick={handleCreateNew}>
                        <Icons.Add className="mr-2" /> Create New User
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="create">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid lg:grid-cols-3 gap-8 mt-4"
              >
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[13px]">{editingUserId ? "Edit User Details" : "User Details"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="groupId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Group</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
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
                                disabled={!groupId || availableOrganizations.length === 0}
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
                                disabled={!organizationId || availableDepartments.length === 0}
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
                      </div>
                      <Separator />
                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>User Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="mobile"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mobile Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="userRole"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>User Role (Approval)</FormLabel>
                              <Select
                                onValueChange={(value) =>
                                  field.onChange(value === "--none--" ? "" : value)
                                }
                                value={field.value || "--none--"}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="--none--">None</SelectItem>
                                  {allApprovalRoles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                      {role}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} placeholder={editingUserId ? "Leave blank to keep unchanged" : ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Re-Enter Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[13px]">
                        Module Permissions
                      </CardTitle>
                      <CardDescription className="text-[12px]">
                        Set access levels for each module.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-x-4 border-b pb-2 mb-2">
                        <div className="font-bold text-[11px]">Module / Section</div>
                        <div className="font-bold text-center text-[11px]">
                          Read Only
                        </div>
                        <div className="font-bold text-center text-[11px]">
                          Read & Write
                        </div>
                        <div className="font-bold text-center text-[11px]">
                          Full Access
                        </div>
                        <div className="font-bold text-center text-[11px]">
                          No Access
                        </div>
                        <div className="font-bold text-center text-[11px]">
                          Hide Module
                        </div>
                      </div>

                      {modulesForPermissions.map((module) => (
                        <FormField
                          key={module.href}
                          control={form.control}
                          name={`permissions.${module.href}` as const}
                          render={({ field }) => (
                            <FormItem className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center gap-x-4 py-2 border-b">
                              <FormLabel className="text-[11px] font-normal">
                                {module.title}
                              </FormLabel>

                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="col-span-5 grid grid-cols-5 items-center justify-items-center"
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
                                <FormItem className="flex items-center justify-center">
                                  <FormControl>
                                    <RadioGroupItem value="hide" />
                                  </FormControl>
                                </FormItem>
                              </RadioGroup>

                              <FormMessage className="col-span-6" />
                            </FormItem>
                          )}
                        />
                      ))}
                    </CardContent>
                  </Card>
                  <Button type="submit">{editingUserId ? "Update User" : "Create User"}</Button>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[13px]">Password Policy</CardTitle>
                    </CardHeader>
                    <CardContent className="text-[12px] text-muted-foreground space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2 print:text-[12px]">
                          Minimum Requirements
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Minimum Length: 8 characters</li>
                          <li>
                            Must include at least 3 of the following 4:
                            <ul className="list-['-_'] list-inside pl-4">
                              <li>Uppercase letters (A–Z)</li>
                              <li>Lowercase letters (a–z)</li>
                              <li>Numbers (0–9)</li>
                              <li>
                                Special characters (e.g., !@#$%^&*()_+-=[]{}|;:'",.&lt;>?)
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2 print:text-[12px]">
                          Password Change Policy
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Optional: Change every 180 days (configurable)</li>
                          <li>Cannot reuse the last 5 passwords</li>
                          <li>
                            Must wait at least 24 hours before reusing the same
                            password
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2 print:text-[12px]">
                          Account Lockout & Throttling
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Lock account after 5 failed attempts</li>
                          <li>
                            Unlock after 15 minutes or via email/MFA verification
                          </li>
                          <li>
                            Apply progressive delays for repeated failed attempts
                            (rate limiting)
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </form>
            </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
