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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const contractsData = [
  {
    id: "con-001",
    name: "Cloud Service Agreement",
    vendor: "AWS",
    type: "SLA",
    status: "Active",
    expiryDate: "2025-12-31",
  },
  {
    id: "con-002",
    name: "CRM Software License",
    vendor: "Salesforce",
    type: "Contract",
    status: "Active",
    expiryDate: "2024-09-30",
  },
  {
    id: "con-003",
    name: "Hardware Maintenance",
    vendor: "Dell",
    type: "AMC",
    status: "Expiring Soon",
    expiryDate: "2024-08-15",
  },
  {
    id: "con-004",
    name: "Marketing Agency Retainer",
    vendor: "Creative Co.",
    type: "Contract",
    status: "Active",
    expiryDate: "2025-06-30",
  },
  {
    id: "con-005",
    name: "Building Lease",
    vendor: "City Properties",
    type: "Contract",
    status: "Expired",
    expiryDate: "2024-01-31",
  },
  {
    id: "con-006",
    name: "Telecom Services",
    vendor: "Verizon",
    type: "SLA",
    status: "Active",
    expiryDate: "2026-01-01",
  },
];

const types = ["All", "Contract", "SLA", "AMC"];
const statuses = ["All", "Active", "Expiring Soon", "Expired"];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Active":
      return "secondary";
    case "Expiring Soon":
      return "default";
    case "Expired":
      return "destructive";
    default:
      return "outline";
  }
};

export default function ContractsPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");

  const filteredData = contractsData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || item.type === typeFilter;
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-sm font-bold tracking-tight mb-2">
        Contract Management
      </h2>
      <p className="text-muted-foreground mb-6">
        Store and manage contracts, SLAs, and AMCs for easy access.
      </p>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <Input
              placeholder="Search by name or vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <div className="flex gap-4 w-full md:w-auto">
              <Select onValueChange={setTypeFilter} defaultValue="All">
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={setStatusFilter} defaultValue="All">
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.vendor}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
