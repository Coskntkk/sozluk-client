// components/Pagination.js
import React from 'react'

const Pagination = ({ currentPage, totalPages, onPageChange, size }) => {
    if (totalPages <= 1) return null;

    return (
        size !== "small"
            ? (
                <div className="flex justify-center gap-2 mt-4">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="px-3 py-1 border rounded disabled:opacity-30"
                    >
                        Prev
                    </button>
                    <span className="px-3 py-1 text-gray-700">Page {currentPage} / {totalPages}</span>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-30"
                    >
                        Next
                    </button>
                </div>
            )
            : (
                <div className="flex justify-center items-center gap-1 mt-3 text-xs">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="px-2 py-0.5 border rounded disabled:opacity-40 hover:bg-gray-100"
                    >
                        ‹
                    </button>
                    <span className="px-2 text-gray-700">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="px-2 py-0.5 border rounded disabled:opacity-40 hover:bg-gray-100"
                    >
                        ›
                    </button>
                </div>
            )
    )
}

export default Pagination
