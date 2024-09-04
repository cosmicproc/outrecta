export type TestDocument = {
    title: string;
    questions: (
        | {
              questionText: string;
              preQuestionField: string;
              choices: string[];
              correctChoiceIndex: number;
          }
        | {
              preQuestionField: string;
              questionText: string;
              answerText: string;
          }
    )[];
};
