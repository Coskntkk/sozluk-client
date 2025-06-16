import { useState, useEffect } from "react"
import Link from "next/link"
import TitleHeader from "@/components/shared/TitleHeader"
import EntryList from "@/components/shared/EntryList"
import ErrorBoundary from "@/layout/ErrorBoundary"
import HomeService from "@/services/HomeService"
import { useTranslation } from "react-i18next"

const HomePage = () => {
    const { t } = useTranslation('home_page');
    const [title, setTitle] = useState({})
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState({
        isError: false,
        message: ''
    })
    const getData = () => {
        HomeService.getLastTitle()
            .then((resp) => {
                setTitle(resp.data.data.title);
                setEntries(resp.data.data.items);
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
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ErrorBoundary error={error} loading={loading}>
            <TitleHeader title={title} entries={entries} />
            <EntryList entries={entries} />
            <Link href={`/t/${title.slug}`}>
                <p className="text-end text-md fs-6 underline">{t("see_all_entries")}</p>
            </Link>
        </ErrorBoundary>
    )
};

export default HomePage
