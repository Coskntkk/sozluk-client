import React from 'react';
import Entry from './Entry';
import { Entry as EntryType } from '@/types';

interface EntryListProps {
  entries: EntryType[];
  onDeleted?: (entryId: number) => void;
}

const EntryList: React.FC<EntryListProps> = ({ entries, onDeleted }) => {
  if (!entries || entries.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400 text-sm">
        No entries found.
      </div>
    );
  }

  return (
    <div className="space-y-4 my-4">
      {entries.map((entry) => (
        <Entry entry={entry} key={entry.id} onDeleted={onDeleted} />
      ))}
    </div>
  );
};

export default EntryList;
