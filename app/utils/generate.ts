import { z } from 'zod';
import { generationSchema, genQuestionSchema } from '../constants/schemas';
import { generateObject, APICallError, RetryError, Provider } from 'ai';
import { getModel, Providers } from '../constants/ai';
import dedent from 'dedent';
import { mapDifficultyToText } from './difficulty';

export default async function generate(data: z.infer<typeof generationSchema>) {
    const model = getModel(
        data.model as Providers,
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
    let errors = 0;
    while (
        questions.length < data.questionCount &&
        iteration < Math.max(data.questionCount / 3, 6)
    ) {
        if (errors >= 5) {
            return { failed: true };
        }
        let newQuestions = new Array();
        try {
            const generatedQuestions = await generateObject({
                model,
                temperature: data.creativity / 100,
                output: 'array',
                schema: genQuestionSchema(
                    data.choiceCount,
                    data.includeAnswers,
                    data.testType,
                ),
                system: dedent`
                        You are tasked with generating test questions. Follow these guidelines:
	                    - Use LaTeX with mhchem when relevant (for math, etc.). Properly wrap LaTeX in $.
	                    - Do not use any Markdown.
                        - Use </br> for line breaks. Do not use \\n.
                        - Use <code> and <pre> for program codes.
                    `,
                prompt: dedent`
                        Generate ${data.questionCount} questions for a test about "${data.topic.trim()}".
                        ${mapDifficultyToText(data.difficulty)}
                        ${data.customInstructions?.trim()}
                    `,
            });
            inputTokens += generatedQuestions.usage.promptTokens;
            outputTokens += generatedQuestions.usage.completionTokens;
            newQuestions = generatedQuestions.object;
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
            errors++;
        }
        questions = [
            ...questions,
            ...newQuestions.slice(0, data.questionCount - questions.length),
        ];
        iteration++;
    }

    return {
        document: {
            title: data.manualTitle || data.topic,
            questions,
            answersIncluded: data.includeAnswers,
            inputTokens,
            outputTokens,
        },
    };
}
