
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
  organizationSchema,
  type Organization,
  type OrganizationFormValues,
  type Group,
} from "@/lib/types";
import {
  organizations as initialOrganizations,
  groups as initialGroups,
} from "@/lib/mock-data";

const ORG_STORAGE_KEY = "organizations";
const GROUP_STORAGE_KEY = "groups";

export default function OrganizationsPage() {
  const { toast } = useToast();
  const [organizations, setOrganizations] = React.useState<Organization[]>([]);
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [editingOrgId, setEditingOrgId] = React.useState<string | null>(null);

  // Load data from localStorage on mount
  React.useEffect(() => {
    const storedOrgs = localStorage.getItem(ORG_STORAGE_KEY);
    setOrganizations(storedOrgs ? JSON.parse(storedOrgs) : initialOrganizations);

    const storedGroups = localStorage.getItem(GROUP_STORAGE_KEY);
    setGroups(storedGroups ? JSON.parse(storedGroups) : initialGroups);
  }, []);

  // Save data to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem(ORG_STORAGE_KEY, JSON.stringify(organizations));
  }, [organizations]);

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      groupId: "",
    },
  });

  const getGroupName = (groupId: string) => {
    return groups.find((g) => g.id === groupId)?.name || `ID not found: ${groupId}`;
  };

  const handleEdit = (org: Organization) => {
    setEditingOrgId(org.id);
    form.reset({ name: org.name, groupId: org.groupId });
  };

  const handleCreateNew = () => {
    setEditingOrgId(null);
    form.reset({ name: "", groupId: "" });
  };

  const handleDelete = (orgId: string) => {
    setOrganizations(organizations.filter((o) => o.id !== orgId));
    toast({
      title: "Organization Deleted",
      description: "The organization has been removed.",
    });
  };

  function onSubmit(values: OrganizationFormValues) {
    if (editingOrgId) {
      setOrganizations(
        organizations.map((o) =>
          o.id === editingOrgId ? { ...o, ...values } : o
        )
      );
      toast({
        title: "Organization Updated",
        description: "The organization's details have been saved.",
      });
    } else {
      const newOrg: Organization = {
        id: `org-${Date.now()}`,
        ...values,
      };
      setOrganizations([...organizations, newOrg]);
      toast({
        title: "Organization Created",
        description: "The new organization has been added.",
      });
    }
    setEditingOrgId(null);
    form.reset({ name: "", groupId: "" });
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-[13px]">
                {editingOrgId ? "Edit Organization" : "Create New Organization"}
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
                        <FormLabel className="text-[12px]">Organization Name</FormLabel>
                        <FormControl>
                          <Input className="text-[11px]" placeholder="e.g. Swissotel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="groupId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[12px]">Parent Group</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="text-[11px]">
                              <SelectValue placeholder="Select a group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {groups.map((group) => (
                              <SelectItem key={group.id} value={group.id} className="text-[11px]">
                                {group.name}
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
                      {editingOrgId ? "Save Changes" : "Create Organization"}
                    </Button>
                    {editingOrgId && (
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
              <CardTitle className="text-[13px]">Manage Organizations</CardTitle>
              <CardDescription className="text-[12px]">
                Business units under a group.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[12px]">Organization Name</TableHead>
                    <TableHead className="text-[12px]">Organization ID</TableHead>
                    <TableHead className="text-[12px]">Parent Group</TableHead>
                    <TableHead className="text-[12px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizations.length > 0 ? (
                    organizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell className="font-medium text-[11px]">{org.name}</TableCell>
                        <TableCell className="text-[11px] font-mono">{org.id}</TableCell>
                        <TableCell className="text-[11px]">{getGroupName(org.groupId)}</TableCell>
                        <TableCell className="text-right space-x-2">
                           <Button variant="ghost" size="sm" onClick={() => handleEdit(org)}>Edit</Button>
                           <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(org.id)}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No organizations found.
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
