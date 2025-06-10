import React from 'react'
import moment from "moment"
import Link from 'next/link'

const EntryWithTitle = ({ entry }) => {
    return (
        <div key={entry.id} className="border rounded-lg p-4 shadow-sm">
            <p className="mb-4">{entry.message}</p>
            <p className="text-xs text-end text-gray-500">
                <Link href={`/t/${entry.title.slug}`} className="text-sky-700 hover:underline">
                    {entry.title.name}
                </Link> - {moment(entry.createdAt).format('DD.MM.YYYY hh:mm')}
            </p>
        </div>
    )
}

export default EntryWithTitle