'use server';

/**
 * @fileOverview Analyzes the sentiment of a list of comments and provides a summary in Korean.
 *
 * - analyzeComments - A function that initiates the comment sentiment analysis process.
 * - AnalyzeCommentsInput - The input type for the analyzeComments function.
 * - AnalyzeCommentsOutput - The return type for the analyzeComments function, providing a sentiment summary in Korean.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const AnalyzeCommentsInputSchema = z.object({
  comments: z.array(z.string()).describe('List of comments to analyze'),
});
export type AnalyzeCommentsInput = z.infer<typeof AnalyzeCommentsInputSchema>;

const AnalyzeCommentsOutputSchema = z.object({
  sentimentSummary: z.string().describe('A summary of the overall sentiment of the comments in Korean.'),
});
export type AnalyzeCommentsOutput = z.infer<typeof AnalyzeCommentsOutputSchema>;

export async function analyzeComments(input: AnalyzeCommentsInput): Promise<AnalyzeCommentsOutput> {
  return analyzeCommentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCommentsPrompt',
  input: {
    schema: z.object({
      comments: z.array(z.string()).describe('List of comments to analyze'),
    }),
  },
  output: {
    schema: z.object({
      sentimentSummary: z.string().describe('A summary of the overall sentiment of the comments in Korean.'),
    }),
  },
  prompt: `You are an AI that analyzes the sentiment of YouTube comments.
Given a list of comments, provide a concise summary of the overall sentiment expressed in the comments in Korean.

Comments:
{{#each comments}}
- {{{this}}}
{{/each}}

Summary:`,
});

const analyzeCommentsFlow = ai.defineFlow<
  typeof AnalyzeCommentsInputSchema,
  typeof AnalyzeCommentsOutputSchema
>(
  {
    name: 'analyzeCommentsFlow',
    inputSchema: AnalyzeCommentsInputSchema,
    outputSchema: AnalyzeCommentsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input, {
      generationConfig: {
        language: 'ko'
      }
    });
    return output!;
  }
);
