import { z } from 'zod';
import { models } from './ai';

export const generationSchema = z
    .object({
        topics: z
            .string()
            .min(1, {
                message: 'Topics cannot be empty.',
            })
            .max(1000, {
                message: 'Topics cannot be longer than 1000 characters.',
            }),
        questionCount: z.coerce
            .number({ message: 'Question count must be a number.' })
            .int({ message: 'Question count must be an integer.' })
            .min(1, { message: 'Question count cannot be smaller than 1.' })
            .max(50, { message: 'Question count cannot be more than 50.' }),
        explainAnswers: z.boolean(),
        testType: z.enum(['multiple-choice', 'open-ended']),
        difficulty: z.number().int().min(0).max(6),
        choiceCount: z.coerce
            .number({ message: 'Choice count count must be a number.' })
            .int({ message: 'Choice count must be an integer.' })
            .min(2, { message: 'Choice count cannot be smaller than 2.' })
            .max(8, { message: 'Choice count cannot be more than 8.' })
            .default(4),
        model: z.enum(models as [string, ...string[]], {
            message: 'Invalid model provider.',
        }),
        azureResourceName: z.string().optional(),
        azureDeploymentName: z.string().optional(),
        apiKey: z.string().min(1, { message: 'API key cannot be empty.' }),
        creativity: z.number().int().min(0).max(100),
        manualTitle: z
            .string()
            .max(200, {
                message: 'Title cannot be longer than 100 characters.',
            })
            .min(5, { message: 'Title cannot be shorter than 5 characters.' })
            .or(z.literal(''))
            .optional(),
        customInstructions: z
            .string()
            .max(400, {
                message:
                    'Custom instructions cannot be longer than 400 characters.',
            })
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (data.model === 'azure-openai') {
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
        questionMaterial: z
            .string()
            .optional()
            .describe(
                'Question materials like variables, code snippets, passages, etc. to be referenced in the questionStatement. It must not contain ANY imperative sentence.',
            ),
        questionStatement: z.string(),
        ...(testType === 'multiple-choice'
            ? {
                  choices: z
                      .array(z.string())
                      .length(choiceCount)
                      .describe(
                          'The shuffled answer choices, with exactly one correct option among them. Start each option directly without any indicators.',
                      ),
              }
            : {}),
        answerText: z
            .string()
            .describe(
                (explainAnswers
                    ? `A step-by-step explanation that covers key concepts and builds to the solution. Separate neatly into paragraphs by using </br></br>.`
                    : 'Answer text with only the final answer or solution.') +
                    (testType === 'multiple-choice'
                        ? " Indicate the letter (a, b, etc.) corresponding to the correct answer's position in the list of choices."
                        : ''),
            ),
    });
