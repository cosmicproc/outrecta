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

    const process = (content: string) =>
        content
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll(
                /```\w+?[\n,\\n]([\s\S]*?)```/g,
                (_, code) => `<pre><code>${code}</code></pre>`,
            )
            .replaceAll(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`)
            .replaceAll(/\*\*([^\*]+)\*\*/g, (_, code) => `<b>${code}</b>`)
            .replaceAll(/\*([^\*]+)\*/g, (_, code) => `<i>${code}</i>`)
            .replaceAll(/(?<!\\\[)(?<!\\\()(\\n)(?!\\\])(?!\\\))/g, '<br />')
            .replaceAll(/(?<!\\\[)(?<!\\\()(\n)(?!\\\])(?!\\\))/g, '<br />')
            .trim();

    const rendered = DOMPurify.sanitize(process(content));
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
