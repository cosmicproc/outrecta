import { z } from 'zod';
import { modelNames, Providers } from './ai';

export const generationSchema = z
    .object({
        topics: z
            .string()
            .min(1, {
                message: 'Topics cannot be empty.',
            })
            .max(1000, {
                message: 'Topics cannot be longer than 1000 characters.',
            })
            .transform((n) => n.trim()),
        questionCount: z.coerce
            .number({ message: 'Question count must be a number.' })
            .int({ message: 'Question count must be an integer.' })
            .min(1, { message: 'Question count cannot be smaller than 1.' })
            .max(50, { message: 'Question count cannot be more than 50.' }),
        testType: z.enum(['multiple-choice', 'open-ended']),
        difficulty: z.number().int().min(0).max(6),
        choiceCount: z.coerce
            .number({ message: 'Choice count count must be a number.' })
            .int({ message: 'Choice count must be an integer.' })
            .min(2, { message: 'Choice count cannot be smaller than 2.' })
            .max(8, { message: 'Choice count cannot be more than 8.' })
            .default(4),
        modelName: z.custom<Providers>((n) => n in modelNames),
        azureResourceName: z.string().optional(),
        azureDeploymentName: z.string().optional(),
        apiKey: z.string().min(1, { message: 'API key cannot be empty.' }),
        explainAnswers: z.boolean(),
        manualTitle: z
            .string()
            .max(200, {
                message: 'Title cannot be longer than 100 characters.',
            })
            .min(5, { message: 'Title cannot be shorter than 5 characters.' })
            .or(z.literal(''))
            .optional()
            .transform((n) => n?.trim()),
        customInstructions: z
            .string()
            .max(400, {
                message:
                    'Custom instructions cannot be longer than 400 characters.',
            })
            .optional()
            .transform((n) => n?.trim()),
    })
    .superRefine((data, ctx) => {
        if (data.modelName === 'azure-openai') {
            if (!data.azureResourceName) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['azureResourceName'],
                    message: 'Azure resource name is required.',
                });
            }
            if (!data.azureDeploymentName) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['azureDeploymentName'],
                    message: 'Azure deployment name is required.',
                });
            }
        }
    });

export const genQuestionSchema = (
    choiceCount: number,
    testType: 'multiple-choice' | 'open-ended',
    explainAnswers: boolean,
) =>
    z.object({
        questionText: z
            .string()
            .describe(
                'The problem statement. Ensure clarity and avoid ambiguity.',
            ),
        ...(testType === 'multiple-choice'
            ? {
                  answerChoices: z
                      .array(z.string())
                      .length(choiceCount)
                      .describe(
                          'An array of answer options. The choices must be shuffled and include exactly one correct option. Do not put index indicators (e.g., "a)", "b)").',
                      ),
              }
            : {}),
        answerText: z
            .string()
            .describe(
                (explainAnswers
                    ? 'A thorough and well-structured explanation of the solution, with step-by-step reasoning with lists where appropriate. Ensure the answer is neatly formatted.'
                    : 'The final answer to the question.') +
                    (testType === 'multiple-choice'
                        ? ' Specify the letter (a, b, c, etc.) that corresponds to the correct answer choice.'
                        : ''),
            ),
    });
