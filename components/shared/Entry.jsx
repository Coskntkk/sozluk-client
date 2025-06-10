import React, { useEffect } from 'react'
import moment from "moment"
import Link from 'next/link'
import EntryVote from './EntryVote'
import { useSelector } from 'react-redux'
import EntryActions from './EntryActions'

const Entry = ({ entry }) => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="border text-md p-4 my-4 shadow-md rounded-lg">
            <p className="text-start text-wrap text-md mb-6">
                {entry?.message}
            </p>
            <div className="flex justify-between items-center text-sm">
                <p className="text-end">
                    <Link href={`/u/${entry?.user.id}`} className='text-sky-800 hover:underline'>
                        {entry?.user.username}
                    </Link> - {moment(entry.createdAt).format('DD.MM.YYYY hh:mm')}
                </p>
                <div className="flex items-center gap-4">
                    <EntryVote
                        entryId={entry.id}
                        initialVote={entry.userVote}
                        initialScore={entry.point}
                    />
                    <EntryActions isOwner={entry.user.id === user.id} entry={entry} />
                </div>
            </div>
        </div>
    )
}

export default Entry