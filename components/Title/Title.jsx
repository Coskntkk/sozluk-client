import { useState, useEffect } from "react"
import { useRouter } from 'next/router'
import TitleService from '@/services/TitleService'
import TitleHeader from "@/components/shared/TitleHeader"
import EntryList from "@/components/shared/EntryList"
// import ErrorBoundary from "@/layout/ErrorBoundary"
import Pagination from "../shared/Pagination"
import CreateEntry from "../shared/CreateEntry"
import CreateEntryAndTitle from "../shared/CreateEntryAndTitle"

const Title = ({ slug }) => {
    const [slugx, setSlugx] = useState("")
    const [title, setTitle] = useState({})
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [titleNotFound, setTitleNotFound] = useState(false)
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        limit: 10
    })
    const router = useRouter()
    const { titleName } = router.query
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
                setTitleNotFound(false);
                setPagination({
                    page: data.page,
                    totalPages: data.total_pages,
                    limit: data.limit
                })
            })
            .catch((err) => {
                if (err.response?.status === 404) {
                    setTitleNotFound(true);
                    setTitle({ name: titleName || slug });
                    setEntries([]);
                    setPagination({
                        page: 1,
                        totalPages: 1,
                        limit: limit
                    });
                    setError({ isError: false, message: '' });
                } else {
                    setError({
                        isError: true,
                        message: err.response?.data?.message || "Something went wrong."
                    });
                }
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
        <>
            {/* <ErrorBoundary error={error} loading={loading}> */}
            <TitleHeader title={title} />
            {titleNotFound ? (
                <>
                    <div className="rounded-lg border border-slate-200 bg-white p-6 mb-6 text-slate-700">
                        <p className="text-base font-medium text-slate-900">This title doesn&apos;t exist yet.</p>
                        <p className="mt-2 text-sm text-slate-700">Post the first entry to create it.</p>
                    </div>
                    <CreateEntryAndTitle
                        titleName={titleNotFound ? (titleName || title.name || slugx) : undefined}
                    />
                </>
            ) : (
                <>
                    <EntryList entries={entries} />
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={onPaginationChange}
                    />
                    <CreateEntry
                        titleId={titleNotFound ? slugx : title.id}
                        onEntryCreated={() => getData(slugx, pagination.limit, pagination.page)}
                    />
                </>
            )}
            {/* </ErrorBoundary> */}
        </>
    )
};

export default Title
