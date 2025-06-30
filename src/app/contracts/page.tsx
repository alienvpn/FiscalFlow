
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addDays, subDays, format, isBefore, isAfter } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/datepicker";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { organizations, departments, subDepartments, registryItems, vendors, initialContracts } from "@/lib/mock-data";


const contractSchema = z.object({
  id: z.string().optional(),
  contractDescription: z.string().min(1, "Contract Description is required."),
  quantity: z.coerce.number().min(1, "Quantity is required."),
  supplierId: z.string().min(1, "Supplier is required."),
  mainDepartmentId: z.string().min(1, "Main Department is required."),
  subDepartmentId: z.string().min(1, "Sub Department is required."),
  contractPeriod: z.string().min(1, "Period of contract is required."),
  contractAmount: z.coerce.number().min(0, "Amount is required."),
  paymentTerms: z.string().min(1, "Payment Terms are required."),
  serviceStartDate: z.date({ required_error: "Service Start Date is required." }),
  serviceEndDate: z.date({ required_error: "Service End Date is required." }),
  nextRenewalDate: z.date().optional(),
  contractStatus: z.string().optional(),
  
  contractDocument: z.any().optional(),
  prCreateDate: z.date().optional(),
  prApproveDate: z.date().optional(),
  lpoIssueDate: z.date().optional(),
  lpoNumber: z.string().optional(),
  lpoAttachment: z.any().optional(),
  invoiceReceivedDate: z.date().optional(),
  invoiceAttachment: z.any().optional(),
  invoiceToFinanceDate: z.date().optional(),
  invoiceToFinanceAttachment: z.any().optional(),
  paymentSentDate: z.date().optional(),
  paymentReferenceAttachment: z.any().optional(),
  otherAttachment: z.any().optional(),
  remarks: z.string().optional(),
});

type ContractFormValues = z.infer<typeof contractSchema>;

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
    const [contracts, setContracts] = React.useState<ContractFormValues[]>(initialContracts);
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

    const availableSubDepartments = React.useMemo(() => {
        return subDepartments.filter(sd => sd.departmentId === mainDepartmentId);
    }, [mainDepartmentId]);

    const organizationName = React.useMemo(() => {
        if (!mainDepartmentId) return "---";
        const dept = departments.find(d => d.id === mainDepartmentId);
        if (!dept) return "---";
        const org = organizations.find(o => o.id === dept.organizationId);
        return org ? org.name : "---";
    }, [mainDepartmentId]);


    const availableFilterDepartments = React.useMemo(() => {
        if (organizationFilter === 'all') return departments;
        return departments.filter(d => d.organizationId === organizationFilter);
    }, [organizationFilter]);

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
    }, [contracts, organizationFilter, departmentFilter]);
    
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

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h2 className="text-[14px] font-bold tracking-tight mb-2">
                Contract Management
            </h2>
            <p className="text-muted-foreground mb-6 text-[12px]">
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
                                    {filteredContracts.length > 0 ? (
                                        filteredContracts.map(contract => (
                                            <TableRow key={contract.id}>
                                                <TableCell className="font-medium text-[11px]">{registryItems.find(i => i.id === contract.contractDescription)?.description}</TableCell>
                                                <TableCell className="text-[11px]">{vendors.find(v => v.id === contract.supplierId)?.name}</TableCell>
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
                                    )}
                                </TableBody>
                            </Table>
                            <Button size="sm" className="mt-4" onClick={handleCreateNew}><Icons.Add className="mr-2" /> Create New Contract</Button>
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
                                        <FormField control={form.control} name="contractDescription" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Contract Description</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="text-[11px]"><SelectValue placeholder="Select an item/service" /></SelectTrigger></FormControl><SelectContent>{registryItems.map(item => (<SelectItem key={item.id} value={item.id} className="text-[11px]">{item.description}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                                        <FormField control={form.control} name="quantity" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Item/Service Quantity</FormLabel><FormControl><Input type="number" className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="supplierId" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Supplier/Vendor</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="text-[11px]"><SelectValue placeholder="Select a vendor" /></SelectTrigger></FormControl><SelectContent>{vendors.map(v => (<SelectItem key={v.id} value={v.id} className="text-[11px]">{v.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4 pt-4">
                                        <FormItem>
                                            <FormLabel className="text-[12px]">Service Allocation Organization</FormLabel>
                                            <Input readOnly disabled value={organizationName} className="text-[11px]" />
                                        </FormItem>
                                        <FormField control={form.control} name="mainDepartmentId" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Service Allocation Main Department</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="text-[11px]"><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl><SelectContent>{departments.map(d => (<SelectItem key={d.id} value={d.id} className="text-[11px]">{d.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                                        <FormField control={form.control} name="subDepartmentId" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Service Allocation Sub Department</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!mainDepartmentId}><FormControl><SelectTrigger className="text-[11px]"><SelectValue placeholder="Select a sub-department" /></SelectTrigger></FormControl><SelectContent>{availableSubDepartments.map(sd => (<SelectItem key={sd.id} value={sd.id} className="text-[11px]">{sd.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
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
                                            <p className="text-[10px] text-muted-foreground">Auto-calculated: 30 days before service end date.</p>
                                        </FormItem>
                                         <FormItem>
                                            <FormLabel className="text-[12px]">Contract Status</FormLabel>
                                            <Input readOnly disabled value={watch("contractStatus") || "---"} className="text-[11px]"/>
                                            <p className="text-[10px] text-muted-foreground">Auto-updated based on the current and end dates.</p>
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
