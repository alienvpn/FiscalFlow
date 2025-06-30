
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { approvalWorkflows as initialApprovalWorkflows } from "@/lib/mock-data";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const approvalLevelSchema = z.object({
  id: z.string().optional(),
  level: z.coerce.number().min(1, "Level must be at least 1."),
  approverRole: z.string().min(1, "Approver Role is required."),
  description: z.string().min(1, "Description is required."),
});

const approvalMatrixSchema = z.object({
  levels: z.array(approvalLevelSchema),
});

type ApprovalMatrixType = keyof typeof initialApprovalWorkflows;

export default function ApprovalMatrixPage() {
  const { toast } = useToast();
  const [matrixType, setMatrixType] = React.useState<ApprovalMatrixType>("budget");

  const form = useForm<z.infer<typeof approvalMatrixSchema>>({
    resolver: zodResolver(approvalMatrixSchema),
    defaultValues: {
      levels: initialApprovalWorkflows[matrixType],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "levels",
  });

  React.useEffect(() => {
    form.reset({ levels: initialApprovalWorkflows[matrixType] });
  }, [matrixType, form]);

  function onSubmit(values: z.infer<typeof approvalMatrixSchema>) {
    console.log(`Saving ${matrixType} approval matrix:`, values);
    toast({
      title: "Approval Matrix Saved",
      description: `The approval workflow for ${matrixType === 'budget' ? 'Budget Sheets' : 'Contract Renewal'} has been updated.`,
    });
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-[14px] font-bold tracking-tight mb-2">
        Approval Matrix
      </h2>
      <p className="text-muted-foreground mb-6 text-[12px]">
        Define the roles and levels for different approval workflows. These roles can be assigned to users in the User Registration page.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-[13px]">Select Workflow to Configure</CardTitle>
          <CardDescription className="text-[12px]">
            Choose the approval workflow you want to edit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(value) => setMatrixType(value as ApprovalMatrixType)} defaultValue={matrixType}>
            <SelectTrigger className="w-full md:w-[320px]">
              <SelectValue placeholder="Select a workflow" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="budget">Budget Sheets (CAPEX/OPEX)</SelectItem>
              <SelectItem value="contract">Contract Renewal</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-[13px]">
                Approval Levels for {matrixType === 'budget' ? 'Budget Sheets' : 'Contract Renewal'}
              </CardTitle>
              <CardDescription className="text-[12px]">
                Add, remove, or re-order levels to define the chain of command.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Level</TableHead>
                      <TableHead>Role / Title</TableHead>
                      <TableHead>Description / Condition</TableHead>
                      <TableHead className="w-[50px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell className="align-top">
                          <FormField
                            control={form.control}
                            name={`levels.${index}.level`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" className="text-[11px]" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="align-top">
                          <FormField
                            control={form.control}
                            name={`levels.${index}.approverRole`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input className="text-[11px]" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="align-top">
                          <FormField
                            control={form.control}
                            name={`levels.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea className="text-[11px]" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-right align-top pt-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => remove(index)}
                          >
                            <Icons.Delete className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => append({ id: crypto.randomUUID(), level: fields.length + 1, approverRole: "", description: "" })}
              >
                <Icons.Add className="mr-2 h-4 w-4" />
                Add Level
              </Button>
            </CardContent>
          </Card>
          <Button type="submit">Save Approval Matrix</Button>
        </form>
      </Form>
    </div>
  );
}
