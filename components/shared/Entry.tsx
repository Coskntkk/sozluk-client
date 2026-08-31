import React, { useState } from 'react';
import moment from 'moment';
import Link from 'next/link';
import EntryVote from './EntryVote';
import EntryActions from './EntryActions';
import BkzText from '@/utils/bkzParser';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTranslation } from 'react-i18next';
import { Entry as EntryType } from '@/types';
import { successNote } from '@/utils/ToastNotify';

interface EntryProps {
  entry: EntryType;
  onDeleted?: (entryId: number) => void;
}

const Entry: React.FC<EntryProps> = ({ entry, onDeleted }) => {
  const { t } = useTranslation('entry_actions');
  const { user } = useSelector((state: RootState) => state.auth);
  const [deleted, setDeleted] = useState(!!entry.deletedAt);

  const author = entry.author || entry.user;
  const authorUsername = author?.username || (entry as any).username || 'anonymous';
  const isOwner =
    user?.id === entry.userId ||
    user?.id === entry.user?.id ||
    user?.id === entry.author?.id ||
    user?.username === authorUsername;

  const handleDeleted = (id: number) => {
    setDeleted(true);
    if (onDeleted) onDeleted(id);
  };

  const handleCopyBkz = () => {
    const topicName = entry.title?.name || '';
    if (topicName) {
      navigator.clipboard.writeText(`(bkz: ${topicName})`);
      successNote(`Copied: (bkz: ${topicName})`);
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/e/${entry.id}`);
      successNote('Entry link copied to clipboard');
    }
  };

  const entryScore = entry.voteScore ?? entry.point ?? entry.score ?? 0;

  return (
    <article className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-200">
      {/* Entry Body */}
      <div className="text-gray-900 dark:text-slate-100 text-sm leading-relaxed mb-4 break-words whitespace-pre-line">
        {deleted ? (
          <p className="text-gray-400 dark:text-slate-500 italic bg-gray-50 dark:bg-slate-800/40 p-3 rounded-lg border border-dashed border-gray-200 dark:border-slate-700 text-xs">
            ⚠️ {t('deleted_notice', 'This entry was deleted')}
          </p>
        ) : (
          <BkzText text={entry.message} />
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-50 dark:border-slate-800/80 text-xs text-gray-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          {!deleted && (
            <EntryVote
              entryId={entry.id}
              initialVote={
                entry.userVote ??
                (entry as any).vote ??
                (entry as any).user_vote ??
                (entry as any).voteValue ??
                0
              }
              initialScore={entryScore}
            />
          )}

          {!deleted && (
            <button
              type="button"
              onClick={handleCopyBkz}
              title="Copy bkz link or permalink"
              className="text-gray-400 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition px-1.5 py-1 rounded hover:bg-sky-50 dark:hover:bg-slate-800 text-[11px] cursor-pointer"
            >
              (bkz)
            </button>
          )}

          <EntryActions isOwner={isOwner} entry={entry} onDeleted={handleDeleted} />
        </div>

        <div className="flex items-center gap-2 text-end text-xs">
          <Link
            href={authorUsername !== 'anonymous' ? `/u/${authorUsername}` : '#'}
            className="font-medium text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-200 hover:underline"
          >
            {authorUsername}
          </Link>
          <span className="text-gray-300 dark:text-slate-600">•</span>
          <Link
            href={`/e/${entry.id}`}
            className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:underline"
          >
            {moment(entry.createdAt).format('DD.MM.YYYY HH:mm')}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Entry;
