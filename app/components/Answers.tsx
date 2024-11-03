import { TestDocument } from '../constants/types';
import RichContent from './RichContent';

export default function Answers({
    questions,
}: {
    questions: TestDocument['questions'];
}) {
    const averageLen =
        questions.reduce((x, y) => x + y.answerText.length, 0) /
        questions.length;

    let answerSpacing = 'mb-0.5';
    if (averageLen > 1000) {
        answerSpacing = 'mb-32 print:mb-20';
    } else if (averageLen > 100) {
        answerSpacing = 'mb-14 print:mb-10';
    } else if (averageLen > 20) {
        answerSpacing = 'mb-3';
    }

    return (
        <div>
            <ol className="my-10 list-decimal marker:font-bold print:text-xs">
                {questions.map((question, index) => (
                    <li
                        key={index}
                        className={`print:break-inside-avoid ${answerSpacing}`}
                    >
                        <RichContent content={question.answerText} />
                    </li>
                ))}
            </ol>
        </div>
    );
}
