import { useState, useEffect } from "react"
import TitleService from '@/services/TitleService'
import TitleHeader from "@/components/shared/TitleHeader"
import EntryList from "@/components/shared/EntryList"
import ErrorBoundary from "@/layout/ErrorBoundary"
import Pagination from "../shared/Pagination"

const Title = ({ slug }) => {
    const [slugx, setSlugx] = useState("")
    const [title, setTitle] = useState({})
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        limit: 10
    })
    const [error, setError] = useState({
        isError: false,
        message: ''
    })
    const getData = (slug, limit, page) => {
        TitleService.getTitle(
            slug,
            {
                page: page,
                limit: limit
            }
        )
            .then((resp) => {
                const data = resp.data.data
                setTitle(data.title);
                setEntries(data.items);
                setPagination({
                    page: data.page,
                    totalPages: data.total_pages,
                    limit: data.limit
                })
            })
            .catch((err) => {
                setError({
                    isError: true,
                    message: err.response?.data?.message || "Something went wrong."
                });
            })
            .finally(() => setLoading(false));
    }

    const onPaginationChange = (newPage) => {
        setPagination({
            ...pagination,
            page: newPage
        })
        getData(slugx, pagination.limit, newPage)
    }

    useEffect(() => {
        setSlugx(slug)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    useEffect(() => {
        slugx && getData(slugx, 10, 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slugx]);

    return (
        <ErrorBoundary error={error} loading={loading}>
            <TitleHeader title={title} />
            <EntryList entries={entries} />
            <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={onPaginationChange}
            />
        </ErrorBoundary>
    )
};

export default Title
