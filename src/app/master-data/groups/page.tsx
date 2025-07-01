
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { groupSchema, type Group, type GroupFormValues } from "@/lib/types";
import { groups as initialGroups } from "@/lib/mock-data";

export default function GroupsPage() {
  const { toast } = useToast();
  const [groups, setGroups] = React.useState<Group[]>(initialGroups);
  const [editingGroupId, setEditingGroupId] = React.useState<string | null>(null);

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleEdit = (group: Group) => {
    setEditingGroupId(group.id);
    form.reset({ name: group.name });
  };

  const handleCreateNew = () => {
    setEditingGroupId(null);
    form.reset({ name: "" });
  };

  const handleDelete = (groupId: string) => {
    setGroups(groups.filter((g) => g.id !== groupId));
    toast({
      title: "Group Deleted",
      description: "The group has been removed for this session.",
    });
  };

  function onSubmit(values: GroupFormValues) {
    if (editingGroupId) {
      setGroups(
        groups.map((g) =>
          g.id === editingGroupId ? { ...g, name: values.name } : g
        )
      );
      toast({
        title: "Group Updated",
        description: "The group's details have been saved for this session.",
      });
    } else {
      const newGroup: Group = {
        id: `grp-${Date.now()}`,
        name: values.name,
      };
      setGroups([...groups, newGroup]);
      toast({
        title: "Group Created",
        description: "The new group has been added for this session.",
      });
    }
    setEditingGroupId(null);
    form.reset({ name: "" });
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-[13px]">{editingGroupId ? "Edit Group" : "Create New Group"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[12px]">Group Name</FormLabel>
                        <FormControl>
                          <Input className="text-[11px]" placeholder="e.g. Global Holdings" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">
                      {editingGroupId ? "Save Changes" : "Create Group"}
                    </Button>
                    {editingGroupId && (
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
              <CardTitle className="text-[13px]">Manage Groups</CardTitle>
              <CardDescription className="text-[12px]">
                Top-level entities in your organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[12px]">Group Name</TableHead>
                    <TableHead className="text-[12px]">Group ID</TableHead>
                    <TableHead className="text-[12px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.length > 0 ? (
                    groups.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell className="font-medium text-[11px]">{group.name}</TableCell>
                        <TableCell className="text-[11px] font-mono">{group.id}</TableCell>
                        <TableCell className="text-right space-x-2">
                           <Button variant="ghost" size="sm" onClick={() => handleEdit(group)}>Edit</Button>
                           <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(group.id)}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                        No groups found. Create one to get started.
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
