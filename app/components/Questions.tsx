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
                    {'preQuestionField' in question && (
                        <p className="mb-4">
                            <RichContent content={question.preQuestionField} />
                        </p>
                    )}
                    <p className={!('choices' in question) ? 'mb-80' : 'mb-4'}>
                        <RichContent
                            ordered={true}
                            content={`${index + 1}. ${question.questionText}`}
                        />
                    </p>
                    {'choices' in question &&
                        question.choices.map((choice, index) => (
                            <p key={index}>
                                <RichContent
                                    content={`${String.fromCharCode(97 + index)}) ${choice.replace(/^[a-zA-Z0-9]+[\),.]\s*/, '')}`}
                                />
                            </p>
                        ))}
                </div>
            ))}
        </div>
    );
}
