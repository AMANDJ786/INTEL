'use server';

/**
 * @fileOverview This file implements Genkit flows for generating and grading short theory exams.
 *
 * @function generateTheoryExam - Generates theory questions for a given chapter.
 * @function gradeTheoryAnswers - Grades handwritten answers from an uploaded photo.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Schema for generating theory questions
const GenerateTheoryExamInputSchema = z.object({
  chapter: z.string().describe('The chapter/topic for which to generate theory questions.'),
});
export type GenerateTheoryExamInput = z.infer<typeof GenerateTheoryExamInputSchema>;

const GenerateTheoryExamOutputSchema = z.object({
  questions: z.array(z.string()).describe('An array of 3-5 short theory questions.'),
});
export type GenerateTheoryExamOutput = z.infer<typeof GenerateTheoryExamOutputSchema>;

// Schema for grading theory answers
const GradeTheoryAnswersInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the handwritten answers, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  questions: z.array(z.string()).describe('The questions that were answered.'),
});
export type GradeTheoryAnswersInput = z.infer<typeof GradeTheoryAnswersInputSchema>;

const GradeTheoryAnswersOutputSchema = z.object({
  feedback: z.string().describe('Overall feedback on the submitted answers.'),
  score: z.number().describe('A score out of 100 for the answers.'),
});
export type GradeTheoryAnswersOutput = z.infer<typeof GradeTheoryAnswersOutputSchema>;


// Flow to generate theory questions
export async function generateTheoryExam(input: GenerateTheoryExamInput): Promise<GenerateTheoryExamOutput> {
  return generateTheoryExamFlow(input);
}

const generateTheoryExamPrompt = ai.definePrompt({
    name: 'generateTheoryExamPrompt',
    input: { schema: GenerateTheoryExamInputSchema },
    output: { schema: GenerateTheoryExamOutputSchema },
    prompt: `You are an expert educator. Generate 4 short theory questions for a student on the topic of "{{chapter}}". The questions should encourage critical thinking and not just rote memorization.`
});

const generateTheoryExamFlow = ai.defineFlow(
  {
    name: 'generateTheoryExamFlow',
    inputSchema: GenerateTheoryExamInputSchema,
    outputSchema: GenerateTheoryExamOutputSchema,
  },
  async (input) => {
    const { output } = await generateTheoryExamPrompt(input);
    return output!;
  }
);


// Flow to grade theory answers
export async function gradeTheoryAnswers(input: GradeTheoryAnswersInput): Promise<GradeTheoryAnswersOutput> {
    return gradeTheoryAnswersFlow(input);
}

const gradeTheoryAnswersPrompt = ai.definePrompt({
    name: 'gradeTheoryAnswersPrompt',
    input: { schema: GradeTheoryAnswersInputSchema },
    output: { schema: GradeTheoryAnswersOutputSchema },
    prompt: `You are an expert examiner. A student has submitted a photo of their handwritten answers to a short theory exam. 
    
    Your task is to analyze the image, read the answers, and provide constructive feedback and a score.

    Exam Questions:
    {{#each questions}}
    - {{{this}}}
    {{/each}}

    Student's Answers (from image):
    {{media url=photoDataUri}}

    Please provide detailed, constructive feedback on the student's answers and a final score out of 100.`
});

const gradeTheoryAnswersFlow = ai.defineFlow(
    {
        name: 'gradeTheoryAnswersFlow',
        inputSchema: GradeTheoryAnswersInputSchema,
        outputSchema: GradeTheoryAnswersOutputSchema,
    },
    async (input) => {
        const { output } = await gradeTheoryAnswersPrompt(input);
        return output!;
    }
);
