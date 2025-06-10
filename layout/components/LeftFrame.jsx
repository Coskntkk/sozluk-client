import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import HomeService from '@/services/HomeService'

const LeftFrame = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState({
    isError: false,
    message: ''
  })

  const getData = () => {
    HomeService.getLeftframe({ limit: 12 })
      .then((resp) => {
        setData(resp.data.data.items)
      })
      .catch((err) => {
        setError({
          isError: true,
          message: err.response?.data?.message || "Something went wrong."
        });
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ErrorBoundary error={error} loading={loading}>
      <aside className="sidebar">
        <h3 className="bg-sky-500 text-white p-1 m-0 text-center text-sm">Recent</h3>
        <ul className="list-none p-0 m-0 bg-white rounded-b-lg shadow-md mb-2">
          {!loading && data.map(item => {
            return (
              <li className="border-b border-gray-200" key={item.id}>
                <Link href={`/t/${item.slug}`}>
                  <div className="container mx-auto flex">
                    <span href="#" className="block p-3 text-gray-800 text-xs hover:bg-gray-100">{item.name}</span>
                    <span href="#" className="block p-2 text-gray-800 text-xs hover:bg-gray-100">{item.entry_count}</span>
                  </div>
                </Link>
              </li>
            )
          })
          }
        </ul>
      </aside>
    </ErrorBoundary>
  )
}

export default LeftFrame