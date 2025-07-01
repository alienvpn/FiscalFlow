
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { groups as initialGroups } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

type Group = {
  id: string;
  name: string;
};

export default function GroupsPage() {
  const { toast } = useToast();
  const [groups, setGroups] = React.useState<Group[]>(initialGroups);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingGroup, setEditingGroup] = React.useState<Group | null>(null);
  const [groupName, setGroupName] = React.useState("");

  const handleAddNew = () => {
    setEditingGroup(null);
    setGroupName("");
    setIsDialogOpen(true);
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setGroupName(group.name);
    setIsDialogOpen(true);
  };

  const handleDelete = (groupId: string) => {
    setGroups(groups.filter((g) => g.id !== groupId));
    toast({
      title: "Group Deleted",
      description: "The group has been removed.",
      variant: "destructive",
    });
  };

  const handleSave = () => {
    if (!groupName.trim()) {
      toast({
        title: "Validation Error",
        description: "Group name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (editingGroup) {
      // Update existing group
      setGroups(
        groups.map((g) =>
          g.id === editingGroup.id ? { ...g, name: groupName } : g
        )
      );
      toast({
        title: "Group Updated",
        description: `Group "${groupName}" has been successfully updated.`,
      });
    } else {
      // Add new group
      const newGroup = { id: `grp-${Date.now()}`, name: groupName };
      setGroups([...groups, newGroup]);
      toast({
        title: "Group Added",
        description: `Group "${groupName}" has been successfully added.`,
      });
    }

    setIsDialogOpen(false);
    setEditingGroup(null);
    setGroupName("");
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-[13px]">Manage Groups</CardTitle>
              <CardDescription className="text-[12px]">
                Top-level entities in your organization.
              </CardDescription>
            </div>
            <Button size="sm" onClick={handleAddNew}>
              <Icons.Add className="mr-2 h-4 w-4" /> Add Group
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[12px]">Group Name</TableHead>
                <TableHead className="text-right text-[12px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.length > 0 ? (
                groups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium text-[11px]">
                      {group.name}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="ghost" size="sm" onClick={() => handleEdit(group)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(group.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                 <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                        No groups found. Click "Add Group" to create one.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGroup ? 'Edit Group' : 'Add New Group'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="group-name" className="text-right text-[12px]">
                Name
              </Label>
              <Input
                id="group-name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="col-span-3 text-[11px]"
              />
            </div>
          </div>
          <DialogFooter>
             <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
                Cancel
            </Button>
            <Button type="button" onClick={handleSave}>Save Data</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
