
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { intervalToDuration } from "date-fns"
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/datepicker"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { useData } from "@/context/data-context";
import { registrySchema, deviceSchema, serviceSchema, type RegistryFormValues } from "@/lib/types";

const defaultValues = {
  type: "device" as const,
  deviceDescription: "",
  model: "",
  make: "",
  countryOfMake: "",
  partNumber: "",
  serialNumber: "",
  macAddress: "",
}

export default function ItemRegistryPage() {
  const { registryItems, setRegistryItems, vendors } = useData();
  const [editingItemId, setEditingItemId] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState("view")
  const [isClient, setIsClient] = React.useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<RegistryFormValues>({
    resolver: zodResolver(registrySchema),
    defaultValues: defaultValues,
  })

  const itemType = form.watch("type")
  const serviceStartDate = form.watch("serviceStartDate" as any)
  const serviceEndDate = form.watch("serviceEndDate" as any)
  const [servicePeriod, setServicePeriod] = React.useState<string | null>(null)

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  React.useEffect(() => {
    if (editingItemId) {
      const itemToEdit = registryItems.find((item) => item.id === editingItemId)
      if (itemToEdit) {
        form.reset(itemToEdit)
      }
    } else {
      form.reset(defaultValues)
    }
  }, [editingItemId, form, registryItems])

  React.useEffect(() => {
    if (serviceStartDate && serviceEndDate && serviceStartDate < serviceEndDate) {
      const period = intervalToDuration({
        start: serviceStartDate,
        end: serviceEndDate,
      })
      const parts = []
      if (period.years) parts.push(`${period.years} year(s)`)
      if (period.months) parts.push(`${period.months} month(s)`)
      if (period.days) parts.push(`${period.days} day(s)`)
      setServicePeriod(parts.length > 0 ? parts.join(", ") : "Less than a day")
    } else {
      setServicePeriod(null)
    }
  }, [serviceStartDate, serviceEndDate])

  function handleEdit(itemId: string) {
    setEditingItemId(itemId)
    setActiveTab("create")
  }

  function handleCreateNew() {
    setEditingItemId(null)
    setActiveTab("create")
  }

  function onSubmit(values: RegistryFormValues) {
    if (editingItemId) {
      setRegistryItems(registryItems.map((item) => (item.id === editingItemId ? { ...values, id: item.id } : item)))
    } else {
      setRegistryItems([...registryItems, { ...values, id: `item-${Date.now()}` }])
    }
    setEditingItemId(null)
    setActiveTab("view")
  }
  
  const handleDownloadSample = () => {
    const headers = [
      "type", "description", "model", "make", "countryOfMake", "partNumber", "serialNumber", "macAddress", 
      "manufactureDate", "expireDate", "endOfSalesDate", "endOfSupportDate", "endOfLifeDate", 
      "warrantyStartDate", "warrantyEndDate", "serviceStartDate", "serviceEndDate", "supplierName"
    ];
    const sampleData = [
      [
        "device", "Dell XPS 15 Laptop", "XPS 15 9530", "Dell", "China", "DXPS159530-123", "SN123456789", "00:1A:2B:3C:4D:5E",
        "2023-01-01", "", "", "", "2028-01-01",
        "2023-01-15", "2026-01-14", "", "", ""
      ].join(","),
      [
        "service", "Annual Firewall Subscription", "", "", "", "", "", "",
        "", "", "", "", "", 
        "", "", "2024-01-01", "2024-12-31", vendors[0]?.companyName || "Sample Vendor Inc"
      ].join(",")
    ];
    const csvContent = [
        headers.join(","),
        ...sampleData
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "registry_items_sample_import.csv");
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
                const newItems: RegistryFormValues[] = [];
                const errors: string[] = [];

                results.data.forEach((row: any, index: number) => {
                    const rowNum = index + 2;
                    const type = row.type?.trim().toLowerCase();
                    
                    if (type === 'device') {
                        const deviceData = {
                            type: 'device',
                            deviceDescription: row.description,
                            model: row.model,
                            make: row.make,
                            countryOfMake: row.countryOfMake,
                            partNumber: row.partNumber,
                            serialNumber: row.serialNumber,
                            macAddress: row.macAddress,
                            manufactureDate: row.manufactureDate ? new Date(row.manufactureDate) : undefined,
                            expireDate: row.expireDate ? new Date(row.expireDate) : undefined,
                            endOfSalesDate: row.endOfSalesDate ? new Date(row.endOfSalesDate) : undefined,
                            endOfSupportDate: row.endOfSupportDate ? new Date(row.endOfSupportDate) : undefined,
                            endOfLifeDate: row.endOfLifeDate ? new Date(row.endOfLifeDate) : undefined,
                            warrantyStartDate: row.warrantyStartDate ? new Date(row.warrantyStartDate) : undefined,
                            warrantyEndDate: row.warrantyEndDate ? new Date(row.warrantyEndDate) : undefined,
                        };
                        const validation = deviceSchema.safeParse(deviceData);
                        if (validation.success) {
                            newItems.push({ ...validation.data, id: `item-${Date.now()}-${rowNum}` });
                        } else {
                            const errorMessages = validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
                            errors.push(`Row ${rowNum}: ${errorMessages}`);
                        }
                    } else if (type === 'service') {
                        const supplier = vendors.find(v => v.companyName?.trim().toLowerCase() === row.supplierName?.trim().toLowerCase());
                        if (!supplier) {
                            errors.push(`Row ${rowNum}: Supplier '${row.supplierName}' not found. Please add it first.`);
                            return;
                        }
                        
                        const serviceData = {
                            type: 'service',
                            serviceDescription: row.description,
                            serviceStartDate: row.serviceStartDate ? new Date(row.serviceStartDate) : undefined,
                            serviceEndDate: row.serviceEndDate ? new Date(row.serviceEndDate) : undefined,
                            supplierId: supplier.id,
                        };
                        const validation = serviceSchema.safeParse(serviceData);
                        if (validation.success) {
                            newItems.push({ ...validation.data, id: `item-${Date.now()}-${rowNum}` });
                        } else {
                            const errorMessages = validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
                            errors.push(`Row ${rowNum}: ${errorMessages}`);
                        }
                    } else {
                        errors.push(`Row ${rowNum}: Invalid or missing 'type'. Must be 'device' or 'service'.`);
                    }
                });

                if (errors.length > 0) {
                    toast({
                        variant: "destructive",
                        title: "Import Incomplete",
                        description: (
                            <div className="max-h-40 overflow-y-auto">
                                <p className="mb-2">Some rows could not be imported:</p>
                                <ul className="list-disc pl-5 text-xs space-y-1">
                                    {errors.map((e, i) => <li key={i}>{e}</li>)}
                                </ul>
                            </div>
                        ),
                         duration: 9000,
                    });
                } 
                if (newItems.length > 0) {
                    setRegistryItems(prev => [...prev, ...newItems]);
                    toast({
                        title: "Import Complete",
                        description: `${newItems.length} item(s) were successfully imported. ${errors.length} row(s) failed.`,
                    });
                } else if (errors.length === 0) {
                     toast({
                        variant: "destructive",
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
        Device/Item/Service Registry
      </h2>
      <p className="text-muted-foreground mb-6 text-[12px] print:text-[10px]">
        Manage your devices, items, and services.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">View Existing Items</TabsTrigger>
          <TabsTrigger value="create">
            {editingItemId ? "Edit Item" : "Create New Item"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="view">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-[13px]">Existing Items</CardTitle>
              <CardDescription className="text-[12px]">
                Browse and manage all registered items and services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isClient ? (
                      registryItems.length > 0 ? (
                        registryItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium text-[11px]">
                              {item.type === "device" ? item.deviceDescription : item.serviceDescription}
                            </TableCell>
                            <TableCell className="text-[11px]">
                              <Badge variant="outline" className="capitalize">{item.type}</Badge>
                            </TableCell>
                            <TableCell className="text-[11px] text-muted-foreground">
                              {item.type === "device" && `Model: ${item.model || "N/A"}`}
                              {item.type === "service" && `Supplier: ${vendors.find(v => v.id === item.supplierId)?.companyName || "N/A"}`}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => item.id && handleEdit(item.id)}>
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                            No items found.
                          </TableCell>
                        </TableRow>
                      )
                    ) : (
                      <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                              Loading...
                          </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button size="sm" onClick={handleCreateNew}>
                  <Icons.Add className="mr-2" />
                  Create New Item
                </Button>
                <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Icons.Upload className="mr-2 h-4 w-4" /> Import Items
                </Button>
                <Button variant="link" size="sm" onClick={handleDownloadSample}>
                    Download Sample Format
                </Button>
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[13px]">Registry Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[12px]">
                          Select Type
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            form.reset({ ...defaultValues, type: value as "device" | "service" })
                          }}
                          defaultValue={field.value}
                          disabled={!!editingItemId}
                        >
                          <FormControl>
                            <SelectTrigger className="text-[11px]">
                              <SelectValue placeholder="Select a registry type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="device" className="text-[11px]">Device / Item</SelectItem>
                            <SelectItem value="service" className="text-[11px]">Service</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {itemType === "service" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[13px]">Service Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="serviceDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[12px]">Service / Description</FormLabel>
                          <FormControl>
                            <Textarea className="text-[11px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="serviceStartDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[12px]">Service Start Date</FormLabel>
                            <FormControl>
                              <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select start date"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="serviceEndDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[12px]">Service End Date</FormLabel>
                            <FormControl>
                              <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select end date"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {servicePeriod && (
                      <div>
                        <FormLabel className="text-[12px]">Service Period</FormLabel>
                        <p className="text-[11px] text-muted-foreground mt-2">{servicePeriod}</p>
                      </div>
                    )}
                    <FormField
                      control={form.control}
                      name="supplierId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[12px]">Supplier / Vendor</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="text-[11px]">
                                <SelectValue placeholder="Select a supplier" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vendors.map(vendor => (
                                <SelectItem key={vendor.id} value={vendor.id!} className="text-[11px]">
                                  {vendor.companyName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}

              {itemType === "device" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[13px]">Device / Item Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="deviceDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[12px]">Device/Item Description</FormLabel>
                          <FormControl>
                            <Textarea className="text-[11px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-[12px] font-medium mb-4 print:text-[12px]">Specifications</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                          <FormField control={form.control} name="model" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Model</FormLabel><FormControl><Input className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="make" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Make</FormLabel><FormControl><Input className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="countryOfMake" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Country of Make</FormLabel><FormControl><Input className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="partNumber" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Part Number</FormLabel><FormControl><Input className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="serialNumber" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Serial Number</FormLabel><FormControl><Input className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="macAddress" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">MAC-Address</FormLabel><FormControl><Input className="text-[11px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-[12px] font-medium mb-4 print:text-[12px]">Lifecycle Dates</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="manufactureDate" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Manufacture Date</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} placeholder="Select date" /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="expireDate" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Expire Date</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} placeholder="Select date" /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="endOfSalesDate" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">End of Sales Date</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} placeholder="Select date" /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="endOfSupportDate" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">End of Support Date</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} placeholder="Select date" /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="endOfLifeDate" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">End of Life Date</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} placeholder="Select date" /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                    </div>
                    
                    <Separator />

                    <div>
                        <h3 className="text-[12px] font-medium mb-4 print:text-[12px]">Warranty</h3>
                       <div className="grid md:grid-cols-2 gap-4">
                           <FormField control={form.control} name="warrantyStartDate" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Warranty Start Date</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} placeholder="Select date" /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="warrantyEndDate" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Warranty End Date</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} placeholder="Select date" /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex items-center gap-4">
                <Button type="submit">Save Data</Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
