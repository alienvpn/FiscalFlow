// budget-forecasting.ts
'use server';
/**
 * @fileOverview Budget forecasting AI agent.
 *
 * - forecastBudget - A function that forecasts future budgetary needs.
 * - BudgetForecastingInput - The input type for the forecastBudget function.
 * - BudgetForecastingOutput - The return type for the forecastBudget function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetForecastingInputSchema = z.object({
  historicalSpendingData: z
    .string()
    .describe('Historical spending data in CSV format.'),
  contractObligations: z
    .string()
    .describe('Contract obligations in text format.'),
});
export type BudgetForecastingInput = z.infer<typeof BudgetForecastingInputSchema>;

const BudgetForecastingOutputSchema = z.object({
  forecastedBudget: z
    .string()
    .describe('Forecasted budget for the next period with detailed explanations.'),
});
export type BudgetForecastingOutput = z.infer<typeof BudgetForecastingOutputSchema>;

export async function forecastBudget(input: BudgetForecastingInput): Promise<BudgetForecastingOutput> {
  return forecastBudgetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetForecastingPrompt',
  input: {schema: BudgetForecastingInputSchema},
  output: {schema: BudgetForecastingOutputSchema},
  prompt: `You are a financial analyst. Analyze the historical spending data and contract obligations to forecast the budget for the next period.

Historical Spending Data: {{{historicalSpendingData}}}

Contract Obligations: {{{contractObligations}}}

Provide a detailed explanation of how you arrived at the forecasted budget.
`,
});

const forecastBudgetFlow = ai.defineFlow(
  {
    name: 'forecastBudgetFlow',
    inputSchema: BudgetForecastingInputSchema,
    outputSchema: BudgetForecastingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
