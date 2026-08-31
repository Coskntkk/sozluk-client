import React from 'react';
import moment from 'moment';
import Link from 'next/link';
import BkzText from '@/utils/bkzParser';
import { Entry as EntryType } from '@/types';

interface EntryWithTitleProps {
  entry: EntryType;
}

const EntryWithTitle: React.FC<EntryWithTitleProps> = ({ entry }) => {
  const author = entry.author || entry.user;
  const authorUsername = author?.username || (entry as any).username;

  return (
    <article className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-200">
      <div className="text-gray-900 dark:text-slate-100 text-sm leading-relaxed mb-4 break-words whitespace-pre-line">
        {entry.deletedAt ? (
          <p className="text-gray-400 dark:text-slate-500 italic bg-gray-50 dark:bg-slate-800/40 p-3 rounded-lg border border-dashed border-gray-200 dark:border-slate-700 text-xs">
            ⚠️ this entry is deleted by the moderation
          </p>
        ) : (
          <BkzText text={entry.message} />
        )}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400">
        <div>
          {entry.title && (
            <Link
              href={`/t/${entry.title.slug}`}
              className="font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-200 hover:underline"
            >
              # {entry.title.name}
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          {authorUsername && (
            <>
              <Link
                href={`/u/${authorUsername}`}
                className="font-medium text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-200 hover:underline"
              >
                {authorUsername}
              </Link>
              <span className="text-gray-300 dark:text-slate-600">•</span>
            </>
          )}
          <Link href={`/e/${entry.id}`} className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:underline">
            {moment(entry.createdAt).format('DD.MM.YYYY HH:mm')}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default EntryWithTitle;
