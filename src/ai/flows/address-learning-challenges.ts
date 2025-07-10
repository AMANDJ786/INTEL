'use server';

/**
 * @fileOverview This file implements a Genkit flow to automatically generate quizzes and practice questions using AI.
 *
 * @function generateQuiz - A function that generates quizzes and practice questions based on a given topic.
 * @interface GenerateQuizInput - The input type for the generateQuiz function.
 * @interface GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate quizzes and practice questions.'),
  numberOfQuestions: z.number().min(1).max(20).default(5).describe('The number of questions to generate.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium').describe('The difficulty level of the questions.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      options: z.array(z.string()).describe('The possible answers to the question.'),
      answer: z.string().describe('The correct answer to the question.'),
    })
  ).describe('The generated quiz questions and answers.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const generateQuizPrompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert educator creating quizzes for students.

  Generate a quiz with {{numberOfQuestions}} questions on the topic of {{topic}} with a difficulty of {{difficulty}}.  Each question should have 4 possible answers, one of which is correct.  Return a JSON object with the following format:

  {
    "quiz": [
      {
        "question": "Question 1",
        "options": [
          "Option 1",
          "Option 2",
          "Option 3",
          "Option 4"
        ],
        "answer": "The correct answer"
      }
    ]
  }`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await generateQuizPrompt(input);
    return output!;
  }
);
