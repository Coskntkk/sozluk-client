// components/Pagination.js
import React from 'react'
import { useTranslation } from 'react-i18next';

const Pagination = ({ currentPage, totalPages, onPageChange, size }) => {
    const { t } = useTranslation('pagination');
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
                        {t("prev")}
                    </button>
                    <span className="px-3 py-1 text-gray-700">{t("page")} {currentPage} / {totalPages}</span>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-30"
                    >
                        {t("next")}
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
