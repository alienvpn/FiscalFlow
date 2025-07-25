
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icons } from "@/components/icons";
import { countryCityData } from "@/lib/location-data";
import { useData } from "@/context/data-context";
import { vendorSchema, type VendorFormValues } from "@/lib/types";
import { z } from "zod";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";

const defaultValues: Partial<VendorFormValues> = {
    companyName: "",
    address: "",
    country: "",
    city: "",
    email: "",
    telephone: "",
    fax: "",
    whatsapp: "",
    website: "",
    accountManager: {
      name: "",
      designation: "",
      email: "",
      telephone: "",
      mobile: "",
      whatsapp: "",
    },
    techSupport1: { name: "", email: "", telephone: "", mobile: "" },
    techSupport2: { name: "", email: "", telephone: "", mobile: "" },
    techSupport3: { name: "", email: "", telephone: "", mobile: "" },
};

export default function VendorsPage() {
  const { vendors, setVendors } = useData();
  const [editingVendorId, setEditingVendorId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState("view");
  const [cities, setCities] = React.useState<string[]>([]);
  const [isClient, setIsClient] = React.useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: defaultValues,
  });

  const { watch, setValue, reset } = form;
  const selectedCountry = watch("country");
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (selectedCountry) {
      const countryData = countryCityData.find(c => c.name === selectedCountry);
      setCities(countryData?.cities || []);
      setValue("city", "");
    } else {
      setCities([]);
    }
  }, [selectedCountry, setValue]);

  React.useEffect(() => {
    if (editingVendorId) {
      const vendorToEdit = vendors.find((v) => v.id === editingVendorId);
      if (vendorToEdit) {
        reset(vendorToEdit);
        const countryData = countryCityData.find(c => c.name === vendorToEdit.country);
        setCities(countryData?.cities || []);
        setValue("city", vendorToEdit.city);
      }
    } else {
      reset(defaultValues);
    }
  }, [editingVendorId, vendors, reset, setValue]);

  function handleEdit(vendorId: string) {
    setEditingVendorId(vendorId);
    setActiveTab("create");
  }

  function handleCreateNew() {
    setEditingVendorId(null);
    setActiveTab("create");
  }

  function onSubmit(values: z.infer<typeof vendorSchema>) {
    if (editingVendorId) {
      setVendors(vendors.map((v) => (v.id === editingVendorId ? { ...values, id: v.id } : v)));
    } else {
      setVendors([...vendors, { ...values, id: `vendor-${Date.now()}` }]);
    }
    setEditingVendorId(null);
    setActiveTab("view");
  }

  const handleDownloadSample = () => {
    const headers = [
      "companyName", "address", "country", "city", "email", "telephone", "fax", "whatsapp", "website",
      "accountManagerName", "accountManagerDesignation", "accountManagerEmail", "accountManagerTelephone", "accountManagerMobile", "accountManagerWhatsapp"
    ];
    const sampleData = [
      "Global Tech Inc.", "123 Innovation Drive, Tech Park, Zone A", "United States", "New York City", "contact@globaltech.com", "+1-212-555-0100", "+1-212-555-0101", "+1-212-555-0102", "https://globaltech.com",
      "John Doe", "Sales Manager", "john.doe@globaltech.com", "+1-212-555-0103", "+1-917-555-0104", "+1-917-555-0105"
    ];
    const csvContent = [headers.join(","), sampleData.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "vendors_sample_import.csv");
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
                const newVendors: VendorFormValues[] = [];
                const errors: string[] = [];

                results.data.forEach((row: any, index: number) => {
                    const vendorData = {
                        companyName: row.companyName,
                        address: row.address,
                        country: row.country,
                        city: row.city,
                        email: row.email,
                        telephone: row.telephone,
                        fax: row.fax,
                        whatsapp: row.whatsapp,
                        website: row.website,
                        accountManager: {
                            name: row.accountManagerName,
                            designation: row.accountManagerDesignation,
                            email: row.accountManagerEmail,
                            telephone: row.accountManagerTelephone,
                            mobile: row.accountManagerMobile,
                            whatsapp: row.accountManagerWhatsapp,
                        },
                        techSupport1: { name: "", email: "", telephone: "", mobile: "" },
                        techSupport2: { name: "", email: "", telephone: "", mobile: "" },
                        techSupport3: { name: "", email: "", telephone: "", mobile: "" },
                    };
                    
                    const validation = vendorSchema.safeParse(vendorData);
                    if (validation.success) {
                        newVendors.push({
                            ...validation.data, 
                            id: `vendor-${Date.now()}-${index}`
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
                if (newVendors.length > 0) {
                    setVendors(prev => [...prev, ...newVendors]);
                    toast({
                        title: "Import Complete",
                        description: `${newVendors.length} vendor(s) were successfully imported. ${errors.length} row(s) failed.`,
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

  const renderTechSupportFields = (contactNumber: 1 | 2 | 3) => (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`techSupport${contactNumber}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[12px]">Name</FormLabel>
                <FormControl>
                  <Input className="text-[11px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`techSupport${contactNumber}.email`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[12px]">Email Address</FormLabel>
                <FormControl>
                  <Input className="text-[11px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`techSupport${contactNumber}.telephone`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[12px]">Telephone</FormLabel>
                <FormControl>
                  <Input className="text-[11px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`techSupport${contactNumber}.mobile`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[12px]">Mobile Number</FormLabel>
                <FormControl>
                  <Input className="text-[11px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-[14px] font-bold tracking-tight mb-2 print:text-[12px]">
        Manage Suppliers/Vendors
      </h2>
      <p className="text-muted-foreground mb-6 text-[12px] print:text-[10px]">
        Add or edit supplier and service provider information.
      </p>

       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">View Existing Vendors</TabsTrigger>
          <TabsTrigger value="create">
            {editingVendorId ? "Edit Vendor" : "Create New Vendor"}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="view">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-[13px]">Existing Vendors</CardTitle>
                <CardDescription className="text-[12px]">
                    Browse and manage all registered vendors.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Account Manager</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isClient ? (
                        vendors.length > 0 ? (
                            vendors.map((vendor) => (
                                <TableRow key={vendor.id}>
                                <TableCell className="font-medium text-[11px]">
                                    {vendor.companyName}
                                </TableCell>
                                <TableCell className="text-[11px]">
                                    {vendor.country}
                                </TableCell>
                                <TableCell className="text-[11px]">
                                    {vendor.city}
                                </TableCell>
                                <TableCell className="text-[11px]">
                                    {vendor.email}
                                </TableCell>
                                <TableCell className="text-[11px] text-muted-foreground">
                                    {vendor.accountManager.name}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => vendor.id && handleEdit(vendor.id)}>
                                    Edit
                                    </Button>
                                </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No vendors found.
                                </TableCell>
                            </TableRow>
                        )
                      ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
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
                    Create New Vendor
                  </Button>
                  <Button size="sm" variant="outline" type="button" onClick={() => fileInputRef.current?.click()}>
                      <Icons.Upload className="mr-2 h-4 w-4" /> Import Vendors
                  </Button>
                  <Button variant="link" size="sm" type="button" onClick={handleDownloadSample}>
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
                    <CardTitle className="text-[13px]">Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[12px]">
                              Company Name
                            </FormLabel>
                            <FormControl>
                              <Input className="text-[11px]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[12px]">
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input className="text-[11px]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                         <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[12px]">Address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="PO.Box, Street Name, Zone"
                                  className="text-[11px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[12px]">Country</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="text-[11px]">
                                    <SelectValue placeholder="Select a country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {countryCityData.map((country) => (
                                    <SelectItem
                                      key={country.name}
                                      value={country.name}
                                      className="text-[11px]"
                                    >
                                      {country.name}
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
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-[12px]">City</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={!selectedCountry || cities.length === 0}
                                >
                                    <FormControl>
                                    <SelectTrigger className="text-[11px]">
                                        <SelectValue placeholder="Select a city" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {cities.map((city) => (
                                        <SelectItem
                                        key={city}
                                        value={city}
                                        className="text-[11px]"
                                        >
                                        {city}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="telephone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[12px]">Telephone</FormLabel>
                            <FormControl>
                              <Input className="text-[11px]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fax"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[12px]">FAX</FormLabel>
                            <FormControl>
                              <Input className="text-[11px]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="whatsapp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[12px]">What’s App</FormLabel>
                            <FormControl>
                              <Input className="text-[11px]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[12px]">Website</FormLabel>
                            <FormControl>
                              <Input className="text-[11px]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Separator />

                <div>
                  <h3 className="text-[13px] font-semibold mb-4 print:text-[12px]">
                    Point of Contacts
                  </h3>
                  <Tabs defaultValue="accountManager" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="accountManager">
                        Account Manager
                      </TabsTrigger>
                      <TabsTrigger value="techSupport1">Tech Support 1</TabsTrigger>
                      <TabsTrigger value="techSupport2">Tech Support 2</TabsTrigger>
                      <TabsTrigger value="techSupport3">Tech Support 3</TabsTrigger>
                    </TabsList>
                    <TabsContent value="accountManager">
                      <Card>
                        <CardContent className="space-y-4 pt-6">
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="accountManager.name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[12px]">Name</FormLabel>
                                  <FormControl>
                                    <Input className="text-[11px]" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="accountManager.designation"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[12px]">
                                    Designation
                                  </FormLabel>
                                  <FormControl>
                                    <Input className="text-[11px]" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="accountManager.email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[12px]">
                                    Email Address
                                  </FormLabel>
                                  <FormControl>
                                    <Input className="text-[11px]" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="accountManager.telephone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[12px]">
                                    Telephone
                                  </FormLabel>
                                  <FormControl>
                                    <Input className="text-[11px]" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="accountManager.mobile"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[12px]">
                                    Mobile Number
                                  </FormLabel>
                                  <FormControl>
                                    <Input className="text-[11px]" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="accountManager.whatsapp"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[12px]">
                                    What’s App
                                  </FormLabel>
                                  <FormControl>
                                    <Input className="text-[11px]" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="techSupport1">
                      {renderTechSupportFields(1)}
                    </TabsContent>
                    <TabsContent value="techSupport2">
                      {renderTechSupportFields(2)}
                    </TabsContent>
                    <TabsContent value="techSupport3">
                      {renderTechSupportFields(3)}
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="flex items-center gap-4">
                  <Button type="submit">Save Data</Button>
                </div>
              </form>
            </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
