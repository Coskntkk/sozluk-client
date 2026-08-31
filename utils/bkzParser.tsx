import React from 'react';
import Link from 'next/link';

/**
 * Helper to slugify topic names if needed, or link to /t/[slug]
 */
export function slugifyTopic(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Parses text containing (bkz: target topic) and returns React nodes with Next.js Link components
 */
export function parseBkzText(text: string): React.ReactNode[] {
  if (!text) return [];

  // Match (bkz: target topic) or (bkz-gizli: target topic)
  const regex = /\((?:bkz|bkz-gizli):\s*([^)]+)\)/gi;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index;
    const fullMatch = match[0];
    const targetTopic = match[1]?.trim();

    // Push preceding normal text
    if (matchIndex > lastIndex) {
      elements.push(text.substring(lastIndex, matchIndex));
    }

    if (targetTopic) {
      const slug = slugifyTopic(targetTopic);
      const isHidden = fullMatch.toLowerCase().startsWith('(bkz-gizli:');

      elements.push(
        <span key={`bkz-${matchIndex}-${slug}`} className="inline-flex items-center gap-0.5">
          <span className="text-gray-400 text-xs italic">({isHidden ? '*' : 'bkz:'}</span>
          <Link
            href={`/t/${slug}`}
            className="text-sky-600 hover:text-sky-800 hover:underline font-medium mx-1"
          >
            {targetTopic}
          </Link>
          <span className="text-gray-400 text-xs italic">)</span>
        </span>
      );
    }

    lastIndex = matchIndex + fullMatch.length;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
}

export const BkzText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const content = parseBkzText(text);
  return <span className={className}>{content}</span>;
};

export default BkzText;
