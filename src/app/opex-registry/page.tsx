
"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icons } from "@/components/icons";
import { useData } from "@/context/data-context";
import { useToast } from "@/hooks/use-toast";
import { sendApprovalRequestNotification } from "@/services/notification-service";
import { opexItemSchema, type OpexItem } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => (currentYear + i).toString());

const opexRegistrySchema = z.object({
  organization: z.string().min(1, "Organization is required."),
  department: z.string().min(1, "Department is required."),
  year: z.string().min(1, "Year is required."),
  items: z.array(opexItemSchema),
});

type OpexFormValues = z.infer<typeof opexRegistrySchema>;

const defaultValues: OpexFormValues = {
    organization: "",
    department: "",
    year: currentYear.toString(),
    items: [],
};

export default function OpexRegistryPage() {
  const { toast } = useToast();
  const { organizations, departments, vendors, opexSheets, setOpexSheets, approvalWorkflows } = useData();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [previousYearItems, setPreviousYearItems] = React.useState<OpexItem[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = React.useState(false);
  const [editingSheetId, setEditingSheetId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState("list");
  const [isReadOnly, setIsReadOnly] = React.useState(false);

  const form = useForm<OpexFormValues>({
    resolver: zodResolver(opexRegistrySchema),
    defaultValues: defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (activeTab === 'list') {
        handleCreateNew();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (
        type === "change" &&
        (name === "organization" || name === "department" || name === "year")
      ) {
        const { organization, department, year } = value;
        if (organization && department && year) {
          const prevYear = (parseInt(year, 10) - 1).toString();
          const sheet = opexSheets.find(
            (s: any) =>
              s.year === prevYear &&
              s.organization === organization &&
              s.department === department
          );
          setPreviousYearItems(sheet ? sheet.items : []);
        } else {
          setPreviousYearItems([]);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, opexSheets]);
  
  const getAnnualValue = (item: OpexItem) => {
    const amount = item.amount || 0;
    if (item.period === "Monthly") return amount * 12;
    if (item.period === "Quarterly") return amount * 4;
    return amount;
  };

  const totalAnnualValue = React.useMemo(() => {
    return watchedItems.reduce((acc, item) => acc + getAnnualValue(item), 0);
  }, [watchedItems]);

  const previousYearTotalAnnualValue = React.useMemo(() => {
    return previousYearItems.reduce((acc, item) => acc + getAnnualValue(item), 0);
  }, [previousYearItems]);

  const getOrgName = (id: string) => organizations.find(o => o.id === id)?.name || "N/A";
  const getDeptName = (id: string) => departments.find(d => d.id === id)?.name || "N/A";
  const getSheetTotal = (items: OpexItem[]) => items.reduce((acc, item) => acc + getAnnualValue(item), 0);

  const handleEditSheet = (sheet: any) => {
    setEditingSheetId(sheet.id);
    setIsReadOnly(sheet.status !== 'Draft');
    form.reset(sheet);
    setActiveTab("form");
  };

  const handleDeleteSheet = (sheetId: string) => {
    setOpexSheets(prev => prev.filter(s => s.id !== sheetId));
    toast({
        title: "Draft Deleted",
        description: "The draft OPEX sheet has been successfully deleted.",
        variant: "destructive"
    });
  };

  const handleCreateNew = () => {
    setEditingSheetId(null);
    setIsReadOnly(false);
    form.reset(defaultValues);
    setActiveTab("form");
  };

  const generateOpexSeqNum = (index: number) => {
    const { organization, department, year } = form.getValues();
    const orgName = organizations.find((o) => o.id === organization)?.name.substring(0, 3).toUpperCase() || 'ORG';
    const deptName = departments.find((d) => d.id === department)?.name.substring(0, 4).toUpperCase() || 'DEPT';
    const itemNum = (index + 1).toString().padStart(3, '0');
    return `OPEX/${orgName}/${deptName}/${year}/${itemNum}`;
  };

  async function handleFormAction(values: OpexFormValues, status: 'Pending Approval' | 'Draft') {
    setIsSubmitting(true);
    try {
      if (editingSheetId) {
        setOpexSheets(prev => prev.map(s => s.id === editingSheetId ? { ...s, ...values, status } : s));
        if (status === 'Draft') {
            toast({ title: 'Draft Updated', description: 'Your OPEX draft has been updated.' });
        } else {
            toast({ title: 'Sheet Submitted', description: 'Your OPEX sheet has been updated and submitted for approval.' });
        }
      } else {
        const newSheet = { ...values, status, id: crypto.randomUUID() };
        setOpexSheets(prev => [...prev, newSheet]);
        if (status === 'Draft') {
            toast({ title: 'Draft Saved', description: 'Your OPEX sheet has been saved as a draft.' });
        } else {
            toast({ title: 'Sheet Submitted', description: 'Your OPEX sheet has been submitted for approval.' });
        }
      }

      if (status === 'Pending Approval') {
          const firstApproverRole = approvalWorkflows.budget[0]?.approverRole;
          if (!firstApproverRole) throw new Error("No approver role found.");
          await sendApprovalRequestNotification({
              approverRole: firstApproverRole, sheetType: 'OPEX',
              sheetDetails: {
                  organization: getOrgName(values.organization), department: getDeptName(values.department), year: values.year,
              }
          });
      }

      handleCreateNew();
      setActiveTab("list");
    } catch (error) {
      console.error("Failed to submit OPEX sheet:", error);
      toast({
          title: "Action Failed",
          description: "An error occurred while saving the sheet.",
          variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmit(values: OpexFormValues) {
    await handleFormAction(values, 'Pending Approval');
  }

  async function handleSaveAsDraft() {
    const values = form.getValues();
    await handleFormAction(values, 'Draft');
  }

  const handleDownloadSample = () => {
    const headers = ["description", "period", "amount", "implementation", "serviceStatus", "supplier", "remarks"];
    const sampleData = ["Monthly Internet Leased Line", "Monthly", "2500", "Renewal", "Active", vendors[0]?.companyName || "Sample Vendor Inc", "100Mbps speed"];
    const csvContent = [headers.join(","), sampleData.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "opex_items_sample_import.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            try {
                const newItems: OpexItem[] = [];
                const errors: string[] = [];

                results.data.forEach((row: any, index: number) => {
                    const supplier = vendors.find(v => v.companyName?.trim().toLowerCase() === row.supplier?.trim().toLowerCase());
                    if (!supplier) {
                        errors.push(`Row ${index + 2}: Supplier '${row.supplier}' not found in the Vendors list. Please add it first.`);
                        return;
                    }

                    const itemData = {
                        id: crypto.randomUUID(),
                        description: row.description,
                        period: row.period,
                        amount: row.amount ? Number(row.amount) : undefined,
                        implementation: row.implementation,
                        serviceStatus: row.serviceStatus,
                        supplier: supplier.id,
                        remarks: row.remarks
                    };
                    
                    const validation = opexItemSchema.safeParse(itemData);
                    if (validation.success) {
                        newItems.push(validation.data);
                    } else {
                        const errorMessages = validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
                        errors.push(`Row ${index + 2}: ${errorMessages}`);
                    }
                });

                if (errors.length > 0) {
                    toast({
                        variant: "destructive", title: "Import Failed",
                        description: (<div className="max-h-40 overflow-y-auto"><p className="mb-2">Some rows could not be imported:</p><ul className="list-disc pl-5 text-xs space-y-1">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul></div>),
                        duration: 8000,
                    });
                } 
                if (newItems.length > 0) {
                    append(newItems);
                    toast({ title: "Import Complete", description: `${newItems.length} item(s) were successfully added. ${errors.length} row(s) failed.` });
                } else if (errors.length === 0) {
                     toast({ title: "No Data Imported", description: "The file was empty or contained no valid data." });
                }
            } catch (e) {
                 toast({ variant: "destructive", title: "Import Error", description: "An unexpected error occurred." });
                console.error(e);
            } finally {
                if(fileInputRef.current) fileInputRef.current.value = "";
            }
        },
        error: (error) => {
            toast({ variant: "destructive", title: "Import Error", description: `Failed to parse CSV file: ${error.message}` });
        }
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-[14px] font-bold tracking-tight mb-2 print:text-[12px]">
        OPEX Items Sheet
      </h2>
      <p className="text-muted-foreground mb-6 text-[12px] print:text-[10px]">
        Create, view, and manage OPEX sheets for specific organizations, departments, and years.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Existing Sheets</TabsTrigger>
            <TabsTrigger value="form">{editingSheetId ? 'Edit/View OPEX Sheet' : 'Create New OPEX Sheet'}</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
             <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-[13px]">Existing OPEX Sheets</CardTitle>
                            <CardDescription className="text-[12px]">View and edit your saved sheets.</CardDescription>
                        </div>
                        <Button onClick={handleCreateNew} size="sm"><Icons.Add className="mr-2"/> Create New Sheet</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Organization</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Total Annual Value (QAR)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isClient && opexSheets.length > 0 ? (
                                opexSheets.map(sheet => (
                                    <TableRow key={sheet.id}>
                                        <TableCell className="text-[11px] font-medium">{getOrgName(sheet.organization)}</TableCell>
                                        <TableCell className="text-[11px]">{getDeptName(sheet.department)}</TableCell>
                                        <TableCell className="text-[11px]">{sheet.year}</TableCell>
                                        <TableCell className="text-[11px] font-semibold">{getSheetTotal(sheet.items).toLocaleString()}</TableCell>
                                        <TableCell><Badge variant={sheet.status === 'Draft' ? 'secondary' : 'outline'}>{sheet.status}</Badge></TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEditSheet(sheet)}>
                                                {sheet.status === 'Draft' ? 'Edit' : 'View'}
                                            </Button>
                                            {sheet.status === 'Draft' && (
                                                <Button variant="destructive" size="icon" onClick={() => handleDeleteSheet(sheet.id)}>
                                                    <Icons.Delete className="h-4 w-4"/>
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        {isClient ? "No OPEX sheets found." : "Loading..."}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="form" className="mt-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader><CardTitle className="text-[13px]">Sheet Details</CardTitle><CardDescription className="text-[12px]">Select the organization, department, and year for this OPEX sheet.</CardDescription></CardHeader>
                    <CardContent><div className="grid md:grid-cols-3 gap-4"><FormField control={form.control} name="organization" render={({ field }) => ( <FormItem><FormLabel className="text-[12px]">Organization</FormLabel><FormControl><Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}><SelectTrigger className="text-[11px]"><SelectValue placeholder="Select an organization" /></SelectTrigger><SelectContent>{organizations.map((org) => (<SelectItem key={org.id} value={org.id} className="text-[11px]">{org.name}</SelectItem>))}</SelectContent></Select></FormControl><FormMessage /></FormItem> )}/><FormField control={form.control} name="department" render={({ field }) => ( <FormItem><FormLabel className="text-[12px]">Department</FormLabel><FormControl><Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}><SelectTrigger className="text-[11px]"><SelectValue placeholder="Select a department" /></SelectTrigger><SelectContent>{departments.map((dept) => (<SelectItem key={dept.id} value={dept.id} className="text-[11px]">{dept.name}</SelectItem>))}</SelectContent></Select></FormControl><FormMessage /></FormItem> )}/><FormField control={form.control} name="year" render={({ field }) => ( <FormItem><FormLabel className="text-[12px]">Year</FormLabel><FormControl><Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}><SelectTrigger className="text-[11px]"><SelectValue placeholder="Select a year" /></SelectTrigger><SelectContent>{years.map((y) => (<SelectItem key={y} value={y} className="text-[11px]">{y}</SelectItem>))}</SelectContent></Select></FormControl><FormMessage /></FormItem> )}/></div></CardContent>
                </Card>

                {previousYearItems.length > 0 && (
                    <Card>
                    <CardHeader><CardTitle className="text-[13px]">Reference: {(parseInt(form.getValues().year, 10) - 1)} OPEX Sheet</CardTitle><CardDescription className="text-[12px]">Items from the previous year for your reference.</CardDescription></CardHeader>
                    <CardContent><Table><TableHeader><TableRow><TableHead className="text-[12px]">Description</TableHead><TableHead className="text-[12px]">Period</TableHead><TableHead className="text-[12px]">Amount (QAR)</TableHead><TableHead className="text-right text-[12px]">Annual Value (QAR)</TableHead><TableHead className="text-[12px]">Implementation</TableHead><TableHead className="text-[12px]">Service Status</TableHead><TableHead className="text-[12px]">Supplier</TableHead><TableHead className="text-[12px]">Remarks</TableHead></TableRow></TableHeader><TableBody>{previousYearItems.map(item => {const annualValue = getAnnualValue(item); const supplierName = vendors.find(v => v.id === item.supplier)?.companyName || item.supplier; return (<TableRow key={item.id}><TableCell className="text-[11px]">{item.description}</TableCell><TableCell className="text-[11px]">{item.period}</TableCell><TableCell className="text-[11px]">{item.amount.toLocaleString()}</TableCell><TableCell className="text-right font-medium text-[11px]">{annualValue.toLocaleString()}</TableCell><TableCell className="text-[11px]">{item.implementation}</TableCell><TableCell className="text-[11px]">{item.serviceStatus}</TableCell><TableCell className="text-[11px]">{supplierName}</TableCell><TableCell className="text-[11px]">{item.remarks}</TableCell></TableRow>);})}</TableBody></Table></CardContent>
                    <CardFooter className="flex justify-end"><div className="flex items-center space-x-4 rounded-md border p-4"><div className="flex-1 space-y-1"><p className="text-sm font-medium leading-none">Total Annual Value of Previous Year's Sheet</p><p className="text-sm text-muted-foreground">Sum of all item annual values from last year.</p></div><div className="text-2xl font-bold">{previousYearTotalAnnualValue.toLocaleString()} QAR</div></div></CardFooter>
                    </Card>
                )}

                <Card>
                    <CardHeader><CardTitle className="text-[13px]">OPEX Items</CardTitle><CardDescription className="text-[12px]">Add recurring operational expenses to the sheet.</CardDescription></CardHeader>
                    <CardContent>
                    <div className="rounded-md border"><Table><TableHeader><TableRow><TableHead className="w-[150px] text-[12px]">Seq. No</TableHead><TableHead className="w-[250px] text-[12px]">Description</TableHead><TableHead className="w-[120px] text-[12px]">Period</TableHead><TableHead className="w-[120px] text-[12px]">Amount</TableHead><TableHead className="w-[120px] text-[12px]">Annual Value</TableHead><TableHead className="w-[150px] text-[12px]">Implementation</TableHead><TableHead className="w-[150px] text-[12px]">Service Status</TableHead><TableHead className="w-[150px] text-[12px]">Supplier</TableHead><TableHead className="w-[200px] text-[12px]">Remarks</TableHead><TableHead className="w-[50px] text-right text-[12px] print:hidden">Actions</TableHead></TableRow></TableHeader><TableBody>{fields.map((field, index) => {const annualValue = getAnnualValue(form.watch(`items.${index}`)); return (<TableRow key={field.id}><TableCell className="font-medium text-[11px] align-top pt-5">{generateOpexSeqNum(index)}</TableCell><TableCell className="align-top"><FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (<FormItem><FormControl><Textarea className="text-[11px]" {...field} disabled={isReadOnly} /></FormControl><FormMessage /></FormItem>)}/></TableCell><TableCell className="align-top"><FormField control={form.control} name={`items.${index}.period`} render={({ field }) => ( <FormItem><FormControl><Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}><SelectTrigger className="text-[11px]"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent> <SelectItem value="Monthly" className="text-[11px]">Monthly</SelectItem> <SelectItem value="Quarterly" className="text-[11px]">Quarterly</SelectItem> <SelectItem value="Annually" className="text-[11px]">Annually</SelectItem> </SelectContent></Select></FormControl><FormMessage /></FormItem> )}/></TableCell><TableCell className="align-top"><FormField control={form.control} name={`items.${index}.amount`} render={({ field }) => (<FormItem><FormControl><Input type="number" className="text-[11px]" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} disabled={isReadOnly} /></FormControl><FormMessage /></FormItem>)}/></TableCell><TableCell className="text-right align-top pt-5 font-medium text-[11px]">{annualValue.toLocaleString()} QAR</TableCell><TableCell className="align-top"><FormField control={form.control} name={`items.${index}.implementation`} render={({ field }) => ( <FormItem><FormControl><Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}><SelectTrigger className="text-[11px]"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent> <SelectItem value="New" className="text-[11px]">New</SelectItem> <SelectItem value="Renewal" className="text-[11px]">Renewal</SelectItem> <SelectItem value="Ongoing" className="text-[11px]">Ongoing</SelectItem> </SelectContent></Select></FormControl><FormMessage /></FormItem> )}/></TableCell><TableCell className="align-top"><FormField control={form.control} name={`items.${index}.serviceStatus`} render={({ field }) => ( <FormItem><FormControl><Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}><SelectTrigger className="text-[11px]"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent> <SelectItem value="Active" className="text-[11px]">Active</SelectItem> <SelectItem value="Inactive" className="text-[11px]">Inactive</SelectItem> <SelectItem value="To be Renewed" className="text-[11px]">To be Renewed</SelectItem> </SelectContent></Select></FormControl><FormMessage /></FormItem> )}/></TableCell><TableCell className="align-top"><FormField control={form.control} name={`items.${index}.supplier`} render={({ field }) => ( <FormItem><FormControl><Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}><SelectTrigger className="text-[11px]"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent> {vendors.map(s => <SelectItem key={s.id} value={s.id!} className="text-[11px]">{s.companyName}</SelectItem>)} </SelectContent></Select></FormControl><FormMessage /></FormItem> )}/></TableCell><TableCell className="align-top"><FormField control={form.control} name={`items.${index}.remarks`} render={({ field }) => (<FormItem><FormControl><Textarea className="text-[11px]" {...field} disabled={isReadOnly} /></FormControl><FormMessage /></FormItem>)}/></TableCell><TableCell className="text-right align-top pt-4 print:hidden"><Button variant="ghost" size="icon" type="button" onClick={() => remove(index)} disabled={isReadOnly}><Icons.Delete className="h-4 w-4 text-destructive" /></Button></TableCell></TableRow>);})}{fields.length === 0 && (<TableRow><TableCell colSpan={10} className="h-24 text-center text-[12px] text-muted-foreground">No items added yet.</TableCell></TableRow>)}</TableBody></Table></div>
                    <div className="flex items-center gap-4 mt-4 print:hidden">
                        <Button type="button" variant="outline" size="sm" disabled={isSubmitting || isReadOnly} onClick={() => append({ id: crypto.randomUUID(), description: "", period: "Annually", amount: 0, implementation: "New", serviceStatus: "Active", supplier: "", remarks: "" })}><Icons.Add className="mr-2 h-4 w-4" />Add Item</Button>
                        <Button size="sm" variant="outline" type="button" disabled={isReadOnly} onClick={() => fileInputRef.current?.click()}><Icons.Upload className="mr-2 h-4 w-4" /> Import Items</Button>
                        <Button variant="link" size="sm" type="button" onClick={handleDownloadSample}>Download Sample Format</Button>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileImport}/>
                    </CardContent>
                    <CardFooter className="flex justify-end"><div className="flex items-center space-x-4 rounded-md border p-4"><div className="flex-1 space-y-1"><p className="text-sm font-medium leading-none">Total Annual Value of Sheet</p><p className="text-sm text-muted-foreground">Sum of all item annual values.</p></div><div className="text-2xl font-bold">{totalAnnualValue.toLocaleString()} QAR</div></div></CardFooter>
                </Card>
                
                <div className="flex items-center gap-4 print:hidden">
                    <Button type="submit" disabled={isSubmitting || fields.length === 0 || isReadOnly}>
                        {isSubmitting && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                        {editingSheetId ? 'Update & Submit' : 'Submit for Approval'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleSaveAsDraft} disabled={isSubmitting || fields.length === 0 || isReadOnly}>
                        {isSubmitting && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
                        {editingSheetId ? 'Update Draft' : 'Save as Draft'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => window.print()}>Print &amp; Preview</Button>
                </div>
                </form>
            </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
