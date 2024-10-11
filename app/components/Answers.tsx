import { TestDocument } from '../constants/types';
import RichContent from './RichContent';

export default function Answers({
    questions,
}: {
    questions: TestDocument['questions'];
}) {
    return (
        <div
            className={`${'correctChoiceIndex' in questions[0] ? 'flex justify-center' : ''}`}
        >
            <ol className="my-10 list-decimal marker:font-bold print:text-xs">
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
        </div>
    );
}
