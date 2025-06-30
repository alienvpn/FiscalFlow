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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const opexData = [
  {
    id: "opx-001",
    date: "2024-07-20",
    description: "Monthly Software Subscription",
    category: "IT",
    amount: 250.0,
  },
  {
    id: "opx-002",
    date: "2024-07-19",
    description: "Social Media Ads",
    category: "Marketing",
    amount: 1200.5,
  },
  {
    id: "opx-003",
    date: "2024-07-18",
    description: "Office Rent",
    category: "Operations",
    amount: 5000.0,
  },
  {
    id: "opx-004",
    date: "2024-07-15",
    description: "Employee Payroll",
    category: "HR",
    amount: 25000.0,
  },
  {
    id: "opx-005",
    date: "2024-07-14",
    description: "Client Lunch",
    category: "Sales",
    amount: 150.75,
  },
  {
    id: "opx-006",
    date: "2024-07-12",
    description: "New Server Hardware",
    category: "IT",
    amount: 3200.0,
  },
];

const categories = ["All", "IT", "Marketing", "Operations", "HR", "Sales"];

export default function OpexTrackerPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("All");

  const filteredData = opexData.filter((item) => {
    const matchesSearch = item.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-sm font-bold tracking-tight mb-2">OPEX Tracker</h2>
      <p className="text-muted-foreground mb-6">
        Log and categorize operational expenses for real-time budget tracking.
      </p>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select onValueChange={setCategoryFilter} defaultValue="All">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {new Date(item.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.amount.toLocaleString("en-US")} QAR
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
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
