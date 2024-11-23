import DOMPurify from 'dompurify';
import 'katex/contrib/mhchem';
import 'katex/dist/katex.min.css';
import { marked } from 'marked';
import '../utils/markedConfig';

export default function RichContent({ content }: { content: string }) {
    const rendered = DOMPurify.sanitize(marked(content) as string);

    return (
        <span
            className="prose text-gray-950 dark:prose-invert dark:text-gray-100 print:text-xs print:prose-pre:bg-transparent print:prose-pre:ps-0 print:prose-pre:text-gray-950 [&>p:first-child]:inline"
            dangerouslySetInnerHTML={{
                __html: rendered,
            }}
        />
    );
}
