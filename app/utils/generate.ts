import { APICallError, generateObject, RetryError } from 'ai';
import dedent from 'dedent';
import { z } from 'zod';
import { getModel } from '../constants/ai';
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
                system: dedent`
                        You are a question generator, tasked with creating relevant questions based on the provided information. Follow these guidelines:
                        - Use LaTeX, mhchem, Markdown, and HTML as needed.
                        - Wrap any LaTeX and mhchem content in proper delimiters (e.g, $$...$$).
                        - Escape all backslashes except for line breaks. Use \n for line breaks.
                        - If some HTML should not render, wrap it in a code block using backticks (\`\`\` or \`).
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

            // Strip answer choice indicators from answer choices
            newQuestions = newQuestions.map((question) => {
                if (Array.isArray(question.answerChoices)) {
                    question.answerChoices = question.answerChoices.map(
                        (choice) =>
                            choice.replace(/^\s*[a-zA-Z0-9][\),.]\s*/, ''),
                    );
                }
                return question;
            });

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
