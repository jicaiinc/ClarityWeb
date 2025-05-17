import React, { useEffect, useRef } from 'react';
import { marked, type Tokens } from 'marked';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';  
import 'highlight.js/styles/github-dark.css';  
import { Copy, Check } from 'lucide-react';
import { useTheme } from "next-themes"

interface StreamingMarkdownProps {
  content: string;
  className?: string;
}

export const StreamingMarkdown: React.FC<StreamingMarkdownProps> = ({
  content,
  className
}) => {
  const { theme, systemTheme } = useTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme
  console.log('currentTheme-----: ',currentTheme);
  const containerRef = useRef<HTMLDivElement>(null);

    // Create renderer instance
    const renderer = new marked.Renderer();

    // Override code block rendering
    renderer.code = (tokenCode: Tokens.Code): string => {
    const { text, lang } = tokenCode;
    const isDark = currentTheme === 'dark';
    const highlightedCode = lang
        ? hljs.highlight(text, { language: lang }).value
        : hljs.highlightAuto(text).value;

    return `
        <div class="relative group ${isDark ? 'dark' : ''}">
        <div class="flex items-center justify-between bg-muted px-4 py-2 rounded-t-lg">
            <span class="text-sm text-muted-foreground">${lang || 'text'}</span>
            <button class="copy-button hidden group-hover:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    data-code="${text.replace(/"/g, '&quot;')}">
            <Copy size={14} />
            Copy
            </button>
        </div>
        <pre class="!mt-0 !rounded-t-none ${isDark ? 'hljs-dark' : 'hljs-light'}"><code class="hljs language-${lang || 'text'}">${highlightedCode}</code></pre>
        </div>
    `;
    };

    // Override table rendering
    renderer.table = (token: Tokens.Table): string => {
    const { header, rows, align } = token;

    const headerHtml = `
        <tr>
        ${header.map((cell, i) => `
            <th class="px-4 py-2 ${align[i] ? `text-${align[i]}` : 'text-left'}">${cell.text}</th>
        `).join('')}
        </tr>`;

    const bodyHtml = rows.map(row => `
        <tr>
        ${row.map((cell, i) => `
            <td class="px-4 py-2 border-t ${align[i] ? `text-${align[i]}` : 'text-left'}">${cell.text}</td>
        `).join('')}
        </tr>
    `).join('');

    return `
        <div class="overflow-x-auto">
        <table class="w-full border-collapse">
            <thead class="bg-muted">${headerHtml}</thead>
            <tbody>${bodyHtml}</tbody>
        </table>
        </div>
    `;
    };

  // Function to render math expressions
  const renderMath = (tex: string, displayMode: boolean): string => {
    try {
      return katex.renderToString(tex, {
        displayMode,
        throwOnError: false,
        output: 'html'
      });
    } catch (error) {
      console.error('KaTeX error:', error);
      return tex;
    }
  };

  // Function to process math expressions
  const processMathExpressions = (text: string): string => {
    // Handle block math with \[ \]
    text = text.replace(/\\\[(.*?)\\\]/gs, (_, tex) => renderMath(tex, true));

    // Handle block math with \( \)
    text = text.replace(/\\\((.*?)\\\)/gs, (_, tex) => renderMath(tex, true));
    
    // Handle block math with $$ $$
    text = text.replace(/\$\$(.*?)\$\$/gs, (_, tex) => renderMath(tex, true));
    
    // Handle inline math with single $
    text = text.replace(/\$(.+?)\$/g, (_, tex) => renderMath(tex, false));
    
    return text;
  };

    // Configure marked options
    marked.setOptions({
    renderer,
    gfm: true,
    breaks: true
    // headerIds: false,
    // mangle: false
    });

  useEffect(() => {
    if (!containerRef.current) return;

    // Process math expressions first
    const processedContent = processMathExpressions(content);

    // Parse markdown and sanitize HTML
    const rawHtml:string = marked(processedContent, {async:false});
    console.log('rawHtml-----: ',rawHtml);
    const sanitizedHtml = DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: { html: true },
      ALLOWED_TAGS: [
        'p', 'br', 'b', 'i', 'em', 'strong', 'code', 'pre',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'a', 'hr',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span', 'button', 'svg', 'path'
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'data-code', 'size']
    });

    containerRef.current.innerHTML = sanitizedHtml;

    // Add copy button functionality
    const copyButtons = containerRef.current.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
      if (button instanceof HTMLElement) {
        button.onclick = async () => {
          const code = button.getAttribute('data-code');
          if (code) {
            await navigator.clipboard.writeText(code);
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="flex items-center gap-2"><svg class="lucide lucide-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!</span>';
            setTimeout(() => {
              button.innerHTML = originalText;
            }, 2000);
          }
        };
      }
    });
  }, [content]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        'prose dark:prose-invert max-w-none',
        'prose-headings:mb-3 prose-headings:mt-6',
        'prose-p:my-3 prose-p:leading-7',
        'prose-li:my-2',
        'prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md',
        'prose-pre:my-3 prose-pre:p-0',
        'dark:prose-pre:bg-[#1e1e1e]',  
        'prose-pre:bg-[#f6f8fa]',       
        'dark:prose-code:bg-[#1e1e1e]', 
        'prose-code:bg-[#f6f8fa]',      
        // 表格样式
        'prose-table:w-full prose-table:my-4',
        'prose-table:border prose-table:border-collapse',
        'prose-th:border prose-th:border-border prose-th:p-2 prose-th:bg-muted',
        'prose-td:border prose-td:border-border prose-td:p-2',
        'dark:prose-th:bg-[#1e1e1e] dark:prose-th:border-gray-700',
        'dark:prose-td:border-gray-700',
        className
      )}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(processMathExpressions(content), {async:false})) }}
    />
  );
};
