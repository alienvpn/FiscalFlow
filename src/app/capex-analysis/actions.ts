"use server";

import {
  compareCAPEXQuotes,
  type CompareCAPEXQuotesInput,
} from "@/ai/flows/capex-analysis";

export async function getCapexAnalysis(values: CompareCAPEXQuotesInput) {
  "use server";
  try {
    const result = await compareCAPEXQuotes(values);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to get analysis." };
  }
}
