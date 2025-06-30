
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

// Mock data
const organizations = [{ id: "org-1", name: "Qatar Branch" }];
const departments = [{ id: "dept-1", name: "IT Division" }];
const suppliers = [
    { id: "sup-1", name: "AWS" },
    { id: "sup-2", name: "Salesforce" },
    { id: "sup-3", name: "Ooredoo" },
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => (currentYear + i).toString());

const opexItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required."),
  period: z.string().min(1, "Period is required."),
  amount: z.coerce.number().min(0, "Amount is required."),
  implementation: z.string().min(1, "Implementation status is required."),
  serviceStatus: z.string().min(1, "Service status is required."),
  supplier: z.string().min(1, "Supplier is required."),
  remarks: z.string().optional(),
});

const opexRegistrySchema = z.object({
  organization: z.string().min(1, "Organization is required."),
  department: z.string().min(1, "Department is required."),
  year: z.string().min(1, "Year is required."),
  items: z.array(opexItemSchema),
});

type OpexFormValues = z.infer<typeof opexRegistrySchema>;

export default function OpexRegistryPage() {
  const form = useForm<OpexFormValues>({
    resolver: zodResolver(opexRegistrySchema),
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

  const totalAnnualValue = React.useMemo(() => {
    return watchedItems.reduce((acc, item) => {
      const amount = item.amount || 0;
      let annualValue = 0;
      if (item.period === "Monthly") {
        annualValue = amount * 12;
      } else if (item.period === "Quarterly") {
        annualValue = amount * 4;
      } else if (item.period === "Annually") {
        annualValue = amount;
      }
      return acc + annualValue;
    }, 0);
  }, [watchedItems]);

  const generateOpexSeqNum = (index: number) => {
    const orgName = organizations.find((o) => o.id === organization)?.name.substring(0, 3).toUpperCase() || 'ORG';
    const deptName = departments.find((d) => d.id === department)?.name.substring(0, 4).toUpperCase() || 'DEPT';
    const itemNum = (index + 1).toString().padStart(3, '0');
    return `OPEX/${orgName}/${deptName}/${year}/${itemNum}`;
  };

  function onSubmit(values: OpexFormValues) {
    console.log(values);
    // Handle form submission
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-[14px] font-bold tracking-tight mb-2">
        OPEX Items Sheet
      </h2>
      <p className="text-muted-foreground mb-6 text-[12px]">
        Create an OPEX sheet for a specific organization, department, and year.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-[13px]">Sheet Details</CardTitle>
              <CardDescription className="text-[12px]">
                Select the organization, department, and year for this OPEX sheet.
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
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="text-[11px]">
                              <SelectValue placeholder="Select an organization" />
                            </SelectTrigger>
                            <SelectContent>
                              {organizations.map((org) => (
                                <SelectItem key={org.id} value={org.id} className="text-[11px]">{org.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
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
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="text-[11px]">
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id} className="text-[11px]">{dept.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
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
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="text-[11px]">
                              <SelectValue placeholder="Select a year" />
                            </SelectTrigger>
                            <SelectContent>
                              {years.map((y) => (
                                <SelectItem key={y} value={y} className="text-[11px]">{y}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[13px]">OPEX Items</CardTitle>
              <CardDescription className="text-[12px]">
                Add recurring operational expenses to the sheet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px] text-[12px]">Seq. No</TableHead>
                      <TableHead className="w-[250px] text-[12px]">Description</TableHead>
                      <TableHead className="w-[120px] text-[12px]">Period</TableHead>
                      <TableHead className="w-[120px] text-[12px]">Amount</TableHead>
                      <TableHead className="w-[120px] text-[12px]">Annual Value</TableHead>
                      <TableHead className="w-[150px] text-[12px]">Implementation</TableHead>
                      <TableHead className="w-[150px] text-[12px]">Service Status</TableHead>
                      <TableHead className="w-[150px] text-[12px]">Supplier</TableHead>
                      <TableHead className="w-[200px] text-[12px]">Remarks</TableHead>
                      <TableHead className="w-[50px] text-right text-[12px] print:hidden">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      const period = form.watch(`items.${index}.period`);
                      const amount = form.watch(`items.${index}.amount`) || 0;
                      let annualValue = 0;
                      if (period === "Monthly") annualValue = amount * 12;
                      else if (period === "Quarterly") annualValue = amount * 4;
                      else if (period === "Annually") annualValue = amount;

                      return (
                        <TableRow key={field.id}>
                          <TableCell className="font-medium text-[11px] align-top pt-5">{generateOpexSeqNum(index)}</TableCell>
                          <TableCell className="align-top"><FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (<FormItem><FormControl><Textarea className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)}/></TableCell>
                          <TableCell className="align-top"><FormField control={form.control} name={`items.${index}.period`} render={({ field }) => ( <FormItem><FormControl><Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger className="text-[11px]"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent> <SelectItem value="Monthly" className="text-[11px]">Monthly</SelectItem> <SelectItem value="Quarterly" className="text-[11px]">Quarterly</SelectItem> <SelectItem value="Annually" className="text-[11px]">Annually</SelectItem> </SelectContent></Select></FormControl><FormMessage /></FormItem> )}/></TableCell>
                          <TableCell className="align-top"><FormField control={form.control} name={`items.${index}.amount`} render={({ field }) => (<FormItem><FormControl><Input type="number" className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)}/></TableCell>
                          <TableCell className="text-right align-top pt-5 font-medium text-[11px]">{annualValue.toLocaleString()} QAR</TableCell>
                          <TableCell className="align-top"><FormField control={form.control} name={`items.${index}.implementation`} render={({ field }) => ( <FormItem><FormControl><Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger className="text-[11px]"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent> <SelectItem value="New" className="text-[11px]">New</SelectItem> <SelectItem value="Renewal" className="text-[11px]">Renewal</SelectItem> <SelectItem value="Ongoing" className="text-[11px]">Ongoing</SelectItem> </SelectContent></Select></FormControl><FormMessage /></FormItem> )}/></TableCell>
                          <TableCell className="align-top"><FormField control={form.control} name={`items.${index}.serviceStatus`} render={({ field }) => ( <FormItem><FormControl><Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger className="text-[11px]"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent> <SelectItem value="Active" className="text-[11px]">Active</SelectItem> <SelectItem value="Inactive" className="text-[11px]">Inactive</SelectItem> <SelectItem value="To be Renewed" className="text-[11px]">To be Renewed</SelectItem> </SelectContent></Select></FormControl><FormMessage /></FormItem> )}/></TableCell>
                          <TableCell className="align-top"><FormField control={form.control} name={`items.${index}.supplier`} render={({ field }) => ( <FormItem><FormControl><Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger className="text-[11px]"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent> {suppliers.map(s => <SelectItem key={s.id} value={s.id} className="text-[11px]">{s.name}</SelectItem>)} </SelectContent></Select></FormControl><FormMessage /></FormItem> )}/></TableCell>
                          <TableCell className="align-top"><FormField control={form.control} name={`items.${index}.remarks`} render={({ field }) => (<FormItem><FormControl><Textarea className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)}/></TableCell>
                          <TableCell className="text-right align-top pt-4 print:hidden"><Button variant="ghost" size="icon" type="button" onClick={() => remove(index)}><Icons.Delete className="h-4 w-4 text-destructive" /></Button></TableCell>
                        </TableRow>
                      );
                    })}
                     {fields.length === 0 && (
                        <TableRow><TableCell colSpan={10} className="h-24 text-center text-[12px] text-muted-foreground">No items added yet.</TableCell></TableRow>
                      )}
                  </TableBody>
                </Table>
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-4 print:hidden" onClick={() => append({ id: crypto.randomUUID(), description: "", period: "", amount: 0, implementation: "", serviceStatus: "", supplier: "", remarks: "" })}>
                <Icons.Add className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardContent>
            <CardFooter className="flex justify-end">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Total Annual Value of Sheet</p>
                        <p className="text-sm text-muted-foreground">Sum of all item annual values.</p>
                    </div>
                    <div className="text-2xl font-bold">{totalAnnualValue.toLocaleString()} QAR</div>
                </div>
            </CardFooter>
          </Card>
          
          <div className="flex items-center gap-4 print:hidden">
            <Button type="submit">Save OPEX Sheet</Button>
            <Button type="button" variant="outline" onClick={() => window.print()}>Print &amp; Preview</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
