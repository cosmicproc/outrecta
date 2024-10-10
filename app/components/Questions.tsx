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
                        <div
                            className={`${!('choices' in question) && showSpaces ? 'h-32' : 'h-2'}`}
                        ></div>
                        {'choices' in question &&
                            question.choices.map((choice, index) => {
                                const isChoiceMultiline =
                                    choice.match('\n') || choice.match('\\\\n');
                                const indicator = String.fromCharCode(
                                    97 + index,
                                );

                                return (
                                    <div
                                        key={index}
                                        className={
                                            isChoiceMultiline ? 'my-4' : ''
                                        }
                                    >
                                        {isChoiceMultiline && (
                                            <>{indicator}) </>
                                        )}
                                        <p
                                            className={
                                                isChoiceMultiline
                                                    ? 'my-2 ml-1 border-gray-700 dark:border-gray-300 border-l-2 pl-3'
                                                    : ''
                                            }
                                        >
                                            {!isChoiceMultiline && (
                                                <>{indicator}) </>
                                            )}
                                            <RichContent
                                                content={choice.replace(
                                                    /^[a-zA-Z0-9]+[\),.]\s*/,
                                                    '',
                                                )}
                                            />
                                        </p>
                                    </div>
                                );
                            })}
                    </li>
                </div>
            ))}
        </ol>
    );
}
