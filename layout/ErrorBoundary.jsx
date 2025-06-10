import Error from '@/components/shared/Error'
import Spinner from '@/components/shared/Spinner'
import React from 'react'

const ErrorBoundary = ({ children, error, loading }) => {
    return (loading
        ? (<Spinner />)
        : error.isError ? (<Error error={error} />)
            : (<>{children}</>)
    )
}

export default ErrorBoundary