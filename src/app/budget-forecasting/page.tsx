"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { getBudgetForecast } from "./actions";
import type { BudgetForecastingOutput } from "@/ai/flows/budget-forecasting";

type ForecastResult = BudgetForecastingOutput | null;

const BudgetForecastingSchema = z.object({
  historicalSpendingData: z.string().min(1, "Historical data is required."),
  contractObligations: z.string().min(1, "Contract obligations are required."),
});

const defaultHistoricalData = `Date,Category,Amount
2023-01-15,Salaries,50000
2023-01-20,Software,2000
2023-02-15,Salaries,51000
2023-02-22,Marketing,5000
2023-03-15,Salaries,51000
2023-03-18,Hardware,10000`;

const defaultContractObligations = `- Office Lease: 5000 QAR/month, expires 2025-12-31
- CRM Subscription: 1500 QAR/month, auto-renews annually
- Cloud Hosting: ~3000 QAR/month, usage-based`;

export default function BudgetForecastingPage() {
  const [forecastResult, setForecastResult] = useState<ForecastResult>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof BudgetForecastingSchema>>({
    resolver: zodResolver(BudgetForecastingSchema),
    defaultValues: {
      historicalSpendingData: defaultHistoricalData,
      contractObligations: defaultContractObligations,
    },
  });

  async function onSubmit(values: z.infer<typeof BudgetForecastingSchema>) {
    setIsLoading(true);
    setError(null);
    setForecastResult(null);

    const result = await getBudgetForecast(values);
    if (result.success) {
      setForecastResult(result.data);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-sm font-bold tracking-tight mb-2">
          Budget Forecasting Tool
        </h2>
        <p className="text-muted-foreground mb-6">
          Predict future budgetary needs based on historical data and
          contractual obligations.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="historicalSpendingData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical Spending Data (CSV format)</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[150px] font-mono" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contractObligations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Obligations</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[150px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Generate Forecast
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-8 text-center">
            <Icons.Spinner className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="mt-2 text-muted-foreground">
              AI is generating the forecast...
            </p>
          </div>
        )}

        {error && (
          <Card className="mt-8 border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">
                Forecasting Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        {forecastResult && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Budget Forecast</CardTitle>
              <CardDescription>
                AI-powered projection for the next period.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none whitespace-pre-wrap">
              {forecastResult.forecastedBudget}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
