"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { intervalToDuration } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/datepicker"
import { Separator } from "@/components/ui/separator"

const serviceSchema = z.object({
  type: z.literal("service"),
  serviceDescription: z.string().min(1, "Service description is required."),
  serviceStartDate: z.date({ required_error: "Start date is required." }),
  serviceEndDate: z.date({ required_error: "End date is required." }),
  supplierId: z.string().min(1, "Supplier is required."),
})

const deviceSchema = z.object({
  type: z.literal("device"),
  deviceDescription: z.string().min(1, "Device/Item description is required."),
  model: z.string().optional(),
  make: z.string().optional(),
  countryOfMake: z.string().optional(),
  partNumber: z.string().optional(),
  serialNumber: z.string().optional(),
  macAddress: z.string().optional(),
  manufactureDate: z.date().optional(),
  expireDate: z.date().optional(),
  endOfSalesDate: z.date().optional(),
  endOfSupportDate: z.date().optional(),
  endOfLifeDate: z.date().optional(),
  warrantyStartDate: z.date().optional(),
  warrantyEndDate: z.date().optional(),
})

const registrySchema = z.discriminatedUnion("type", [
  serviceSchema,
  deviceSchema,
])

type RegistryFormValues = z.infer<typeof registrySchema>

// Mock data, this would typically come from an API
const vendors = [
  { id: "ven-1", name: "AWS" },
  { id: "ven-2", name: "Dell" },
  { id: "ven-3", name: "Salesforce" },
  { id: "ven-4", name: "Creative Co." },
]

export default function ItemRegistryPage() {
  const form = useForm<RegistryFormValues>({
    resolver: zodResolver(registrySchema),
    defaultValues: {
      type: "device",
    },
  })

  const itemType = form.watch("type")

  const serviceStartDate = form.watch("serviceStartDate" as any)
  const serviceEndDate = form.watch("serviceEndDate" as any)
  const [servicePeriod, setServicePeriod] = React.useState<string | null>(null)

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

  function onSubmit(values: RegistryFormValues) {
    console.log(values)
    // Here you would handle the form submission, e.g., send to an API
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-[14px] font-bold tracking-tight mb-2">
        Device/Item/Service Registry
      </h2>
      <p className="text-muted-foreground mb-6 text-[12px]">
        Create a new entry for a device, item, or service.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                            <SelectItem key={vendor.id} value={vendor.id} className="text-[11px]">
                              {vendor.name}
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
                  <h3 className="text-[12px] font-medium mb-4">Specifications</h3>
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
                  <h3 className="text-[12px] font-medium mb-4">Lifecycle Dates</h3>
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
                    <h3 className="text-[12px] font-medium mb-4">Warranty</h3>
                   <div className="grid md:grid-cols-2 gap-4">
                       <FormField control={form.control} name="warrantyStartDate" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Warranty Start Date</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} placeholder="Select date" /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="warrantyEndDate" render={({ field }) => (<FormItem><FormLabel className="text-[12px]">Warranty End Date</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} placeholder="Select date" /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button type="submit">Save Entry</Button>
        </form>
      </Form>
    </div>
  )
}
