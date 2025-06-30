// src/ai/flows/capex-analysis.ts
'use server';

/**
 * @fileOverview A CAPEX quote analysis AI agent.
 *
 * - compareCAPEXQuotes - A function that handles the CAPEX quote comparison process.
 * - CompareCAPEXQuotesInput - The input type for the compareCAPEXQuotes function.
 * - CompareCAPEXQuotesOutput - The return type for the compareCAPEXQuotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompareCAPEXQuotesInputSchema = z.object({
  quotes: z.array(
    z.object({
      vendor: z.string().describe('The name of the vendor.'),
      description: z.string().describe('A description of the quote.'),
      price: z.number().describe('The total price of the quote.'),
      terms: z.string().describe('Payment and warranty terms'),
    })
  ).describe('An array of CAPEX quotes to compare.'),
  criteria: z.string().describe('Specific criteria to use during comparison of the quotes.'),
});
export type CompareCAPEXQuotesInput = z.infer<typeof CompareCAPEXQuotesInputSchema>;

const CompareCAPEXQuotesOutputSchema = z.object({
  summary: z.string().describe('A summary of the comparison of the quotes.'),
  recommendation: z.string().describe('A recommendation of which quote to choose.'),
});
export type CompareCAPEXQuotesOutput = z.infer<typeof CompareCAPEXQuotesOutputSchema>;

export async function compareCAPEXQuotes(input: CompareCAPEXQuotesInput): Promise<CompareCAPEXQuotesOutput> {
  return compareCAPEXQuotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareCAPEXQuotesPrompt',
  input: {schema: CompareCAPEXQuotesInputSchema},
  output: {schema: CompareCAPEXQuotesOutputSchema},
  prompt: `You are an expert budget manager specializing in comparing CAPEX quotes.

You will use the following information to compare the quotes, and make a recommendation as to which quote to choose, and why.

Quotes:
{{#each quotes}}
Vendor: {{{vendor}}}
Description: {{{description}}}
Price: {{{price}}}
Terms: {{{terms}}}
{{/each}}

Comparison Criteria: {{{criteria}}}
`,
});

const compareCAPEXQuotesFlow = ai.defineFlow(
  {
    name: 'compareCAPEXQuotesFlow',
    inputSchema: CompareCAPEXQuotesInputSchema,
    outputSchema: CompareCAPEXQuotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
