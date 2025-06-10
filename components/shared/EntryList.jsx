import React from 'react'
import Entry from './Entry'

const EntryList = ({entries}) => {
    return (
        <div className="p-0 mt-2 bg-white">
            {entries.map((entry) => <Entry entry={entry} key={entry.id} />)}
        </div>
    )
}

export default EntryList