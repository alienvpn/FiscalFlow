
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { countryCityData } from "@/lib/location-data";

const vendorSchema = z.object({
  companyName: z.string().min(1, "Company Name is required."),
  address: z.string().min(1, "Address is required."),
  country: z.string().min(1, "Country is required."),
  city: z.string().min(1, "City is required."),
  email: z.string().email("Invalid email address."),
  telephone: z.string().min(1, "Telephone is required."),
  fax: z.string().optional(),
  whatsapp: z.string().optional(),
  website: z.string().url("Invalid URL.").optional().or(z.literal("")),

  accountManager: z.object({
    name: z.string().min(1, "Name is required."),
    designation: z.string().min(1, "Designation is required."),
    email: z.string().email("Invalid email address."),
    telephone: z.string().min(1, "Telephone is required."),
    mobile: z.string().min(1, "Mobile is required."),
    whatsapp: z.string().optional(),
  }),

  techSupport1: z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email.").optional().or(z.literal("")),
    telephone: z.string().optional(),
    mobile: z.string().optional(),
  }),
  techSupport2: z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email.").optional().or(z.literal("")),
    telephone: z.string().optional(),
    mobile: z.string().optional(),
  }),
  techSupport3: z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email.").optional().or(z.literal("")),
    telephone: z.string().optional(),
    mobile: z.string().optional(),
  }),
});

type VendorFormValues = z.infer<typeof vendorSchema> & { id?: string };

const initialVendors: VendorFormValues[] = [
    {
        id: "vendor-1",
        companyName: "Global Tech Supplies",
        address: "123 Tech Avenue",
        country: "United States",
        city: "Los Angeles",
        email: "contact@globaltech.com",
        telephone: "1-800-555-1234",
        fax: "",
        whatsapp: "",
        website: "https://globaltech.com",
        accountManager: {
            name: "John Doe",
            designation: "Senior Account Manager",
            email: "john.doe@globaltech.com",
            telephone: "1-800-555-1235",
            mobile: "1-408-555-6789",
            whatsapp: "",
        },
        techSupport1: { name: "", email: "", telephone: "", mobile: "" },
        techSupport2: { name: "", email: "", telephone: "", mobile: "" },
        techSupport3: { name: "", email: "", telephone: "", mobile: "" },
    },
    {
        id: "vendor-2",
        companyName: "Creative Solutions LLC",
        address: "456 Marketing Blvd",
        country: "United States",
        city: "New York City",
        email: "hello@creativesolutions.com",
        telephone: "1-212-555-5678",
        fax: "",
        whatsapp: "",
        website: "https://creativesolutions.com",
        accountManager: {
            name: "Jane Smith",
            designation: "Client Partner",
            email: "jane.s@creativesolutions.com",
            telephone: "1-212-555-5679",
            mobile: "1-917-555-1234",
            whatsapp: "",
        },
        techSupport1: { name: "", email: "", telephone: "", mobile: "" },
        techSupport2: { name: "", email: "", telephone: "", mobile: "" },
        techSupport3: { name: "", email: "", telephone: "", mobile: "" },
    }
];

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
  const [vendors, setVendors] = React.useState<VendorFormValues[]>(initialVendors);
  const [editingVendorId, setEditingVendorId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState("view");
  const [cities, setCities] = React.useState<string[]>([]);

  const form = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: defaultValues,
  });

  const selectedCountry = form.watch("country");

  React.useEffect(() => {
    if (selectedCountry) {
      const countryData = countryCityData.find(c => c.name === selectedCountry);
      setCities(countryData?.cities || []);
      form.setValue("city", "");
    } else {
      setCities([]);
    }
  }, [selectedCountry, form]);
  
  React.useEffect(() => {
    if (editingVendorId) {
      const vendorToEdit = vendors.find((v) => v.id === editingVendorId);
      if (vendorToEdit) {
        form.reset(vendorToEdit);
        const countryData = countryCityData.find(c => c.name === vendorToEdit.country);
        setCities(countryData?.cities || []);
        form.setValue("city", vendorToEdit.city);
      }
    } else {
      form.reset(defaultValues);
    }
  }, [editingVendorId, form, vendors]);

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
      // Update existing vendor
      setVendors(vendors.map((v) => (v.id === editingVendorId ? { ...values, id: v.id } : v)));
    } else {
      // Create new vendor
      setVendors([...vendors, { ...values, id: `vendor-${Date.now()}` }]);
    }
    setEditingVendorId(null);
    setActiveTab("view");
  }

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
      <h2 className="text-[14px] font-bold tracking-tight mb-2">
        Manage Suppliers/Vendors
      </h2>
      <p className="text-muted-foreground mb-6 text-[12px]">
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
                      {vendors.map((vendor) => (
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
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Button size="sm" className="mt-4" onClick={handleCreateNew}>
                  <Icons.Add className="mr-2" />
                  Create New Vendor
                </Button>
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
                  <h3 className="text-[13px] font-semibold mb-4">
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
                  <Button type="submit">Update</Button>
                  <Button type="submit">Save Data</Button>
                </div>
              </form>
            </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
