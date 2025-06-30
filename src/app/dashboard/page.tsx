"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  DollarSign,
  FileWarning,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const budgetData = [
  { name: "IT", spent: 4500, budget: 8000 },
  { name: "Marketing", spent: 6200, budget: 7500 },
  { name: "Operations", spent: 7800, budget: 9000 },
  { name: "HR", spent: 3000, budget: 5000 },
  { name: "Sales", spent: 9500, budget: 12000 },
];

const recentExpenses = [
  {
    id: "exp-01",
    description: "Cloud Services Renewal",
    amount: 1200,
    category: "IT",
    date: "2 days ago",
  },
  {
    id: "exp-02",
    description: "Marketing Campaign Q3",
    amount: 4500,
    category: "Marketing",
    date: "4 days ago",
  },
  {
    id: "exp-03",
    description: "Office Supplies",
    amount: 350,
    category: "Operations",
    date: "1 week ago",
  },
  {
    id: "exp-04",
    description: "New Hire Onboarding",
    amount: 800,
    category: "HR",
    date: "1 week ago",
  },
];

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <h2 className="text-lg font-bold tracking-tight">Executive Dashboard</h2>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold">41,500 QAR</div>
            <p className="text-[10px] text-muted-foreground">
              Total allocated for this period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-medium">
              Total Expenditure
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold">31,000 QAR</div>
            <p className="text-[10px] text-muted-foreground">
              <span className="text-primary flex items-center">
                <ArrowDown className="h-3 w-3 mr-1" />
                74.7% of total budget
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-medium">
              Active Contracts
            </CardTitle>
            <FileWarning className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold">42</div>
            <p className="text-[10px] text-muted-foreground">
              2 contracts expiring soon
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-medium">
              Budget Overrun Risk
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold">Low</div>
            <p className="text-[10px] text-muted-foreground">
              <span className="text-destructive flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />1 department near limit
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="text-lg">Budget vs. Expenditure</CardTitle>
            <CardDescription className="text-xs">
              Department-wise spending for the current period.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={budgetData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={8}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={8}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value / 1000}k QAR`}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--accent))" }}
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    fontSize: "10px",
                    padding: "4px 8px",
                  }}
                />
                <Bar
                  dataKey="spent"
                  fill="hsl(var(--chart-1))"
                  name="Spent"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="budget"
                  fill="hsl(var(--chart-2))"
                  name="Budget"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Recent Expenses</CardTitle>
            <CardDescription className="text-xs">
              A log of the latest operational expenses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="h-8 px-2 text-xs">Description</TableHead>
                  <TableHead className="h-8 px-2 text-xs">Category</TableHead>
                  <TableHead className="h-8 px-2 text-right text-xs">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="p-2">
                      <div className="font-medium text-xs">
                        {expense.description}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {expense.date}
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <Badge variant="outline">{expense.category}</Badge>
                    </TableCell>
                    <TableCell className="p-2 text-right text-xs">
                      {expense.amount.toLocaleString()} QAR
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-sm">Contract Renewal Notice</AlertTitle>
          <AlertDescription className="text-xs">
            The contract for 'VendorLink CRM' is expiring in 15 days. Please
            initiate renewal process.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <FileWarning className="h-4 w-4" />
          <AlertTitle className="text-sm">SLA Breach Detected</AlertTitle>
          <AlertDescription className="text-xs">
            SLA for 'Server Hosting Pro' has been breached (99.5% uptime).
            Follow up with vendor required.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
