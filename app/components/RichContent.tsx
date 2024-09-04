'use client';

import DOMPurify from 'dompurify';
import renderMathInElement from 'katex/contrib/auto-render';
import { Marked } from 'marked';
import { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';
import 'highlight.js/styles/github.css';
import { delimiters } from '../constants/etc';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

export default function RichContent({
    content,
    ordered,
}: {
    content: string;
    ordered?: boolean;
}) {
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            renderMathInElement(document.body, {
                delimiters,
            });
        }
    }, []);

    const marked = new Marked(
        markedHighlight({
            langPrefix: 'hljs language-',
            highlight(code, lang, info) {
                const language = hljs.getLanguage(lang) ? lang : null;
                if (language) {
                    return hljs.highlight(code, { language }).value;
                } else {
                    return hljs.highlightAuto(code).value;
                }
            },
        }),
    );

    const rendered = DOMPurify.sanitize(marked.parse(content.trim()) as string);
    return (
        <div
            className={ordered ? '[&>ol]:list-decimal' : ''}
            ref={contentRef}
            dangerouslySetInnerHTML={{
                __html: rendered,
            }}
        />
    );
}
