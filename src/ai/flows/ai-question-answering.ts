// src/ai/flows/ai-question-answering.ts
'use server';
/**
 * @fileOverview An AI-powered question answering flow for students.
 *
 * - askQuestion - A function that allows students to ask questions and receive real-time answers from an AI assistant.
 * - AskQuestionInput - The input type for the askQuestion function.
 * - AskQuestionOutput - The return type for the askQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskQuestionInputSchema = z.object({
  question: z.string().describe('The question the student wants to ask about the course material.'),
  courseMaterial: z.string().describe('The course material relevant to the question.'),
});
export type AskQuestionInput = z.infer<typeof AskQuestionInputSchema>;

const AskQuestionOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the student\u2019s question.'),
});
export type AskQuestionOutput = z.infer<typeof AskQuestionOutputSchema>;

export async function askQuestion(input: AskQuestionInput): Promise<AskQuestionOutput> {
  return askQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askQuestionPrompt',
  input: {schema: AskQuestionInputSchema},
  output: {schema: AskQuestionOutputSchema},
  prompt: `You are a teaching assistant. Answer the following question about the provided course material. If the answer is not explicitly present in the material, answer to the best of your knowledge.

Course Material:
{{courseMaterial}}

Question: {{question}}`,
});

const askQuestionFlow = ai.defineFlow(
  {
    name: 'askQuestionFlow',
    inputSchema: AskQuestionInputSchema,
    outputSchema: AskQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
