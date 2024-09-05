'use client';

import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';
import { useEffect, useRef } from 'react';
import renderMathInElement from 'katex/contrib/auto-render';
import { delimiters } from '../constants/etc';

export default function RichContent({ content }: { content: string }) {
    const pageRef = useRef(null);

    useEffect(() => {
        if (pageRef.current) {
            renderMathInElement(document.body, {
                delimiters,
            });
        }
    }, []);

    // Replace code blocks with pre/code tags
    const rendered = DOMPurify.sanitize(
        content
            .trim()
            .replaceAll(
                /```\w+?\n([\s\S]*?)```/g,
                (_, code) => `<pre><code>${code}</code></pre>`,
            )
            .replaceAll(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`)
            .replaceAll('\\n', '<br />'),
    );
    return (
        <span
            ref={pageRef}
            dangerouslySetInnerHTML={{
                __html: rendered,
            }}
        />
    );
}
