"use server";

import { forecastBudget } from "@/ai/flows/budget-forecasting";
import { z } from "zod";

export const BudgetForecastingSchema = z.object({
  historicalSpendingData: z.string().min(1, "Historical data is required."),
  contractObligations: z.string().min(1, "Contract obligations are required."),
});

export async function getBudgetForecast(
  values: z.infer<typeof BudgetForecastingSchema>
) {
  "use server";
  try {
    const result = await forecastBudget(values);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to get forecast." };
  }
}
