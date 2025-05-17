import React, { useEffect, useRef, useState } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import { useTheme } from "next-themes"
import 'highlight.js/styles/github-dark.css';
import 'highlight.js/styles/github.css';
import './StreamingRemark.css';

interface StreamingRemarkProps {
  content: string;
  className?: string;
}

export const StreamingRemark: React.FC<StreamingRemarkProps> = ({
  content,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, systemTheme } = useTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme
  console.log('currentTheme-----: ',currentTheme);

  const highLightparams = { // Code syntax highlighting
    detect: true,
    ignoreMissing: true,
    theme: currentTheme === 'dark' ? 'github-dark' : 'github-light',
  };

    // Function to process math expressions
    const proceesMath = (text: string): string => {
        // Replace \[ \] with $$ $$
        text = text.replace(/\\\[(.*?)\\\]/gs, (_, tex) => `$$${tex}$$`);
        // Replace \( \) with single $
        text = text.replace(/\\\((.*?)\\\)/gs, (_, tex) => `$${tex}$`);
        return text;
    };

  useEffect(() => {
    const processContent = async () => {
      if (!containerRef.current) return;
      
      const result = await unified()
        .use(remarkParse)
        .use(remarkGfm) // Support GitHub Flavored Markdown (tables, etc.)
        .use(remarkMath) // Support math formulas
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw) // Pass through HTML
        .use(rehypeKatex) // Render math formulas
        .use(rehypeHighlight, highLightparams)
        .use(rehypeStringify)
        .process(proceesMath(content));

      containerRef.current.innerHTML = String(result);

      // Add code block headers and copy buttons
      const codeBlocks = containerRef.current.querySelectorAll('pre code');
      codeBlocks.forEach((codeBlock) => {
        const pre = codeBlock.parentElement;
        if (!pre) return;

        // Get the language class
        const languageClass = Array.from(codeBlock.classList)
          .find(className => className.startsWith('language-'));
        const language = languageClass ? languageClass.replace('language-', '') : 'plaintext';

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';

        // Create header
        const header = document.createElement('div');
        header.className = 'code-block-header';

        // Add language label
        const languageLabel = document.createElement('span');
        languageLabel.className = 'code-language';
        languageLabel.textContent = language;
        header.appendChild(languageLabel);

        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';

        // Add copy icon
        const copyIcon = document.createElement('span');
        copyIcon.className = 'copy-icon';
        copyIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h8.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 10.25 17h-8.5A1.75 1.75 0 0 1 0 15.25v-8.5zm1.75-.25a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25h-8.5zM5 3.25a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 .75.75v8.5a.75.75 0 0 1-.75.75h-.75v-1.5h.25a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25h-7.5a.25.25 0 0 0-.25.25v.25h-1.5v-.75z" fill="currentColor"/>
        </svg>`;

        // Add check icon (initially hidden)
        const checkIcon = document.createElement('span');
        checkIcon.className = 'check-icon';
        checkIcon.style.display = 'none';
        checkIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" fill="currentColor"/>
        </svg>`;

        const buttonText = document.createElement('span');
        buttonText.textContent = 'Copy code';

        copyButton.appendChild(copyIcon);
        copyButton.appendChild(checkIcon);
        copyButton.appendChild(buttonText);

        copyButton.onclick = async () => {
          try {
            await navigator.clipboard.writeText(codeBlock.textContent || '');
            buttonText.textContent = 'Copied';
            copyButton.classList.add('copied');
            copyIcon.style.display = 'none';
            checkIcon.style.display = 'inline-block';
            setTimeout(() => {
              buttonText.textContent = 'Copy code';
              copyButton.classList.remove('copied');
              copyIcon.style.display = 'inline-block';
              checkIcon.style.display = 'none';
            }, 2000);
          } catch (err) {
            console.error('Failed to copy code:', err);
          }
        };
        header.appendChild(copyButton);

        // Wrap the pre element
        pre.parentNode?.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);
      });
    };

    processContent();
  }, [content]);

  const generalClasses = currentTheme === 'dark'? 'prose-invert': 'prose-slate'
  const tableClasses = currentTheme === 'dark' 
    ? 'prose-table:border-gray-700 prose-th:bg-gray-800 prose-th:text-gray-200 prose-td:border-gray-700'
    : 'prose-table:border-gray-300 prose-th:bg-gray-100 prose-th:text-gray-800 prose-td:border-gray-300'
    const codeClasses = currentTheme === 'dark' 
    ? `prose-code:bg-gray-800 prose-code:text-gray-200 
    prose-pre:bg-gray-800 prose-pre:text-gray-200 prose-pre:border-0 prose-pre:p-0 prose-pre:w-full 
    prose-code:before:content-none prose-code:after:content-none`
    : `prose-code:bg-white-100 prose-code:text-gray-800 
    prose-pre:bg-white-100 prose-pre:text-gray-800 prose-pre:border-0 prose-pre:p-0 prose-pre:w-full 
    prose-code:before:content-none prose-code:after:content-none`
  return (
    <div 
      ref={containerRef}
      data-theme={currentTheme}
      className={`prose max-w-none 
        ${generalClasses} 
        ${tableClasses}
        ${codeClasses}
        prose-table:border prose-table:border-collapse
        prose-th:border prose-th:p-2
        prose-td:border prose-td:p-2
        ${className || ''}`}
    />
  );
};