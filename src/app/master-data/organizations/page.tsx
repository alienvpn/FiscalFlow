
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
import { organizationSchema, type OrganizationFormValues, type Organization } from "@/lib/types";

export default function OrganizationsPage() {
  const { organizations, setOrganizations, groups } = useData();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingOrg, setEditingOrg] = React.useState<Organization | null>(null);

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: { name: "", groupId: "" },
  });
  
  React.useEffect(() => {
    if (editingOrg) {
      form.reset(editingOrg);
    } else {
      form.reset({ name: "", groupId: "" });
    }
  }, [editingOrg, form, isDialogOpen]);

  const getGroupName = (groupId: string) => {
    return groups.find((g) => g.id === groupId)?.name || "N/A";
  };
  
  const handleAddNew = () => {
    setEditingOrg(null);
    setIsDialogOpen(true);
  };
  
  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setIsDialogOpen(true);
  };

  const handleDelete = (orgId: string) => {
    setOrganizations(organizations.filter(o => o.id !== orgId));
  };

  const onSubmit = (values: OrganizationFormValues) => {
    if (editingOrg) {
      setOrganizations(organizations.map(o => o.id === editingOrg.id ? {...values, id: o.id} : o));
    } else {
      setOrganizations([...organizations, { ...values, id: `org-${Date.now()}` }]);
    }
    setIsDialogOpen(false);
    setEditingOrg(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-[13px]">Manage Organizations</CardTitle>
              <CardDescription className="text-[12px]">
                Business units under a group.
              </CardDescription>
            </div>
            <Button onClick={handleAddNew} size="sm" disabled={groups.length === 0}>
                <Icons.Add className="mr-2"/> Add New Organization
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[12px]">Organization Name</TableHead>
                <TableHead className="text-[12px]">Organization ID</TableHead>
                <TableHead className="text-[12px]">Parent Group</TableHead>
                <TableHead className="text-right text-[12px]">Actions</TableHead>
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
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(org.id)}><Icons.Delete className="h-4 w-4"/></Button>
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

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingOrg ? "Edit Organization" : "Add New Organization"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Your Company Name" {...field} />
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
                      <FormLabel>Parent Group</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a parent group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {groups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
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
                <Button type="submit">{editingOrg ? "Save Changes" : "Create Organization"}</Button>
              </DialogFooter>
            </form>
          </Form>
      </DialogContent>
      </Dialog>
    </div>
  );
}
