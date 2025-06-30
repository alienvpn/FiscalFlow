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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { groups, organizations, departments } from "@/lib/mock-data";

// Schemas
const userLoginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

const groupLoginSchema = z.object({
  groupId: z.string().min(1, "Group is required."),
  password: z.string().min(1, "Password is required."),
});

const orgLoginSchema = z.object({
  groupId: z.string().min(1, "Group is required."),
  organizationId: z.string().min(1, "Organization is required."),
  password: z.string().min(1, "Password is required."),
});

const deptLoginSchema = z.object({
  groupId: z.string().min(1, "Group is required."),
  organizationId: z.string().min(1, "Organization is required."),
  departmentId: z.string().min(1, "Department is required."),
  password: z.string().min(1, "Password is required."),
});

export default function LoginPage() {
  const userForm = useForm<z.infer<typeof userLoginSchema>>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const groupForm = useForm<z.infer<typeof groupLoginSchema>>({
    resolver: zodResolver(groupLoginSchema),
    defaultValues: { groupId: "", password: "" },
  });

  const orgForm = useForm<z.infer<typeof orgLoginSchema>>({
    resolver: zodResolver(orgLoginSchema),
    defaultValues: { groupId: "", organizationId: "", password: "" },
  });

  const deptForm = useForm<z.infer<typeof deptLoginSchema>>({
    resolver: zodResolver(deptLoginSchema),
    defaultValues: {
      groupId: "",
      organizationId: "",
      departmentId: "",
      password: "",
    },
  });

  // Watchers for dependent dropdowns
  const orgFormGroupId = orgForm.watch("groupId");
  const deptFormGroupId = deptForm.watch("groupId");
  const deptFormOrgId = deptForm.watch("organizationId");

  const availableOrgsForOrgForm = React.useMemo(
    () => organizations.filter((o) => o.groupId === orgFormGroupId),
    [orgFormGroupId]
  );
  const availableOrgsForDeptForm = React.useMemo(
    () => organizations.filter((o) => o.groupId === deptFormGroupId),
    [deptFormGroupId]
  );
  const availableDepts = React.useMemo(
    () => departments.filter((d) => d.organizationId === deptFormOrgId),
    [deptFormOrgId]
  );
  
  React.useEffect(() => { orgForm.setValue("organizationId", ""); }, [orgFormGroupId, orgForm]);
  React.useEffect(() => { deptForm.setValue("organizationId", ""); }, [deptFormGroupId, deptForm]);
  React.useEffect(() => { deptForm.setValue("departmentId", ""); }, [deptFormOrgId, deptForm]);


  function onUserSubmit(values: z.infer<typeof userLoginSchema>) {
    console.log("User Login:", values);
  }
  function onGroupSubmit(values: z.infer<typeof groupLoginSchema>) {
    console.log("Group Login:", values);
  }
  function onOrgSubmit(values: z.infer<typeof orgLoginSchema>) {
    console.log("Organization Login:", values);
  }
  function onDeptSubmit(values: z.infer<typeof deptLoginSchema>) {
    console.log("Department Login:", values);
  }

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Select your login method and enter your credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="user">User</TabsTrigger>
              <TabsTrigger value="group">Group</TabsTrigger>
              <TabsTrigger value="organization">Org</TabsTrigger>
              <TabsTrigger value="department">Dept</TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="pt-4">
              <Form {...userForm}>
                <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
                  <FormField control={userForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="user@example.com" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={userForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                  <Button type="submit" className="w-full">Login as User</Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="group" className="pt-4">
              <Form {...groupForm}>
                <form onSubmit={groupForm.handleSubmit(onGroupSubmit)} className="space-y-4">
                    <FormField control={groupForm.control} name="groupId" render={({ field }) => (<FormItem><FormLabel>Group</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a group" /></SelectTrigger></FormControl><SelectContent>{groups.map((g) => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                    <FormField control={groupForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    <Button type="submit" className="w-full">Login as Group</Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="organization" className="pt-4">
              <Form {...orgForm}>
                <form onSubmit={orgForm.handleSubmit(onOrgSubmit)} className="space-y-4">
                    <FormField control={orgForm.control} name="groupId" render={({ field }) => (<FormItem><FormLabel>Group</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a group" /></SelectTrigger></FormControl><SelectContent>{groups.map((g) => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                    <FormField control={orgForm.control} name="organizationId" render={({ field }) => (<FormItem><FormLabel>Organization</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!orgFormGroupId}><FormControl><SelectTrigger><SelectValue placeholder="Select an organization" /></SelectTrigger></FormControl><SelectContent>{availableOrgsForOrgForm.map((o) => (<SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                    <FormField control={orgForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    <Button type="submit" className="w-full">Login as Organization</Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="department" className="pt-4">
              <Form {...deptForm}>
                <form onSubmit={deptForm.handleSubmit(onDeptSubmit)} className="space-y-6">
                    <FormField control={deptForm.control} name="groupId" render={({ field }) => (<FormItem><FormLabel>Group</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a group" /></SelectTrigger></FormControl><SelectContent>{groups.map((g) => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                    <FormField control={deptForm.control} name="organizationId" render={({ field }) => (<FormItem><FormLabel>Organization</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!deptFormGroupId}><FormControl><SelectTrigger><SelectValue placeholder="Select an organization" /></SelectTrigger></FormControl><SelectContent>{availableOrgsForDeptForm.map((o) => (<SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                    <FormField control={deptForm.control} name="departmentId" render={({ field }) => (<FormItem><FormLabel>Department</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!deptFormOrgId}><FormControl><SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl><SelectContent>{availableDepts.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                    <FormField control={deptForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    <Button type="submit" className="w-full">Login as Department</Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
