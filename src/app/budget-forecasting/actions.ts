"use server";

import {
  forecastBudget,
  type BudgetForecastingInput,
} from "@/ai/flows/budget-forecasting";

export async function getBudgetForecast(values: BudgetForecastingInput) {
  "use server";
  try {
    const result = await forecastBudget(values);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to get forecast." };
  }
}
