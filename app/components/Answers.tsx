import { TestDocument } from '../constants/types';
import RichContent from './RichContent';

export default function Answers({
    questions,
}: {
    questions: TestDocument['questions'];
}) {
    return (
        <div className="my-10">
            {questions.map((question, index) => (
                <p
                    key={index}
                    className={`print:break-inside-avoid print:text-xs ${!('correctChoiceIndex' in question) && 'mb-20'}`}
                >
                    <strong>{index + 1}.</strong>&nbsp;&nbsp;
                    <RichContent
                        content={
                            'correctChoiceIndex' in question
                                ? String.fromCharCode(
                                      65 + question.correctChoiceIndex,
                                  )
                                : question.answerText + '\n'
                        }
                    />
                </p>
            ))}
        </div>
    );
}
