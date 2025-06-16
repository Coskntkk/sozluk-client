import { useState, useEffect } from "react"
import TitleHeader from "@/components/shared/TitleHeader"
import ErrorBoundary from "@/layout/ErrorBoundary"
import EntryService from "@/services/EntryService"
import Entry from "../shared/Entry"
import Link from "next/link"
import { useTranslation } from "react-i18next"

const EntryPage = ({ id }) => {
    const { t } = useTranslation('entry_page');
    const [entry, setEntry] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState({
        isError: false,
        message: ''
    })

    const getData = () => {
        EntryService.getEntry(id)
            .then((resp) => {
                const data = resp.data.data
                setEntry(data);
            })
            .catch((err) => {
                setError({
                    isError: true,
                    message: err.response?.data?.message || "Something went wrong."
                });
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        id && getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <ErrorBoundary error={error} loading={loading}>
            <TitleHeader title={entry.title} />
            <Entry entry={entry} key={entry.id} />
            {entry.title && (
                <Link href={`/t/${entry.title.slug}`}>
                    <p className="text-end text-md fs-6 underline">{t("go_to_title")}</p>
                </Link>
            )}
        </ErrorBoundary>
    )
};

export default EntryPage
