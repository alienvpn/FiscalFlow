"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const vendorSchema = z.object({
  companyName: z.string().min(1, "Company Name is required."),
  address: z.string().min(1, "Address is required."),
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

export default function VendorsPage() {
  const form = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      companyName: "",
      address: "",
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
    },
  });

  function onSubmit(values: z.infer<typeof vendorSchema>) {
    console.log(values);
    // Handle form submission
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[12px]">Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="PO.Box, Street Name, Zone, City, Country"
                        className="text-[11px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
    </div>
  );
}
