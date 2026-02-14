import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeKatex from 'rehype-katex';

/**
 * Parse markdown with math support using remark/rehype pipeline
 * This is the standard, proven way to handle math in markdown
 */
export const parseMarkdownWithMath = async (content: string): Promise<string> => {
  try {
    const processor = unified()
      .use(remarkParse)                    // Parse markdown
      .use(remarkMath)                     // Recognize math blocks
      .use(remarkRehype, { passThrough: ['math'] }) // Convert to HTML, preserve math
      .use(rehypeKatex)                    // Render math with KaTeX
      .use(rehypeStringify);               // Stringify to HTML

    const htmlContent = await processor.process(content);
    return String(htmlContent);
  } catch (error) {
    console.error('Error parsing markdown with math:', error);
    // Fallback: return escaped content
    return `<p>${content}</p>`;
  }
};

/**
 * Get CSS for math rendering (KaTeX styles are auto-injected by rehype-katex)
 */
export const getMathCSS = (): string => {
  return `
    /* KaTeX Math Rendering Styles */
    .math-inline, .math-display {
      font-size: 1em;
      line-height: 1.2;
    }

    .math-inline {
      display: inline;
      padding: 0 2px;
      vertical-align: middle;
    }

    .math-display {
      display: block;
      text-align: center;
      padding: 1.5rem 0;
      margin: 1.5rem 0;
      overflow-x: auto;
      overflow-y: hidden;
    }

    /* KaTeX Fonts and Rendering */
    .katex {
      font-size: 1.1em;
      line-height: 1.4;
    }

    .katex-display {
      margin: 1em 0;
      padding: 1em 0;
    }

    .katex-html {
      display: inline-block;
    }

    /* Improve rendering quality */
    .katex .base {
      position: relative;
      display: inline-block;
    }

    .katex .strut {
      display: inline-block;
    }

    /* Responsive math on mobile */
    @media (max-width: 640px) {
      .math-display {
        padding: 1rem 0;
        margin: 1rem 0;
        font-size: 0.95em;
      }

      .katex {
        font-size: 1em;
      }
    }
  `;
};

/**
 * Add math CSS to document head
 */
export const injectMathCSS = (): void => {
  if (typeof document === 'undefined') return;

  const styleId = 'katex-math-styles';

  // Check if styles already injected
  if (document.getElementById(styleId)) return;

  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = getMathCSS();
  document.head.appendChild(styleElement);
};
