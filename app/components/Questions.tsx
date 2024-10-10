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
        <div>
            {questions.map((question, index) => (
                <div
                    className="my-12 print:break-inside-avoid print:text-xs"
                    key={index}
                >
                    {'questionMaterial' in question && (
                        <p className="mb-5">
                            <RichContent content={question.questionMaterial} />
                        </p>
                    )}
                    <p className="mb-4">
                        <strong>{index + 1}.</strong>&nbsp;&nbsp;
                        <RichContent content={question.questionStatement} />
                    </p>
                    {!('choices' in question) && showSpaces && (
                        <div className="min-h-32"></div>
                    )}
                    {'choices' in question &&
                        question.choices.map((choice, index) => {
                            const isChoiceMultiline =
                                choice.match('\n') || choice.match('\\\\n');
                            const indicator = String.fromCharCode(97 + index);

                            return (
                                <div
                                    key={index}
                                    className={isChoiceMultiline ? 'my-4' : ''}
                                >
                                    {isChoiceMultiline && <>{indicator}) </>}
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
                </div>
            ))}
        </div>
    );
}
