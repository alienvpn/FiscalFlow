
"use client";

import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowUp, ArrowDown, DollarSign, FileWarning } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { addDays, isAfter, isBefore, format } from "date-fns";
import { useData } from "@/context/data-context";
import type { OpexItem, CapexItem } from "@/lib/types";

export default function Dashboard() {
  const { contracts, capexSheets, opexSheets, departments, registryItems, vendors } = useData();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const today = new Date();
  const currentYear = today.getFullYear().toString();

  const activeContracts = contracts.filter((c) => c.serviceEndDate && isAfter(new Date(c.serviceEndDate), today));
  const expiringSoonContracts = activeContracts.filter((c) => c.serviceEndDate && isBefore(new Date(c.serviceEndDate), addDays(today, 30)));
  
  const getAnnualValue = (item: OpexItem) => {
    const amount = item.amount || 0;
    if (item.period === "Monthly") return amount * 12;
    if (item.period === "Quarterly") return amount * 4;
    return amount;
  };

  const getContractDescription = (id: string | undefined) => {
    if (!id) return "N/A";
    const item = registryItems.find(i => i.id === id);
    if (!item) return "N/A";
    const supplier = vendors.find(v => v.id === (item as any).supplierId);
    const desc = item.type === "device" ? item.deviceDescription : item.serviceDescription;
    return supplier ? `${desc} (${supplier.companyName})` : desc;
  };

  const dashboardData = React.useMemo(() => {
    if (!isClient) {
      return {
        totalBudget: 0,
        totalExpenditure: 0,
        departmentsBudget: [],
        recentExpenses: [],
        departmentsAtRisk: 0,
      };
    }

    const allCurrentCapexSheets = capexSheets.filter(sheet => sheet.year === currentYear);
    const currentCapexItems: CapexItem[] = allCurrentCapexSheets.flatMap(sheet => sheet.items);

    const allCurrentOpexSheets = opexSheets.filter(sheet => sheet.year === currentYear);
    const currentOpexItems: OpexItem[] = allCurrentOpexSheets.flatMap(sheet => sheet.items);

    const totalCapexBudget = currentCapexItems.reduce((acc, item) => acc + (item.quantity * item.amount), 0);
    const totalOpexBudget = currentOpexItems.reduce((acc, item) => acc + getAnnualValue(item), 0);
    const totalBudget = totalCapexBudget + totalOpexBudget;
    
    // For now, let's consider total expenditure as the total approved OPEX for the year.
    const totalExpenditure = totalOpexBudget;

    const departmentsBudget = departments.map(dept => {
        const deptCapexItems = capexSheets
            .filter(sheet => sheet.year === currentYear && sheet.department === dept.id)
            .flatMap(sheet => sheet.items);
        const deptOpexItems = opexSheets
            .filter(sheet => sheet.year === currentYear && sheet.department === dept.id)
            .flatMap(sheet => sheet.items);

        const budget = deptCapexItems.reduce((acc, item) => acc + (item.quantity * item.amount), 0) +
                       deptOpexItems.reduce((acc, item) => acc + getAnnualValue(item), 0);

        const spent = deptOpexItems.reduce((acc, item) => acc + getAnnualValue(item), 0);

        return {
            name: dept.name.length > 10 ? dept.name.substring(0, 7) + '...' : dept.name,
            budget,
            spent,
        };
    }).filter(d => d.budget > 0 || d.spent > 0);
    
    const departmentsAtRisk = departmentsBudget.filter(d => d.budget > 0 && d.spent / d.budget > 0.8).length;
    
    const recentExpenses = currentOpexItems.slice(-5).map(item => {
        const parentSheet = allCurrentOpexSheets.find(sheet => sheet.items.some((i: OpexItem) => i.id === item.id));
        const departmentName = parentSheet ? (departments.find(d => d.id === parentSheet.department)?.name || 'N/A') : 'N/A';

        return {
            id: item.id,
            description: item.description,
            amount: getAnnualValue(item),
            category: departmentName,
            date: "Current Year"
        };
    }).reverse();

    return { totalBudget, totalExpenditure, departmentsBudget, recentExpenses, departmentsAtRisk };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, capexSheets, opexSheets, contracts, departments, vendors, registryItems, currentYear]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <h2 className="text-lg font-bold tracking-tight print:text-[12px]">Executive Dashboard</h2>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold print:text-[10px]">
              {isClient ? dashboardData.totalBudget.toLocaleString() : "..."} QAR
            </div>
            <p className="text-[10px] text-muted-foreground print:text-[10px]">
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
            <div className="text-base font-bold print:text-[10px]">
              {isClient ? dashboardData.totalExpenditure.toLocaleString() : "..."} QAR
            </div>
            <p className="text-[10px] text-muted-foreground print:text-[10px]">
              {isClient && dashboardData.totalBudget > 0 ? (
                <span className="text-primary flex items-center">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  {((dashboardData.totalExpenditure / dashboardData.totalBudget) * 100).toFixed(1)}% of total budget
                </span>
              ) : (isClient && <>&nbsp;</>)}
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
            <div className="text-base font-bold print:text-[10px]">{isClient ? activeContracts.length : "..."}</div>
            <p className="text-[10px] text-muted-foreground print:text-[10px]">
              {isClient ? expiringSoonContracts.length : "..."} contracts expiring soon
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
            <div className="text-base font-bold print:text-[10px]">{isClient ? (dashboardData.departmentsAtRisk > 0 ? "High" : "Low") : "..."}</div>
            <p className="text-[10px] text-muted-foreground print:text-[10px]">
              {isClient ? (
                <span className={dashboardData.departmentsAtRisk > 0 ? "text-destructive flex items-center" : ""}>
                    {dashboardData.departmentsAtRisk > 0 && <ArrowUp className="h-3 w-3 mr-1" />}
                    {dashboardData.departmentsAtRisk} department(s) near limit
                </span>
              ) : <>&nbsp;</>}
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
            {isClient ? (
              dashboardData.departmentsBudget.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dashboardData.departmentsBudget}>
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
              ) : (
                <div className="flex justify-center items-center h-[250px] text-muted-foreground text-sm">No budget data for the current year.</div>
              )
             ) : (
                <div className="flex justify-center items-center h-[250px]">Loading chart...</div>
             )
            }
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Recent Expenses (from OPEX)</CardTitle>
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
                    Annual Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isClient && dashboardData.recentExpenses.length > 0 ? (
                  dashboardData.recentExpenses.map((expense) => (
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      No OPEX data for the current year.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      {isClient && expiringSoonContracts.length > 0 && (
        <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-sm">Contract Renewal Notice</AlertTitle>
              <AlertDescription className="text-xs">
                The contract for '{getContractDescription(expiringSoonContracts[0].contractDescription)}' is expiring on {format(new Date(expiringSoonContracts[0].serviceEndDate!), "PPP")}. Please
                initiate renewal process.
              </AlertDescription>
            </Alert>
        </div>
      )}
    </div>
  );
}
