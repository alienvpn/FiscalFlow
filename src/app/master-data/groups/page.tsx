
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
import { Input } from "@/components/ui/input";
import { useData } from "@/context/data-context";
import { Icons } from "@/components/icons";
import { groupSchema, type GroupFormValues, type Group } from "@/lib/types";


export default function GroupsPage() {
  const { groups, setGroups } = useData();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingGroup, setEditingGroup] = React.useState<Group | null>(null);

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
    },
  });

  React.useEffect(() => {
    if (editingGroup) {
      form.reset(editingGroup);
    } else {
      form.reset({ name: "" });
    }
  }, [editingGroup, form, isDialogOpen]);

  const handleAddNew = () => {
    setEditingGroup(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (groupId: string) => {
    // Also remove organizations that belong to this group
    setGroups(groups.filter(g => g.id !== groupId));
  };

  function onSubmit(values: GroupFormValues) {
    if (editingGroup) {
      setGroups(groups.map((g) => (g.id === editingGroup.id ? {...values, id: g.id} : g)));
    } else {
      setGroups([...groups, { ...values, id: `grp-${Date.now()}` }]);
    }
    setIsDialogOpen(false);
    setEditingGroup(null);
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-[13px]">Manage Groups</CardTitle>
                <CardDescription className="text-[12px]">
                  Add, edit, or delete top-level entities in your organization.
                </CardDescription>
              </div>
              <Button onClick={handleAddNew} size="sm"><Icons.Add className="mr-2"/> Add New Group</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[12px]">Group Name</TableHead>
                  <TableHead className="text-[12px]">Group ID</TableHead>
                  <TableHead className="text-right text-[12px]">Actions</TableHead>
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
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(group.id)}><Icons.Delete className="h-4 w-4"/></Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      No groups found. Add one to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGroup ? "Edit Group" : "Add New Group"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Your Holding Group" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">{editingGroup ? "Save Changes" : "Create Group"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
