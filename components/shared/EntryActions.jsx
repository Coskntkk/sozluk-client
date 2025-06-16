import React from 'react'
import { useTranslation } from 'react-i18next';

const EntryActions = ({ isOwner, entry }) => {
    const { t } = useTranslation('entry_actions');

    const handleDelete = () => {
        if (confirm("Bu entry'yi silmek istiyor musun?")) {
            // TODO: Silme işlemi için API çağrısı
            console.log("Silindi:", entry.id);
        }
    };

    const handleReport = () => {
        // TODO: Report işlemi için API çağrısı
        console.log("Raporlandı:", entry.id);
    };

    return (
        isOwner
            ? (
                <span
                    onClick={() => { handleDelete() }}
                    className="text-red-900 text-xs hover:underline cursor-pointer"
                >
                    {t("delete")}
                </span >
            )
            : (
                < span
                    onClick={() => { handleReport() }}
                    className="text-red-900 text-xs hover:underline cursor-pointer"
                >
                    {t("report")}
                </span>
            )
    )
}

export default EntryActions