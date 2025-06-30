"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { CapexAnalysisSchema, getCapexAnalysis } from "./actions";
import type { CompareCAPEXQuotesOutput } from "@/ai/flows/capex-analysis";

type AnalysisResult = CompareCAPEXQuotesOutput | null;

export default function CapexAnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof CapexAnalysisSchema>>({
    resolver: zodResolver(CapexAnalysisSchema),
    defaultValues: {
      quotes: [{ vendor: "", description: "", price: 0, terms: "" }],
      criteria:
        "Value for money, long-term reliability, and warranty terms.",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "quotes",
  });

  async function onSubmit(values: z.infer<typeof CapexAnalysisSchema>) {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const result = await getCapexAnalysis(values);
    if (result.success) {
      setAnalysisResult(result.data);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-sm font-bold tracking-tight mb-2">
          CAPEX Analysis Tool
        </h2>
        <p className="text-muted-foreground mb-6">
          Compare capital expenditure quotes using AI to make informed
          decisions.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              {fields.map((field, index) => (
                <Card key={field.id} className="mb-6">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Quote {index + 1}</CardTitle>
                      <CardDescription>
                        Enter the details for this quote.
                      </CardDescription>
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Icons.Delete className="h-4 w-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`quotes.${index}.vendor`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vendor</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Dell Inc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`quotes.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (QAR)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`quotes.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g. 10x XPS 15 Laptops"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`quotes.${index}.terms`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Terms</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g. Net 30, 3-year warranty"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({ vendor: "", description: "", price: 0, terms: "" })
                }
              >
                <Icons.Add className="mr-2 h-4 w-4" />
                Add Quote
              </Button>
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="criteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comparison Criteria</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What factors are most important?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Analyze Quotes
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-8 text-center">
            <Icons.Spinner className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="mt-2 text-muted-foreground">
              AI is analyzing the quotes...
            </p>
          </div>
        )}

        {error && (
          <Card className="mt-8 border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">
                Analysis Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        {analysisResult && (
          <div className="mt-8 space-y-6">
            <h3 className="text-base font-bold">Analysis Result</h3>
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>{analysisResult.summary}</p>
              </CardContent>
            </Card>
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Recommendation</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>{analysisResult.recommendation}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
