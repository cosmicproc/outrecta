export type TestDocument = {
    title: string;
    questions: (
        | {
              questionStatement: string;
              questionMaterial: string;
              choices: string[];
              answerText: string;
          }
        | {
              questionMaterial: string;
              questionStatement: string;
              answerText: string;
          }
    )[];
    inputTokens: number;
    outputTokens: number;
};
