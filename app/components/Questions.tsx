'use client';

import renderMathInElement from 'katex/contrib/auto-render';
import { useEffect, useRef } from 'react';
import { TestDocument } from '../constants/types';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';

export default function Questions({
    questions,
}: {
    questions: TestDocument['questions'];
}) {
    const pageRef = useRef(null);

    useEffect(() => {
        if (pageRef.current) {
            renderMathInElement(document.body, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '\\[', right: '\\]', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                ],
            });
        }
    }, [pageRef.current]);

    return (
        <div ref={pageRef}>
            {questions.map((question, index) => (
                <div className="my-10 print:break-inside-avoid" key={index}>
                    {'questionFigure' in question && (
                        <p className="mb-4">
                            {question.questionFigure}
                        </p>
                    )}
                    <p className={!('choices' in question) ? 'mb-80' : 'mb-4'}>
                        {index + 1}. {question.questionText}
                    </p>
                    {'choices' in question &&
                        question.choices.map((choice, index) => (
                            <p key={index}>
                                {String.fromCharCode(97 + index)}){' '}
                                {choice
                                    .replace(/^[a-zA-Z0-9]+[\),.]\s*/, '')
                                    .trim()}
                            </p>
                        ))}
                </div>
            ))}
        </div>
    );
}
