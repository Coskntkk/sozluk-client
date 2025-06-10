// components/Pagination.js
import React from 'react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
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
}

export default Pagination
