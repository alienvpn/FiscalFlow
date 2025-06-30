"use server";

import { compareCAPEXQuotes } from "@/ai/flows/capex-analysis";
import { z } from "zod";

const QuoteSchema = z.object({
  vendor: z.string().min(1, "Vendor is required."),
  description: z.string().min(1, "Description is required."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  terms: z.string().min(1, "Terms are required."),
});

export const CapexAnalysisSchema = z.object({
  quotes: z.array(QuoteSchema).min(1, "At least one quote is required."),
  criteria: z.string().min(1, "Criteria are required."),
});

export async function getCapexAnalysis(
  values: z.infer<typeof CapexAnalysisSchema>
) {
  "use server";
  try {
    const result = await compareCAPEXQuotes(values);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to get analysis." };
  }
}
