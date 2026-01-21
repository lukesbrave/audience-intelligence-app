'use client';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

function RichTextDisplay({ content, className = '' }: RichTextDisplayProps) {
  const parseTable = (text: string): string => {
    // Find and parse markdown tables
    const lines = text.split('\n');
    const result: string[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Check if this line starts a table (starts with |)
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableLines: string[] = [line];
        let j = i + 1;

        // Collect all consecutive table lines
        while (j < lines.length && lines[j].trim().startsWith('|') && lines[j].trim().endsWith('|')) {
          tableLines.push(lines[j]);
          j++;
        }

        // Need at least 2 lines for a valid table (header + separator or header + data)
        if (tableLines.length >= 2) {
          const tableHtml = convertTableToHtml(tableLines);
          result.push(tableHtml);
          i = j;
          continue;
        }
      }

      result.push(line);
      i++;
    }

    return result.join('\n');
  };

  const convertTableToHtml = (tableLines: string[]): string => {
    const parseRow = (row: string): string[] => {
      return row
        .split('|')
        .slice(1, -1) // Remove empty strings from leading/trailing |
        .map(cell => cell.trim());
    };

    const headerCells = parseRow(tableLines[0]);

    // Check if second line is a separator (contains dashes)
    const isSeparator = (line: string) => /^\|[\s\-:|]+\|$/.test(line.trim());

    let bodyStartIndex = 1;
    if (tableLines.length > 1 && isSeparator(tableLines[1])) {
      bodyStartIndex = 2;
    }

    const headerHtml = headerCells
      .map(cell => `<th class="border border-gray-300 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-900">${cell}</th>`)
      .join('');

    const bodyRows = tableLines.slice(bodyStartIndex).map(row => {
      const cells = parseRow(row);
      const cellsHtml = cells
        .map(cell => `<td class="border border-gray-300 px-3 py-2 text-gray-700">${cell}</td>`)
        .join('');
      return `<tr>${cellsHtml}</tr>`;
    }).join('');

    return `<table class="w-full border-collapse my-4 text-sm"><thead><tr>${headerHtml}</tr></thead><tbody>${bodyRows}</tbody></table>`;
  };

  const parseContent = (text: string): string => {
    if (!text) return '';

    // Parse tables first (before escaping HTML entities)
    let html = parseTable(text);

    // Escape HTML entities (but preserve our table HTML)
    // We need to be careful here - only escape content outside of our generated HTML
    const tableRegex = /<table[\s\S]*?<\/table>/g;
    const tables: string[] = [];
    html = html.replace(tableRegex, (match) => {
      tables.push(match);
      return `__TABLE_PLACEHOLDER_${tables.length - 1}__`;
    });

    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Restore tables
    tables.forEach((table, index) => {
      html = html.replace(`__TABLE_PLACEHOLDER_${index}__`, table);
    });

    // Horizontal rules (--- or ***)
    html = html.replace(/^-{3,}$/gm, '<hr class="my-6 border-t border-gray-200" />');
    html = html.replace(/^\*{3,}$/gm, '<hr class="my-6 border-t border-gray-200" />');

    // Headers - process from most specific to least specific (#### before ### before ##)
    html = html.replace(/^#### (.+)$/gm, '<h5 class="text-sm font-semibold text-gray-900 mt-4 mb-2">$1</h5>');
    html = html.replace(/^### (.+)$/gm, '<h4 class="text-base font-semibold text-gray-900 mt-6 mb-2">$1</h4>');
    html = html.replace(/^## (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-900 mt-8 mb-3">$1</h3>');

    // Bold text (must come before italic and asterisk list parsing)
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');

    // Italic text - single asterisk (but not preceded/followed by asterisk or space)
    html = html.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em class="italic">$1</em>');

    // Italic text - underscores
    html = html.replace(/(?<!_)_([^_\n]+)_(?!_)/g, '<em class="italic">$1</em>');

    // Clean up stray asterisks that aren't part of formatting (at start of words)
    html = html.replace(/(\s)\*([^\s*])/g, '$1$2');

    // Blockquotes
    html = html.replace(
      /^&gt; (.+)$/gm,
      '<blockquote class="border-l-4 border-[#BBDCEF] bg-[#BBDCEF]/10 pl-4 py-2 my-3 text-gray-700 italic">$1</blockquote>'
    );

    // Process lists - need to handle multi-line lists
    const lines = html.split('\n');
    const processedLines: string[] = [];
    let inUnorderedList = false;
    let inOrderedList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const bulletMatch = line.match(/^[-•*] (.+)$/);
      const numberedMatch = line.match(/^\d+\. (.+)$/);

      if (bulletMatch) {
        if (!inUnorderedList) {
          if (inOrderedList) {
            processedLines.push('</ol>');
            inOrderedList = false;
          }
          processedLines.push('<ul class="list-disc list-outside ml-5 my-3 space-y-1.5">');
          inUnorderedList = true;
        }
        processedLines.push(`<li class="text-gray-700 leading-relaxed">${bulletMatch[1]}</li>`);
      } else if (numberedMatch) {
        if (!inOrderedList) {
          if (inUnorderedList) {
            processedLines.push('</ul>');
            inUnorderedList = false;
          }
          processedLines.push('<ol class="list-decimal list-outside ml-5 my-3 space-y-1.5">');
          inOrderedList = true;
        }
        processedLines.push(`<li class="text-gray-700 leading-relaxed">${numberedMatch[1]}</li>`);
      } else {
        if (inUnorderedList) {
          processedLines.push('</ul>');
          inUnorderedList = false;
        }
        if (inOrderedList) {
          processedLines.push('</ol>');
          inOrderedList = false;
        }
        processedLines.push(line);
      }
    }

    // Close any remaining open lists
    if (inUnorderedList) processedLines.push('</ul>');
    if (inOrderedList) processedLines.push('</ol>');

    html = processedLines.join('\n');

    // Paragraphs - double newlines become paragraph breaks
    html = html.replace(/\n\n+/g, '</p><p class="mb-4 leading-relaxed text-gray-700">');

    // Single newlines within paragraphs become line breaks (but not inside lists)
    html = html.replace(/(?<!<\/li>)\n(?!<)/g, '<br/>');

    // Wrap in paragraph if not starting with a block element
    if (!html.startsWith('<h') && !html.startsWith('<ul') && !html.startsWith('<ol') && !html.startsWith('<blockquote')) {
      html = `<p class="mb-4 leading-relaxed text-gray-700">${html}</p>`;
    }

    // Clean up empty paragraphs
    html = html.replace(/<p[^>]*>\s*<\/p>/g, '');

    return html;
  };

  return (
    <div
      className={`rich-text-display ${className}`}
      dangerouslySetInnerHTML={{ __html: parseContent(content) }}
    />
  );
}

export { RichTextDisplay };
export type { RichTextDisplayProps };
