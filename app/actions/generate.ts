'use server';

import { z } from 'zod';
import { generationSchema, genQuestionSchema } from '../constants/schemas';
import { generateObject, APICallError } from 'ai';
import { getModel } from '../constants/ai';
import dedent from 'dedent';
import { mapDifficultyToText } from '../utils';

export default async function generate(data: z.infer<typeof generationSchema>) {
    const parsed = generationSchema.safeParse(data);

    if (!parsed.success) {
        return {
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const model = getModel(
        data.model,
        data.apiKey,
        data.azureResourceName,
        data.azureDeploymentName,
    );
    if (!model) {
        return { failed: true };
    }

    let questions = new Array();
    // Track iterations and errors just in case and short-circuit if sth goes wrong.
    let iteration = 0;
    let errors = 0;
    while (
        questions.length < data.questionCount &&
        iteration < Math.max(data.questionCount / 3, 10)
    ) {
        if (errors >= 5) {
            return { failed: true };
        }
        let newQuestions = new Array();
        try {
            newQuestions = (
                await generateObject({
                    model,
                    output: 'array',
                    schema: genQuestionSchema(data.choiceCount, data.testType),
                    prompt: dedent`
                        Generate ${data.questionCount} questions that are ${mapDifficultyToText(data.difficulty)} about "${data.topic}".
                        Questions about topics like math, chemistry, and physics should have problem questions.
                        Use TeX (KaTeX) with mhchem when useful. Use inline TeX except question figures. Don't forget to wrap TeX in $ and escape backslashes.
                        You can use question figures for math expressions, etc. but don't put them in question text then. 
                        Figures are shown above the question text. Refer to question figures in question text. 
                        Don't refer to figures like "Figure 1". Prefer specialized terms like "equation" or "expression".
                        ${data.customInstructions}
                    `,
                })
            ).object;
        } catch (error) {
            if (APICallError.isInstance(error)) {
                return {
                    errors: {
                        apiKey: [
                            "API key is not working. Please make sure it's correct. Rate limits may also be a problem.",
                        ],
                    },
                };
            }
            errors++;
        }
        questions = [
            ...questions,
            ...newQuestions.slice(0, data.questionCount - questions.length),
        ];
        iteration++;
    }

    return { document: { title: data.manualTitle || data.topic, questions } };
}
