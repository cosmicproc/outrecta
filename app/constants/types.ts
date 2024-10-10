export type TestDocument = {
    title: string;
    questions: (
        | {
              questionStatement: string;
              questionMaterial: string;
              choices: string[];
              correctChoiceIndex: number;
          }
        | {
              questionMaterial: string;
              questionStatement: string;
              answerText: string;
          }
    )[];
    answersIncluded: boolean;
    inputTokens: number;
    outputTokens: number;
};
