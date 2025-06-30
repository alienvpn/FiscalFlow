
"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";

// Mock data, this would typically come from an API
const organizations = [{ id: "org-1", name: "Qatar Branch" }];
const departments = [{ id: "dept-1", name: "IT Division" }];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => (currentYear + i).toString());

const capexItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  amount: z.coerce.number().min(0, "Amount is required."),
  period: z.string().min(1, "Period is required."),
  justification: z.string().min(1, "Justification is required."),
  remarks: z.string().optional(),
});

const capexRegistrySchema = z.object({
  organization: z.string().min(1, "Organization is required."),
  department: z.string().min(1, "Department is required."),
  year: z.string().min(1, "Year is required."),
  items: z.array(capexItemSchema),
});

type CapexFormValues = z.infer<typeof capexRegistrySchema>;

export default function CapexRegistryPage() {
  const form = useForm<CapexFormValues>({
    resolver: zodResolver(capexRegistrySchema),
    defaultValues: {
      organization: "",
      department: "",
      year: currentYear.toString(),
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");
  const { organization, department, year } = form.watch();

  const totalValue = React.useMemo(() => {
    return watchedItems.reduce((acc, item) => {
      const quantity = item.quantity || 0;
      const amount = item.amount || 0;
      return acc + quantity * amount;
    }, 0);
  }, [watchedItems]);

  const generateCapexSeqNum = (index: number) => {
    const orgName = organizations.find((o) => o.id === organization)?.name.substring(0, 3).toUpperCase() || 'ORG';
    const deptName = departments.find((d) => d.id === department)?.name.substring(0, 4).toUpperCase() || 'DEPT';
    const itemNum = (index + 1).toString().padStart(3, '0');
    return `${orgName}/${deptName}/${year}/${itemNum}`;
  };

  function onSubmit(values: CapexFormValues) {
    console.log(values);
    // Handle form submission
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-[14px] font-bold tracking-tight mb-2">
        CAPEX Items Sheet
      </h2>
      <p className="text-muted-foreground mb-6 text-[12px]">
        Create a CAPEX sheet for a specific organization, department, and year.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-[13px]">Sheet Details</CardTitle>
              <CardDescription className="text-[12px]">
                Select the organization, department, and year for this CAPEX sheet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px]">Organization</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-[11px]">
                            <SelectValue placeholder="Select an organization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {organizations.map((org) => (
                            <SelectItem key={org.id} value={org.id} className="text-[11px]">
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px]">Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-[11px]">
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id} className="text-[11px]">
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px]">Year</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-[11px]">
                            <SelectValue placeholder="Select a year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {years.map((y) => (
                            <SelectItem key={y} value={y} className="text-[11px]">
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[13px]">CAPEX Items</CardTitle>
              <CardDescription className="text-[12px]">
                Add items, devices, or services to the sheet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px] text-[12px]">CAPEX Seq. No</TableHead>
                      <TableHead className="w-[250px] text-[12px]">Description</TableHead>
                      <TableHead className="w-[80px] text-[12px]">Qty</TableHead>
                      <TableHead className="w-[120px] text-[12px]">Amount</TableHead>
                      <TableHead className="w-[120px] text-[12px]">Total</TableHead>
                      <TableHead className="w-[150px] text-[12px]">Period</TableHead>
                      <TableHead className="w-[250px] text-[12px]">Justification</TableHead>
                      <TableHead className="w-[250px] text-[12px]">Remarks</TableHead>
                      <TableHead className="w-[150px] text-[12px]">Attachment</TableHead>
                      <TableHead className="w-[50px] text-right text-[12px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      const quantity = form.watch(`items.${index}.quantity`) || 0;
                      const amount = form.watch(`items.${index}.amount`) || 0;
                      const total = quantity * amount;
                      return (
                        <TableRow key={field.id}>
                          <TableCell className="font-medium text-[11px] align-top pt-5">
                             {generateCapexSeqNum(index)}
                          </TableCell>
                          <TableCell className="align-top">
                            <FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (<FormItem><FormControl><Textarea className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          </TableCell>
                          <TableCell className="align-top">
                             <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (<FormItem><FormControl><Input type="number" className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          </TableCell>
                          <TableCell className="align-top">
                             <FormField control={form.control} name={`items.${index}.amount`} render={({ field }) => (<FormItem><FormControl><Input type="number" className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          </TableCell>
                          <TableCell className="text-right align-top pt-5 font-medium text-[11px]">
                             {total.toLocaleString()} QAR
                          </TableCell>
                          <TableCell className="align-top">
                             <FormField control={form.control} name={`items.${index}.period`} render={({ field }) => (<FormItem><FormControl><Input placeholder="e.g., 12 Months" className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          </TableCell>
                          <TableCell className="align-top">
                            <FormField control={form.control} name={`items.${index}.justification`} render={({ field }) => (<FormItem><FormControl><Textarea className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          </TableCell>
                           <TableCell className="align-top">
                            <FormField control={form.control} name={`items.${index}.remarks`} render={({ field }) => (<FormItem><FormControl><Textarea className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          </TableCell>
                          <TableCell className="align-top pt-5">
                            <Button variant="outline" size="sm" type="button">Attach</Button>
                          </TableCell>
                          <TableCell className="text-right align-top pt-4">
                            <Button variant="ghost" size="icon" type="button" onClick={() => remove(index)}>
                              <Icons.Delete className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                     {fields.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={10} className="h-24 text-center text-[12px] text-muted-foreground">
                            No items added yet.
                          </TableCell>
                        </TableRow>
                      )}
                  </TableBody>
                </Table>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => append({ id: crypto.randomUUID(), description: "", quantity: 1, amount: 0, period: "", justification: "", remarks: "" })}
              >
                <Icons.Add className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardContent>
            <CardFooter className="flex justify-end">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                        Total Value of Sheet
                        </p>
                        <p className="text-sm text-muted-foreground">
                        Sum of all item totals.
                        </p>
                    </div>
                    <div className="text-2xl font-bold">{totalValue.toLocaleString()} QAR</div>
                </div>
            </CardFooter>
          </Card>
          
          <Button type="submit">Save CAPEX Sheet</Button>
        </form>
      </Form>
    </div>
  );
}

