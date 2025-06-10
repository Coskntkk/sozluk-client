
import Title from '@/components/Title/Title'
import { useRouter } from 'next/router'

const TitlePage = () => {
    const router = useRouter()
    const { slug } = router.query
    
    return <Title slug={slug} />
}

export default TitlePage
