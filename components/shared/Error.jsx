import React from 'react'
import { useTranslation } from 'react-i18next';

const Error = ({ error }) => {
    const { t } = useTranslation('error');
    return (
        <div>
            {error.message || t('something_went_wrong')}
        </div>
    )
}

export default Error