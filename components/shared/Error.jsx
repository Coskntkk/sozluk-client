import React from 'react'

const Error = ({ error }) => {
    return (
        <div>
            {error.message || 'Something went wrong :('}
        </div>
    )
}

export default Error