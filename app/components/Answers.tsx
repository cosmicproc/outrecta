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
                    className={`print:break-inside-avoid ${!('correctChoiceIndex' in question) && 'my-10'}`}
                >
                    <RichContent
                        ordered={true}
                        content={`${index + 1}. ${
                            'correctChoiceIndex' in question
                                ? String.fromCharCode(
                                      65 + question.correctChoiceIndex,
                                  )
                                : question.answerText + '\n'
                        }`}
                    />
                </p>
            ))}
        </div>
    );
}
