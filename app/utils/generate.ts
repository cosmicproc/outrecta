import { z } from 'zod';
import { generationSchema, genQuestionSchema } from '../constants/schemas';
import { generateObject, APICallError } from 'ai';
import { getModel } from '../constants/ai';
import dedent from 'dedent';
import { mapDifficultyToText } from './difficulty';

export default async function generate(data: z.infer<typeof generationSchema>) {
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
                    temperature: data.creativity / 100,
                    output: 'array',
                    schema: genQuestionSchema(data.choiceCount, data.testType),
                    system: dedent`
                            You must follow conditions below under any circumstances.

                            Formatting Rules:
                            You have a KaTeX with mhchem extension render environment.
                            - Any LaTeX and mhchem text between single dollar sign ($) will be rendered as a TeX formula.
                            - Use $(tex_formula)$ inline delimiters to display equations instead of backslash.
                            - Use display mode only in pre-question field. Prefer inline mode for LaTeX most of the time even for pre-question field. 
                            - Always escape backslashes in LaTeX.

                            Additional Rules:
                            - Put expressions in pre-question field when useful.
                            - Avoid impereative language in pre-question field.
                        `,
                    prompt: dedent`
                        Generate ${data.questionCount} "${data.topic}" questions.
                        ${mapDifficultyToText(data.difficulty)}
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
