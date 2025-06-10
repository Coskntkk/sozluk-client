
import User from '@/components/User/User'
import { useRouter } from 'next/router'

const UserPage = () => {
    const router = useRouter()
    const { username } = router.query

    return <User username={username} />
}

export default UserPage
