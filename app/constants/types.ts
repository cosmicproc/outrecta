export type TestDocument = {
    title: string;
    questions: (
        | {
              questionFigure: string;
              questionText: string;
              choices: string[];
              correctChoiceIndex: number;
          }
        | { questionFigure: string; questionText: string; answerText: string }
    )[];
};
