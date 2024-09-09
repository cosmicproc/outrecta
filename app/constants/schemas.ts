import { z } from 'zod';

export const models = [
    'openai-4o',
    'openai-4o-mini',
    'openai-4-turbo',
    'anthropic-3.5-sonnet',
    'anthropic-3-opus',
    'anthropic-3-haiku',
    'azure-openai',
] as const;
export const generationSchema = z
    .object({
        topic: z
            .string()
            .min(1, {
                message: 'Topic cannot be empty.',
            })
            .max(200, {
                message: 'Topic cannot be longer than 200 characters.',
            }),
        questionCount: z.coerce
            .number({ message: 'Question count must be a number.' })
            .int({ message: 'Question count must be an integer.' })
            .min(1, { message: 'Question count cannot be smaller than 1.' })
            .max(50, { message: 'Question count cannot be more than 50.' }),
        testType: z.enum(['multiple-choice', 'open-ended']),
        difficulty: z.number().int().min(0).max(10),
        choiceCount: z.coerce
            .number({ message: 'Choice count count must be a number.' })
            .int({ message: 'Choice count must be an integer.' })
            .min(2, { message: 'Choice count cannot be smaller than 2.' })
            .max(8, { message: 'Choice count cannot be more than 8.' })
            .default(4),
        model: z.enum(models, {
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
) =>
    z.object({
        questionMaterial: z
            .string()
            .optional()
            .describe(
                'Optional question material like passages, variables, equations, code snippets, etc. that can be refered to in the question statement.',
            ),
        questionStatement: z
            .string()
            .describe('Question statement that asks the question.'),

        ...(testType === 'multiple-choice'
            ? {
                  choices: z
                      .array(z.string())
                      .length(choiceCount)
                      .describe(
                          'Answer choices of the question (including the correct one).',
                      ),
                  correctChoiceIndex: z
                      .number()
                      .max(choiceCount - 1)
                      .describe('The correct choice index (0-indexed).'),
              }
            : {
                  answerText: z
                      .string()
                      .describe('A thorough answer of the question.'),
              }),
    });
