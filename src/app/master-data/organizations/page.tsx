
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/icons";
import {
  groups as initialGroups,
  organizations as initialOrganizations,
} from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

type Organization = (typeof initialOrganizations)[0];
type Group = (typeof initialGroups)[0];

export default function OrganizationsPage() {
  const { toast } = useToast();
  const [groups, setGroups] = React.useState<Group[]>(initialGroups);
  const [organizations, setOrganizations] =
    React.useState<Organization[]>(initialOrganizations);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingOrg, setEditingOrg] = React.useState<Organization | null>(null);
  const [orgName, setOrgName] = React.useState("");
  const [selectedGroupId, setSelectedGroupId] = React.useState("");

  const handleAddNew = () => {
    setEditingOrg(null);
    setOrgName("");
    setSelectedGroupId("");
    setIsDialogOpen(true);
  };

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setOrgName(org.name);
    setSelectedGroupId(org.groupId);
    setIsDialogOpen(true);
  };

  const handleDelete = (orgId: string) => {
    setOrganizations(organizations.filter((o) => o.id !== orgId));
    toast({
      title: "Organization Deleted",
      description: "The organization has been removed.",
      variant: "destructive",
    });
  };

  const handleSave = () => {
    if (!orgName.trim() || !selectedGroupId) {
      toast({
        title: "Validation Error",
        description: "Organization name and group are required.",
        variant: "destructive",
      });
      return;
    }

    if (editingOrg) {
      setOrganizations(
        organizations.map((o) =>
          o.id === editingOrg.id
            ? { ...o, name: orgName, groupId: selectedGroupId }
            : o
        )
      );
      toast({
        title: "Organization Updated",
        description: `Organization "${orgName}" has been successfully updated.`,
      });
    } else {
      const newOrg = {
        id: `org-${Date.now()}`,
        name: orgName,
        groupId: selectedGroupId,
      };
      setOrganizations([...organizations, newOrg]);
      toast({
        title: "Organization Added",
        description: `Organization "${orgName}" has been successfully added.`,
      });
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-[13px]">Manage Organizations</CardTitle>
              <CardDescription className="text-[12px]">
                Business units under a group.
              </CardDescription>
            </div>
            <Button size="sm" onClick={handleAddNew}>
              <Icons.Add className="mr-2 h-4 w-4" /> Add Organization
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[12px]">Organization Name</TableHead>
                <TableHead className="text-[12px]">Parent Group</TableHead>
                <TableHead className="text-right text-[12px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.length > 0 ? (
                organizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium text-[11px]">{org.name}</TableCell>
                    <TableCell className="text-[11px]">
                      {groups.find((g) => g.id === org.groupId)?.name || "N/A"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="ghost" size="sm" onClick={() => handleEdit(org)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(org.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                 <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                        No organizations found. Click "Add Organization" to create one.
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
            <DialogTitle>{editingOrg ? 'Edit Organization' : 'Add New Organization'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="org-group" className="text-right text-[12px]">
                Group
              </Label>
              <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger className="col-span-3 text-[11px]">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={g.id} className="text-[11px]">
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="org-name" className="text-right text-[12px]">
                Name
              </Label>
              <Input
                id="org-name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
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
