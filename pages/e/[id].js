
import EntryPage from '@/components/Entry/EntryPage'
import { useRouter } from 'next/router'

const EntrySinglePage = () => {
    const router = useRouter()
    const { id } = router.query

    return <EntryPage id={id} />
}

export default EntrySinglePage
