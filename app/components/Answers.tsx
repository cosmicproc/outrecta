'use client';

import renderMathInElement from 'katex/contrib/auto-render';
import { useEffect, useRef } from 'react';
import { TestDocument } from '../constants/types';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';
import { delimiters } from '../constants/etc';

export default function Answers({
    questions,
}: {
    questions: TestDocument['questions'];
}) {
    const pageRef = useRef(null);

    useEffect(() => {
        if (pageRef.current) {
            renderMathInElement(document.body, {
                delimiters,
            });
        }
    }, [pageRef.current]);

    return (
        <div ref={pageRef} className="my-10">
            {questions.map((question, index) => (
                <p
                    key={index}
                    className={`print:break-inside-avoid ${!('correctChoiceIndex' in question) && 'my-10'}`}
                >
                    {index + 1}.{' '}
                    {'correctChoiceIndex' in question
                        ? String.fromCharCode(65 + question.correctChoiceIndex)
                        : question.answerText + '\n'}
                </p>
            ))}
        </div>
    );
}
