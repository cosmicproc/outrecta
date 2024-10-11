'use client';

import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';
import { useEffect, useRef } from 'react';
import renderMathInElement from 'katex/contrib/auto-render';

export default function RichContent({ content }: { content: string }) {
    const pageRef = useRef(null);

    useEffect(() => {
        if (pageRef.current) {
            renderMathInElement(document.body, {
                delimiters: [
                    { left: '$$', right: '$$', display: false },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: false },
                ],
            });
        }
    }, []);

    const rendered = DOMPurify.sanitize(content.trim());
    return (
        <span
            className="[&>pre]:whitespace-pre-wrap"
            ref={pageRef}
            dangerouslySetInnerHTML={{
                __html: rendered,
            }}
        />
    );
}
