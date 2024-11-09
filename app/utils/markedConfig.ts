import katex from 'katex';
import { marked, TokenizerAndRendererExtension } from 'marked';

const patterns = [
    /^(\${1,2})([^\$]+?)\1/,
    /^(\\\()([^\$]+?)\\\)/,
    /^(\\\[)([^\$]+?)\\\]/,
];

export const katexExtension = {
    name: 'katex',
    level: 'inline',
    start(src: string) {
        let index =
            src.indexOf('$') || src.indexOf('\\(') || src.indexOf('\\[');
        if (index !== -1) {
            return index;
        }
    },
    tokenizer(src: string, tokens: string[]) {
        let match = null;
        let i = 0;
        while (match === null && i < patterns.length) {
            match = src.match(patterns[i]);
            i++;
        }
        if (match) {
            return {
                type: 'katex',
                raw: match[0],
                text: match[2]?.trim(),
            };
        }
    },
    renderer: (token: { text: string }) =>
        katex.renderToString(token.text, { throwOnError: false }),
} as unknown as TokenizerAndRendererExtension;

marked.use({ breaks: true, gfm: true });
marked.use({
    extensions: [katexExtension],
});
