import DOMPurify from 'dompurify';
import 'katex/contrib/mhchem';
import 'katex/dist/katex.min.css';
import { marked } from 'marked';
import '../utils/markedConfig';

export default function RichContent({ content }: { content: string }) {
    const rendered = DOMPurify.sanitize(marked(content) as string);

    return (
        <span
            className="[&>pre]:whitespace-pre-wrap [&>p]:first:inline"
            dangerouslySetInnerHTML={{
                __html: rendered,
            }}
        />
    );
}
