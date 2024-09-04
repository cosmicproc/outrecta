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
            .replaceAll('\n', '<br />')
            .replaceAll(
                /```[\w]*\n([\s\S]*?)```/g,
                `<br /><pre><code>$1</code></pre><br />`,
            )
            .replaceAll(/`([^`]+?)`/g, (match, p1) => `<code>${p1}</code>`),
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
