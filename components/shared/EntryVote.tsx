import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import EntryService from '@/services/EntryService';
import { errorNote } from '@/utils/ToastNotify';

interface EntryVoteProps {
  entryId: number;
  initialVote?: number; // 1 = upvoted, -1 = downvoted, 0 = not voted
  initialScore?: number;
}

const parseVoteValue = (val: any): 1 | -1 | 0 => {
  const num = Number(val);
  if (num === 1) return 1;
  if (num === -1) return -1;
  return 0;
};

const EntryVote: React.FC<EntryVoteProps> = ({ entryId, initialVote = 0, initialScore = 0 }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [vote, setVote] = useState<1 | -1 | 0>(parseVoteValue(initialVote));
  const [score, setScore] = useState<number>(Number(initialScore) || 0);
  const [isMutating, setIsMutating] = useState<boolean>(false);

  // Synchronize state when initialVote or initialScore props change
  useEffect(() => {
    setVote(parseVoteValue(initialVote));
  }, [initialVote]);

  useEffect(() => {
    setScore(Number(initialScore) || 0);
  }, [initialScore]);

  const hasVoted = vote !== 0;

  const handleVote = async (targetVote: 1 | -1) => {
    // If guest, mutating, or already voted (-1 or 1), voting is disallowed
    if (!isAuthenticated || isMutating || hasVoted) return;

    const prevVote = vote;
    const prevScore = score;

    // Apply optimistic update immediately
    setVote(targetVote);
    setScore((curr) => curr + targetVote);
    setIsMutating(true);

    try {
      await EntryService.voteEntry(entryId, targetVote);
    } catch (err: any) {
      // Rollback on network or API failure
      setVote(prevVote);
      setScore(prevScore);
      errorNote(err.response?.data?.message || 'Vote could not be processed.');
    } finally {
      setIsMutating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-slate-700">
        <span
          className={`font-bold ${
            score > 0 ? 'text-emerald-600 dark:text-emerald-400' : score < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-700 dark:text-slate-300'
          }`}
        >
          {score}
        </span>
        <span className="text-[11px] text-gray-400 dark:text-slate-500">points</span>
      </div>
    );
  }

  const isUpvoted = vote === 1;
  const isDownvoted = vote === -1;

  return (
    <div className="inline-flex items-center gap-1 bg-gray-50/80 dark:bg-slate-800 p-0.5 rounded-lg border border-gray-200 dark:border-slate-700 shadow-2xs">
      {/* Upvote Button (1 = Upvoted) */}
      <button
        type="button"
        onClick={() => handleVote(1)}
        disabled={isMutating || hasVoted}
        aria-label="Upvote"
        title={
          isUpvoted
            ? 'You have upvoted this entry'
            : hasVoted
            ? 'Already voted on this entry'
            : 'Upvote (+1)'
        }
        className={`px-2 py-1 text-xs rounded-md transition flex items-center gap-1 font-semibold cursor-pointer ${
          isUpvoted
            ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-200 dark:ring-emerald-900 cursor-default'
            : hasVoted
            ? 'text-gray-300 dark:text-slate-600 opacity-40 cursor-not-allowed'
            : 'text-gray-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300'
        }`}
      >
        <span>▲</span>
      </button>

      {/* Vote Score */}
      <span
        className={`px-1.5 text-xs font-bold transition min-w-5 text-center ${
          score > 0
            ? 'text-emerald-600 dark:text-emerald-400'
            : score < 0
            ? 'text-rose-600 dark:text-rose-400'
            : 'text-gray-700 dark:text-slate-300'
        }`}
      >
        {score}
      </span>

      {/* Downvote Button (-1 = Downvoted) */}
      <button
        type="button"
        onClick={() => handleVote(-1)}
        disabled={isMutating || hasVoted}
        aria-label="Downvote"
        title={
          isDownvoted
            ? 'You have downvoted this entry'
            : hasVoted
            ? 'Already voted on this entry'
            : 'Downvote (-1)'
        }
        className={`px-2 py-1 text-xs rounded-md transition flex items-center gap-1 font-semibold cursor-pointer ${
          isDownvoted
            ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-200 dark:ring-rose-900 cursor-default'
            : hasVoted
            ? 'text-gray-300 dark:text-slate-600 opacity-40 cursor-not-allowed'
            : 'text-gray-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-700 dark:hover:text-rose-300'
        }`}
      >
        <span>▼</span>
      </button>
    </div>
  );
};

export default EntryVote;
