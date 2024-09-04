import { TestDocument } from '../constants/types';
import RichContent from './RichContent';

export default function Questions({
    questions,
}: {
    questions: TestDocument['questions'];
}) {
    return (
        <div>
            {questions.map((question, index) => (
                <div className="my-12 print:break-inside-avoid" key={index}>
                    {'questionMaterial' in question && (
                        <p className="mb-4">
                            <RichContent content={question.questionMaterial} />
                        </p>
                    )}
                    <p className={!('choices' in question) ? 'mb-80' : 'mb-4'}>
                        <strong>{index + 1}.</strong>{' '}
                        <RichContent content={question.questionStatement} />
                    </p>
                    {'choices' in question &&
                        question.choices.map((choice, index) => {
                            const isChoiceMultiline = choice.match('\n');
                            const indicator = String.fromCharCode(97 + index);

                            return (
                                <div
                                    key={index}
                                    className={isChoiceMultiline ? 'my-4' : ''}
                                >
                                    {isChoiceMultiline && <>{indicator} )</>}
                                    <p
                                        className={
                                            choice.match('\n')
                                                ? 'my-2 ml-1 border-gray-700 dark:border-gray-300 border-l-2 pl-3'
                                                : ''
                                        }
                                    >
                                        {!isChoiceMultiline && (
                                            <>{indicator} )</>
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
