export type TestDocument = {
    title: string;
    questions: {
        questionText: string;
        answerChoices?: string[];
        answerText: string;
    }[];
    inputTokens: number;
    outputTokens: number;
};
