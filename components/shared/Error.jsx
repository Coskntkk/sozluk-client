import React from 'react'

const Error = ({ error }) => {
    const { t } = useTranslation('error');
    return (
        <div>
            {error.message || t('something_went_wrong')}
        </div>
    )
}

export default Error