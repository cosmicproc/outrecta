import { APICallError, generateObject, RetryError } from 'ai';
import dedent from 'dedent';
import { z } from 'zod';
import { getModel, modelMaxTemps } from '../constants/ai';
import { generationSchema, genQuestionSchema } from '../constants/schemas';
import { mapDifficultyToText, truncate } from './text';

export default async function generate(data: z.infer<typeof generationSchema>) {
    const model = getModel(
        data.modelName,
        data.apiKey,
        data.azureResourceName,
        data.azureDeploymentName,
    );

    if (!model) {
        return { failed: true };
    }

    let inputTokens = 0;
    let outputTokens = 0;
    let questions = new Array();
    // Track iterations and errors just in case and short-circuit if sth goes wrong.
    let iteration = 0;
    while (
        questions.length < data.questionCount &&
        iteration <= data.questionCount
    ) {
        try {
            const generatedQuestions = await generateObject({
                model,
                output: 'array',
                schema: genQuestionSchema(
                    data.choiceCount,
                    data.testType,
                    data.explainAnswers,
                ),
                temperature: modelMaxTemps[data.modelName] / 2,
                system: dedent`
                        You are a question generator, tasked with creating questions based on the provided information. Follow the guidelines below.
                        Formatting Guidelines:
                        - Use Markdown for formatting.
                        - Use LaTeX for mathematical expressions, e.g., $$E = mc^2$$.
                        - Use mhchem LaTeX extension for chemical expressions, e.g., $$\\ce{H2O}$$.
                        Content Guidelines:
                        - Practical questions that test the understanding of topics and encourage learning are highly preferred.
                        - You can mix and match topics in questions, but make sure they are relevant to the provided topics.
                    `,
                prompt: JSON.stringify({
                    questionCount: data.questionCount - questions.length,
                    topics: data.topics.split(',').map((topic) => topic.trim()),
                    difficulty: mapDifficultyToText(data.difficulty),
                    ...(data.customInstructions && {
                        customInstructions: data.customInstructions,
                    }),
                }),
            });
            inputTokens += generatedQuestions.usage.promptTokens;
            outputTokens += generatedQuestions.usage.completionTokens;
            let newQuestions = generatedQuestions.object;

            questions = questions.concat(
                newQuestions.slice(0, data.questionCount - questions.length),
            );
        } catch (error) {
            if (
                APICallError.isInstance(error) ||
                RetryError.isInstance(error)
            ) {
                return {
                    errors: {
                        apiKey: [
                            "API key is not working. Please make sure it's correct. Rate limits may also be a problem.",
                        ],
                    },
                };
            }
        }
        iteration++;
    }
    if (questions.length === 0) {
        return { failed: true };
    }

    return {
        document: {
            title: data.manualTitle || truncate(data.topics, 50),
            questions,
            inputTokens,
            outputTokens,
        },
    };
}
