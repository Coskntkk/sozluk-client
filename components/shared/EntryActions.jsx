import React from 'react'

const EntryActions = ({ isOwner, entry }) => {

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
                    sil
                </span >
            )
            : (
                < span
                    onClick={() => { handleReport() }}
                    className="text-red-900 text-xs hover:underline cursor-pointer"
                >
                    şikayet et
                </span>
            )
    )
}

export default EntryActions