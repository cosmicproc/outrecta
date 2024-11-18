import DOMPurify from 'dompurify';
import 'katex/contrib/mhchem';
import 'katex/dist/katex.min.css';
import { marked } from 'marked';
import '../utils/markedConfig';

export default function RichContent({ content }: { content: string }) {
    const rendered = DOMPurify.sanitize(marked(content) as string);

    return (
        <span
            className="prose dark:prose-invert text-gray-950 dark:text-gray-100 print:text-xs [&>p:first-child]:inline"
            dangerouslySetInnerHTML={{
                __html: rendered,
            }}
        />
    );
}
