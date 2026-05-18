import ErrorBoundary from '@/layout/ErrorBoundary'
import EntryService from '@/services/EntryService'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const EntryVote = ({ entryId, initialVote, initialScore }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [vote, setVote] = useState(initialVote) // 1, -1, 0
    const [score, setScore] = useState(initialScore)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({
        isError: false,
        message: ''
    })

    const handleVote = async (value) => {
        setLoading(true);
        EntryService.voteEntry(entryId, value)
            .then((resp) => {
                setVote(value)
                setScore(parseInt(score) + parseInt(value))
            })
            .catch((err) => {
                setError({
                    isError: true,
                    message: err.response?.data?.message || "Something went wrong."
                });
            })
            .finally(() => setLoading(false));
    }

    const handleRevokeVote = async () => {
        setLoading(true);
        EntryService.removeVoteEntry(entryId)
            .then((resp) => {
                setVote(0)
                setScore(parseInt(score) - parseInt(vote))
            })
            .catch((err) => {
                setError({
                    isError: true,
                    message: err.response?.data?.message || "Something went wrong."
                });
            })
            .finally(() => setLoading(false));
    }

    return (
        <ErrorBoundary error={error} loading={loading} >
            <div className="flex items-center space-x-2 text-sm">
                {isAuthenticated ? (
                    <>
                        {vote !== -1 &&
                            <button
                                onClick={() => {
                                    vote === 1
                                        ? handleRevokeVote()
                                        : handleVote(1)
                                }}
                                className={`px-2 py-1 rounded ${vote === 1 ? 'bg-green-200' : 'bg-gray-100'}`}
                            >
                                👍
                            </button>
                        }
                        <span className="font-bold">{score}</span>
                        {vote !== 1 &&
                            <button
                                onClick={() => {
                                    vote === -1
                                        ? handleRevokeVote()
                                        : handleVote(-1)
                                }}
                                className={`px-2 py-1 rounded ${vote === -1 ? 'bg-red-200' : 'bg-gray-100'}`}
                            >
                                👎
                            </button>
                        }
                    </>
                ) : (
                    <div className="flex items-center space-x-2 text-gray-500">
                        <Link href="/auth/login">Login</Link>
                        <span> to vote:</span>
                        <span className="font-bold">{score}</span>
                    </div>
                )}
            </div >
        </ErrorBoundary>
    )
}

export default EntryVote
