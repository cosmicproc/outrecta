import { TestDocument } from '../constants/types';
import RichContent from './RichContent';

export default function Answers({
    questions,
}: {
    questions: TestDocument['questions'];
}) {
    return (
        <ol className="my-10 list-decimal marker:font-bold list-inside print:text-xs">
            {questions.map((question, index) => (
                <li
                    key={index}
                    className={`print:break-inside-avoid ${!('correctChoiceIndex' in question) && 'mb-14 print:mb-10'}`}
                >
                    <RichContent
                        content={
                            'correctChoiceIndex' in question
                                ? String.fromCharCode(
                                      65 + question.correctChoiceIndex,
                                  )
                                : question.answerText + '\n'
                        }
                    />
                </li>
            ))}
        </ol>
    );
}
