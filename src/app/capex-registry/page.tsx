
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
import { organizations, departments, capexSheets } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { submitCapexSheet, saveCapexSheetAsDraft } from "./actions";
import { capexItemSchema, type CapexItem } from "@/lib/types";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => (currentYear + i).toString());

const capexRegistrySchema = z.object({
  organization: z.string().min(1, "Organization is required."),
  department: z.string().min(1, "Department is required."),
  year: z.string().min(1, "Year is required."),
  items: z.array(capexItemSchema),
});

type CapexFormValues = z.infer<typeof capexRegistrySchema>;

export default function CapexRegistryPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [previousYearItems, setPreviousYearItems] = React.useState<CapexItem[]>([]);

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

  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (
        type === "change" &&
        (name === "organization" || name === "department" || name === "year")
      ) {
        const { organization, department, year } = value;
        if (organization && department && year) {
          const prevYear = (parseInt(year, 10) - 1).toString();
          const sheet = capexSheets.find(
            (s) =>
              s.year === prevYear &&
              s.organizationId === organization &&
              s.departmentId === department
          );
          setPreviousYearItems(sheet ? sheet.items : []);
        } else {
          setPreviousYearItems([]);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);


  const totalValue = React.useMemo(() => {
    return watchedItems.reduce((acc, item) => {
      const quantity = item.quantity || 0;
      const amount = item.amount || 0;
      return acc + quantity * amount;
    }, 0);
  }, [watchedItems]);

  const previousYearTotalValue = React.useMemo(() => {
    return previousYearItems.reduce((acc, item) => {
      const quantity = item.quantity || 0;
      const amount = item.amount || 0;
      return acc + quantity * amount;
    }, 0);
  }, [previousYearItems]);

  const generateCapexSeqNum = (index: number, seqYear: string) => {
    const { organization, department } = form.getValues();
    const orgName = organizations.find((o) => o.id === organization)?.name.substring(0, 3).toUpperCase() || 'ORG';
    const deptName = departments.find((d) => d.id === department)?.name.substring(0, 4).toUpperCase() || 'DEPT';
    const itemNum = (index + 1).toString().padStart(3, '0');
    return `${orgName}/${deptName}/${seqYear}/${itemNum}`;
  };

  async function onSubmit(values: CapexFormValues) {
    setIsSubmitting(true);
    const result = await submitCapexSheet(values);
    if (result.success) {
        toast({
            title: "Sheet Submitted",
            description: result.message,
        });
    } else {
        toast({
            title: "Submission Failed",
            description: result.error,
            variant: "destructive",
        });
    }
    setIsSubmitting(false);
  }

  async function handleSaveAsDraft() {
    setIsSubmitting(true);
    const values = form.getValues();
    const result = await saveCapexSheetAsDraft(values);
    if (result.success) {
        toast({
            title: "Draft Saved",
            description: result.message,
        });
    } else {
         toast({
            title: "Save Failed",
            description: result.error,
            variant: "destructive",
        });
    }
    setIsSubmitting(false);
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-[14px] font-bold tracking-tight mb-2 print:text-[12px]">
        CAPEX Items Sheet
      </h2>
      <p className="text-muted-foreground mb-6 text-[12px] print:text-[10px]">
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
          
          {previousYearItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[13px]">Reference: {(parseInt(form.getValues().year, 10) - 1)} CAPEX Sheet</CardTitle>
                <CardDescription className="text-[12px]">Items from the previous year for your reference.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px] text-[12px]">CAPEX Seq. No</TableHead>
                      <TableHead className="w-[250px] text-[12px]">Description</TableHead>
                      <TableHead className="w-[120px] text-[12px]">Priority</TableHead>
                      <TableHead className="w-[80px] text-[12px]">Qty</TableHead>
                      <TableHead className="w-[120px] text-[12px]">Amount (QAR)</TableHead>
                      <TableHead className="w-[120px] text-right text-[12px]">Total (QAR)</TableHead>
                      <TableHead className="w-[250px] text-[12px]">Justification</TableHead>
                      <TableHead className="w-[250px] text-[12px]">Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previousYearItems.map((item, index) => {
                      const total = (item.quantity || 0) * (item.amount || 0);
                      const prevYear = (parseInt(form.getValues().year, 10) - 1).toString();
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-[11px]">{generateCapexSeqNum(index, prevYear)}</TableCell>
                          <TableCell className="text-[11px]">{item.description}</TableCell>
                          <TableCell className="text-[11px]">{item.priority}</TableCell>
                          <TableCell className="text-[11px]">{item.quantity.toLocaleString()}</TableCell>
                          <TableCell className="text-[11px]">{item.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-medium text-[11px]">{total.toLocaleString()}</TableCell>
                          <TableCell className="text-[11px]">{item.justification}</TableCell>
                          <TableCell className="text-[11px]">{item.remarks}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-end">
                <div className="flex items-center space-x-4 rounded-md border p-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Total Value of Previous Year's Sheet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sum of all item totals from last year.
                    </p>
                  </div>
                  <div className="text-2xl font-bold">
                    {previousYearTotalValue.toLocaleString()} QAR
                  </div>
                </div>
              </CardFooter>
            </Card>
          )}

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
                      <TableHead className="w-[120px] text-[12px]">Priority</TableHead>
                      <TableHead className="w-[80px] text-[12px]">Qty</TableHead>
                      <TableHead className="w-[120px] text-[12px]">Amount</TableHead>
                      <TableHead className="w-[120px] text-[12px]">Total</TableHead>
                      <TableHead className="w-[250px] text-[12px]">Justification</TableHead>
                      <TableHead className="w-[250px] text-[12px]">Remarks</TableHead>
                      <TableHead className="w-[150px] text-[12px] print:hidden">Attachment</TableHead>
                      <TableHead className="w-[50px] text-right text-[12px] print:hidden">Actions</TableHead>
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
                             {generateCapexSeqNum(index, form.getValues().year)}
                          </TableCell>
                          <TableCell className="align-top">
                            <FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (<FormItem><FormControl><Textarea className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          </TableCell>
                          <TableCell className="align-top">
                            <FormField
                              control={form.control}
                              name={`items.${index}.priority`}
                              render={({ field }) => (
                                <FormItem>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="text-[11px]">
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="High" className="text-[11px]">High</SelectItem>
                                      <SelectItem value="Medium" className="text-[11px]">Medium</SelectItem>
                                      <SelectItem value="Low" className="text-[11px]">Low</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
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
                            <FormField control={form.control} name={`items.${index}.justification`} render={({ field }) => (<FormItem><FormControl><Textarea className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          </TableCell>
                           <TableCell className="align-top">
                            <FormField control={form.control} name={`items.${index}.remarks`} render={({ field }) => (<FormItem><FormControl><Textarea className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                          </TableCell>
                          <TableCell className="align-top pt-5 print:hidden">
                            <Button variant="outline" size="sm" type="button">Attach</Button>
                          </TableCell>
                          <TableCell className="text-right align-top pt-4 print:hidden">
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
                className="mt-4 print:hidden"
                disabled={isSubmitting}
                onClick={() => append({ id: crypto.randomUUID(), description: "", priority: "", quantity: 1, amount: 0, justification: "", remarks: "" })}
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
          
          <div className="flex items-center gap-4 print:hidden">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
              Submit for Approval
            </Button>
            <Button type="button" variant="secondary" onClick={handleSaveAsDraft} disabled={isSubmitting}>
              {isSubmitting && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
              Save as Draft
            </Button>
            <Button type="button" variant="outline" onClick={() => window.print()}>
              Print &amp; Preview
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
