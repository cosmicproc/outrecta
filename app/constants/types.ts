export type TestDocument = {
    title: string;
    questions: (
        | {
              questionStatement: string;
              preQuestionField: string;
              choices: string[];
              correctChoiceIndex: number;
          }
        | {
              preQuestionField: string;
              questionStatement: string;
              answerText: string;
          }
    )[];
};
