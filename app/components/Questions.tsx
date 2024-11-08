import { TestDocument } from '../constants/types';
import RichContent from './RichContent';

export default function Questions({
    questions,
    showSpaces,
}: {
    questions: TestDocument['questions'];
    showSpaces: boolean;
}) {
    return (
        <ol className="mt-10 list-decimal marker:font-bold list-inside print:text-xs">
            {questions.map((question, index) => (
                <div className="print:break-inside-avoid" key={index}>
                    {'questionMaterial' in question && (
                        <p className="mb-5">
                            <RichContent content={question.questionMaterial} />
                        </p>
                    )}
                    <li className="mb-12 print:mb-8">
                        <RichContent content={question.questionStatement} />
                        {!('answerChoices' in question) && showSpaces && (
                            <div className="h-32"></div>
                        )}
                        {'answerChoices' in question && (
                            <ol className="letter-list mt-3">
                                {question.answerChoices.map(
                                    (answerChoice, index) => (
                                        <li key={index}>
                                            <RichContent
                                                content={answerChoice}
                                            />
                                        </li>
                                    ),
                                )}
                            </ol>
                        )}
                    </li>
                </div>
            ))}
        </ol>
    );
}
