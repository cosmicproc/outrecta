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
            renderMathInElement(document.body);
        }
    }, []);

    const process = (content: string) =>
        content
            .trim()
            .replaceAll(/</g, '&lt;')
            .replaceAll(/>/g, '&gt;')
            .replaceAll(
                /```\w+?\n([\s\S]*?)```/g,
                (_, code) => `<pre><code>${code}</code></pre>`,
            )
            .replaceAll(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`)
            .replaceAll(/\*\*([^\*]+)\*\*/g, (_, code) => `<b>${code}</b>`)
            .replaceAll('\n', '<br />');

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
