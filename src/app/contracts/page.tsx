
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, subDays, format, isBefore, isAfter } from "date-fns";
import Papa from "papaparse";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/datepicker";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { useData } from "@/context/data-context";
import { useToast } from "@/hooks/use-toast";
import { contractSchema, type ContractFormValues } from "@/lib/types";

const defaultValues: Partial<ContractFormValues> = {
  quantity: 1,
  paymentTerms: "Net 30",
};

const FileInput = ({ label, fieldName, form }: { label: string, fieldName: any, form: any }) => {
    const fileRef = React.useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = React.useState<string | null>(null);

    return (
        <FormItem>
            <FormLabel className="text-[12px]">{label}</FormLabel>
            <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                    <Icons.Add className="mr-2 h-4 w-4" />
                    Attach File
                </Button>
                {fileName && <span className="text-xs text-muted-foreground">{fileName}</span>}
                <FormControl>
                    <Input
                        type="file"
                        className="hidden"
                        ref={fileRef}
                        {...form.register(fieldName)}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            setFileName(file ? file.name : null);
                            form.setValue(fieldName, file);
                        }}
                    />
                </FormControl>
            </div>
            <FormMessage />
        </FormItem>
    );
};


export default function ContractsPage() {
    const { 
        contracts, setContracts,
        organizations, departments,
        registryItems, vendors 
    } = useData();
    const { toast } = useToast();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [isClient, setIsClient] = React.useState(false);
    const [editingContractId, setEditingContractId] = React.useState<string | null>(null);
    const [activeTab, setActiveTab] = React.useState("view");
    const [organizationFilter, setOrganizationFilter] = React.useState("all");
    const [departmentFilter, setDepartmentFilter] = React.useState("all");

    const form = useForm<ContractFormValues>({
        resolver: zodResolver(contractSchema),
        defaultValues,
    });
    
    const { watch, setValue, reset } = form;
    const serviceEndDate = watch("serviceEndDate");
    const mainDepartmentId = watch("mainDepartmentId");
    
    React.useEffect(() => {
        setIsClient(true);
    }, []);

    React.useEffect(() => {
        if (serviceEndDate) {
            const renewalDate = subDays(serviceEndDate, 30);
            setValue("nextRenewalDate", renewalDate);

            const today = new Date();
            let status = "Active";
            if (isBefore(serviceEndDate, today)) {
                status = "Expired";
            } else if (isBefore(renewalDate, today)) {
                status = "Expiring Soon";
            }
            setValue("contractStatus", status);
        }
    }, [serviceEndDate, setValue]);

    React.useEffect(() => {
        if (editingContractId) {
            const contractToEdit = contracts.find(c => c.id === editingContractId);
            if (contractToEdit) reset(contractToEdit);
        } else {
            reset(defaultValues);
        }
    }, [editingContractId, contracts, reset]);

    const organizationName = React.useMemo(() => {
        if (!mainDepartmentId) return "---";
        const dept = departments.find(d => d.id === mainDepartmentId);
        if (!dept) return "---";
        const org = organizations.find(o => o.id === dept.organizationId);
        return org ? org.name : "---";
    }, [mainDepartmentId, departments, organizations]);


    const availableFilterDepartments = React.useMemo(() => {
        if (organizationFilter === 'all') return departments;
        return departments.filter(d => d.organizationId === organizationFilter);
    }, [organizationFilter, departments]);

    const filteredContracts = React.useMemo(() => {
        return contracts
            .filter(c => {
                if (organizationFilter === 'all') return true;
                const dept = departments.find(d => d.id === c.mainDepartmentId);
                return dept?.organizationId === organizationFilter;
            })
            .filter(c => {
                if (departmentFilter === 'all') return true;
                return c.mainDepartmentId === departmentFilter;
            });
    }, [contracts, organizationFilter, departmentFilter, departments]);
    
    React.useEffect(() => {
        setDepartmentFilter("all");
    }, [organizationFilter]);


    function handleEdit(contractId: string) {
        setEditingContractId(contractId);
        setActiveTab("create");
    }

    function handleCreateNew() {
        setEditingContractId(null);
        reset(defaultValues);
        setActiveTab("create");
    }
    
    function getStatusBadgeVariant(status: string | undefined) {
        switch (status) {
            case "Active": return "secondary";
            case "Expiring Soon": return "default";
            case "Expired": return "destructive";
            default: return "outline";
        }
    }

    function onSubmit(values: ContractFormValues) {
        if (editingContractId) {
            setContracts(contracts.map(c => (c.id === editingContractId ? { ...values, id: c.id } : c)));
        } else {
            setContracts([...contracts, { ...values, id: `con-${Date.now()}` }]);
        }
        setEditingContractId(null);
        setActiveTab("view");
    }

    const getContractDescription = (contract: ContractFormValues) => {
        const item = registryItems.find(i => i.id === contract.contractDescription);
        if (!item) return "N/A";
        return item.type === "device" ? item.deviceDescription : item.serviceDescription;
    };

    const handleDownloadSample = () => {
        const headers = [
            "contractDescription", "quantity", "supplierName", "mainDepartmentName", 
            "contractPeriod", "contractAmount", "paymentTerms",
            "serviceStartDate", "serviceEndDate", "lpoNumber", "remarks"
        ];
        const sampleData = [
            "Annual Firewall Subscription", "1", "SecureNet Solutions", "Information Technology",
            "1 Year", "15000", "Net 30", 
            "2025-01-01", "2025-12-31", "LPO-2025-001", "Standard renewal"
        ];
        const csvContent = [headers.join(","), sampleData.join(",")].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "contracts_sample_import.csv");
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
                    const newContracts: ContractFormValues[] = [];
                    const errors: string[] = [];

                    results.data.forEach((row: any, index: number) => {
                        const item = registryItems.find(i => (i.type === 'device' ? i.deviceDescription : i.serviceDescription)?.trim().toLowerCase() === row.contractDescription?.trim().toLowerCase());
                        const supplier = vendors.find(v => v.companyName?.trim().toLowerCase() === row.supplierName?.trim().toLowerCase());
                        const mainDept = departments.find(d => d.name?.trim().toLowerCase() === row.mainDepartmentName?.trim().toLowerCase());

                        if (!item) { errors.push(`Row ${index + 2}: Contract description '${row.contractDescription}' not found in registry.`); return; }
                        if (!supplier) { errors.push(`Row ${index + 2}: Supplier '${row.supplierName}' not found.`); return; }
                        if (!mainDept) { errors.push(`Row ${index + 2}: Main department '${row.mainDepartmentName}' not found.`); return; }

                        const contractData = {
                            contractDescription: item.id,
                            quantity: row.quantity ? Number(row.quantity) : undefined,
                            supplierId: supplier.id,
                            mainDepartmentId: mainDept.id,
                            contractPeriod: row.contractPeriod,
                            contractAmount: row.contractAmount ? Number(row.contractAmount) : undefined,
                            paymentTerms: row.paymentTerms,
                            serviceStartDate: row.serviceStartDate ? new Date(row.serviceStartDate) : undefined,
                            serviceEndDate: row.serviceEndDate ? new Date(row.serviceEndDate) : undefined,
                            lpoNumber: row.lpoNumber,
                            remarks: row.remarks
                        };
                        
                        const validation = contractSchema.safeParse(contractData);
                        if (validation.success) {
                            newContracts.push({
                                ...validation.data, 
                                id: `con-${Date.now()}-${index}`
                            });
                        } else {
                            const errorMessages = validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
                            errors.push(`Row ${index + 2}: ${errorMessages}`);
                        }
                    });

                    if (errors.length > 0) {
                        toast({
                            variant: "destructive",
                            title: "Import Failed",
                            description: (
                                <div className="max-h-40 overflow-y-auto">
                                    <p className="mb-2">Some rows could not be imported:</p>
                                    <ul className="list-disc pl-5 text-xs space-y-1">
                                        {errors.map((e, i) => <li key={i}>{e}</li>)}
                                    </ul>
                                </div>
                            ),
                             duration: 8000,
                        });
                    } 
                    if (newContracts.length > 0) {
                        setContracts(prev => [...prev, ...newContracts]);
                        toast({
                            title: "Import Complete",
                            description: `${newContracts.length} contract(s) were successfully imported. ${errors.length} row(s) failed.`,
                        });
                    } else if (errors.length === 0) {
                         toast({
                            title: "No Data Imported",
                            description: "The file was empty or contained no valid data.",
                        });
                    }
                } catch (e) {
                     toast({
                        variant: "destructive",
                        title: "Import Error",
                        description: "An unexpected error occurred during import.",
                    });
                    console.error(e);
                } finally {
                    if(fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                }
            },
            error: (error) => {
                toast({
                    variant: "destructive",
                    title: "Import Error",
                    description: `Failed to parse CSV file: ${error.message}`,
                });
            }
        });
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h2 className="text-[14px] font-bold tracking-tight mb-2 print:text-[12px]">
                Contract Management
            </h2>
            <p className="text-muted-foreground mb-6 text-[12px] print:text-[10px]">
                Create, manage, and track all organizational contracts, SLAs, and AMCs.
            </p>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="view">View Contracts</TabsTrigger>
                    <TabsTrigger value="create">{editingContractId ? "Edit Contract" : "Create New Contract"}</TabsTrigger>
                </TabsList>
                <TabsContent value="view">
                    <Card className="mt-4">
                         <CardHeader>
                            <CardTitle className="text-[13px]">Existing Contracts</CardTitle>
                            <div className="grid md:grid-cols-2 gap-4 pt-4">
                                <div>
                                    <Label className="text-[12px]">Filter by Organization</Label>
                                    <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
                                        <SelectTrigger className="text-[11px] mt-2">
                                            <SelectValue placeholder="Select an organization" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all" className="text-[11px]">All Organizations</SelectItem>
                                            {organizations.map((org) => (
                                                <SelectItem key={org.id} value={org.id} className="text-[11px]">{org.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-[12px]">Filter by Department</Label>
                                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                        <SelectTrigger className="text-[11px] mt-2">
                                            <SelectValue placeholder="Select a department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all" className="text-[11px]">All Departments</SelectItem>
                                            {availableFilterDepartments.map((dept) => (
                                                 <SelectItem key={dept.id} value={dept.id} className="text-[11px]">{dept.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>End Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isClient ? (
                                        filteredContracts.length > 0 ? (
                                            filteredContracts.map(contract => (
                                                <TableRow key={contract.id}>
                                                    <TableCell className="font-medium text-[11px]">{getContractDescription(contract)}</TableCell>
                                                    <TableCell className="text-[11px]">{vendors.find(v => v.id === contract.supplierId)?.companyName}</TableCell>
                                                    <TableCell className="text-[11px]">{contract.serviceEndDate ? format(contract.serviceEndDate, "PPP") : "N/A"}</TableCell>
                                                    <TableCell><Badge variant={getStatusBadgeVariant(contract.contractStatus)}>{contract.contractStatus || "N/A"}</Badge></TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" onClick={() => contract.id && handleEdit(contract.id)}>Edit</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                    No contracts found.
                                                </TableCell>
                                            </TableRow>
                                        )
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                Loading...
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <div className="flex items-center gap-2 mt-4">
                                <Button size="sm" onClick={handleCreateNew}><Icons.Add className="mr-2" /> Create New Contract</Button>
                                <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}><Icons.Upload className="mr-2 h-4 w-4" /> Import Contracts</Button>
                                <Button variant="link" size="sm" onClick={handleDownloadSample}>Download Sample Format</Button>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".csv"
                                onChange={handleFileImport}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="create">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                            <Card>
                                <CardHeader><CardTitle className="text-[13px]">Contract Details</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <FormField control={form.control} name="contractDescription" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Contract Description</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="text-[11px]"><SelectValue placeholder="Select an item/service" /></SelectTrigger></FormControl><SelectContent>{registryItems.map(item => (<SelectItem key={item.id} value={item.id!} className="text-[11px]">{item.type === "device" ? item.deviceDescription : item.serviceDescription}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                                        <FormField control={form.control} name="quantity" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Item/Service Quantity</FormLabel><FormControl><Input type="number" className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="supplierId" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Supplier/Vendor</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="text-[11px]"><SelectValue placeholder="Select a vendor" /></SelectTrigger></FormControl><SelectContent>{vendors.map(v => (<SelectItem key={v.id} value={v.id!} className="text-[11px]">{v.companyName}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 pt-4">
                                        <FormItem>
                                            <FormLabel className="text-[12px]">Service Allocation Organization</FormLabel>
                                            <Input readOnly disabled value={organizationName} className="text-[11px]" />
                                        </FormItem>
                                        <FormField control={form.control} name="mainDepartmentId" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Service Allocation Main Department</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="text-[11px]"><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl><SelectContent>{departments.map(d => (<SelectItem key={d.id} value={d.id} className="text-[11px]">{d.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                 <CardHeader><CardTitle className="text-[13px]">Timeline & Financials</CardTitle></CardHeader>
                                 <CardContent className="space-y-4">
                                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <FormField control={form.control} name="contractPeriod" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Period of Contract</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="text-[11px]"><SelectValue placeholder="Select period" /></SelectTrigger></FormControl><SelectContent>{["1 Year", "2 Years", "3 Years", "4 Years", "5 Years"].map(p => (<SelectItem key={p} value={p} className="text-[11px]">{p}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                                        <FormField control={form.control} name="contractAmount" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Amount of Contract (QAR)</FormLabel><FormControl><Input type="number" className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="paymentTerms" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Payment Terms</FormLabel><FormControl><Input className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                        <FormField control={form.control} name="serviceStartDate" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Service Start Date</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} placeholder="Select date" /></FormControl><FormMessage /></FormItem>)}/>
                                        <FormField control={form.control} name="serviceEndDate" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Service End Date</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} placeholder="Select date" /></FormControl><FormMessage /></FormItem>)}/>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <FormItem>
                                            <FormLabel className="text-[12px]">Service Next Renewal Date</FormLabel>
                                            <Input readOnly disabled value={watch("nextRenewalDate") ? format(watch("nextRenewalDate")!, "PPP") : "---"} className="text-[11px]" />
                                            <p className="text-[10px] text-muted-foreground print:text-[10px]">Auto-calculated: 30 days before service end date.</p>
                                        </FormItem>
                                         <FormItem>
                                            <FormLabel className="text-[12px]">Contract Status</FormLabel>
                                            <Input readOnly disabled value={watch("contractStatus") || "---"} className="text-[11px]"/>
                                            <p className="text-[10px] text-muted-foreground print:text-[10px]">Auto-updated based on the current and end dates.</p>
                                        </FormItem>
                                    </div>
                                 </CardContent>
                            </Card>
                             
                            <Card>
                                <CardHeader><CardTitle className="text-[13px]">Procurement Details</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <FormField control={form.control} name="prCreateDate" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">PR Create Date</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} placeholder="Select date" /></FormControl><FormMessage /></FormItem>)}/>
                                        <FormField control={form.control} name="prApproveDate" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">PR Approve Date</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} placeholder="Select date" /></FormControl><FormMessage /></FormItem>)}/>
                                        <FormField control={form.control} name="lpoIssueDate" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">LPO Issue Date</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} placeholder="Select date" /></FormControl><FormMessage /></FormItem>)}/>
                                        <FormField control={form.control} name="lpoNumber" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">LPO Number</FormLabel><FormControl><Input className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                    </div>
                                </CardContent>
                            </Card>

                             <Card>
                                <CardHeader><CardTitle className="text-[13px]">Invoice & Payment Details</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="grid md:grid-cols-3 gap-4">
                                        <FormField control={form.control} name="invoiceReceivedDate" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Invoice from Supplier Received Date</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} placeholder="Select date" /></FormControl><FormMessage /></FormItem>)}/>
                                        <FormField control={form.control} name="invoiceToFinanceDate" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Invoice sent to Finance Date</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} placeholder="Select date" /></FormControl><FormMessage /></FormItem>)}/>
                                        <FormField control={form.control} name="paymentSentDate" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Payment sent to Supplier Date</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} placeholder="Select date" /></FormControl><FormMessage /></FormItem>)}/>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle className="text-[13px]">Attachments & Remarks</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <FileInput label="Contract/Document Attachment" fieldName="contractDocument" form={form} />
                                        <FileInput label="LPO Attachment" fieldName="lpoAttachment" form={form} />
                                        <FileInput label="Supplier Invoice Attachment" fieldName="invoiceAttachment" form={form} />
                                        <FileInput label="Invoice Attachment (to Finance)" fieldName="invoiceToFinanceAttachment" form={form} />
                                        <FileInput label="Payment Reference Attachment" fieldName="paymentReferenceAttachment" form={form} />
                                        <FileInput label="Other Attachment" fieldName="otherAttachment" form={form} />
                                    </div>
                                    <Separator />
                                    <FormField control={form.control} name="remarks" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Re-Marks</FormLabel><FormControl><Textarea className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                </CardContent>
                            </Card>

                            <div className="flex items-center gap-4">
                                <Button type="submit">{editingContractId ? "Update Contract" : "Save Contract"}</Button>
                            </div>
                        </form>
                    </Form>
                </TabsContent>
            </Tabs>
        </div>
    );
}

    