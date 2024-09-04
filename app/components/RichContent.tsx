'use client';

import DOMPurify from 'dompurify';
import { Marked } from 'marked';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';
import 'highlight.js/styles/github.css';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import markedKatex from 'marked-katex-extension';

export default function RichContent({
    content,
    ordered,
}: {
    content: string;
    ordered?: boolean;
}) {
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

    marked.use(markedKatex({ nonStandard: true }));
    const rendered = DOMPurify.sanitize(
        (marked.parse(content.trim()) as string).replaceAll('\\n', '<br />'),
    );
    return (
        <div
            className={ordered ? '[&>ol]:list-decimal' : ''}
            dangerouslySetInnerHTML={{
                __html: rendered,
            }}
        />
    );
}
