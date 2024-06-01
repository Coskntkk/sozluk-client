import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

const LeftFrame = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const getData = () => {
    axios.get("http://localhost:5050/api/v1/titles?limit=15")
      .then((resp) => {
        console.log(resp.data);
        setData(resp.data.data.items)
        setLoading(true)
      })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <aside class="sidebar">
      <h3 class="bg-sky-500 text-white p-2 m-0 text-center text-sm">Recent</h3>
      <ul class="list-none p-0 m-0 bg-white rounded-b-lg shadow-md">
        {loading && data.map(item => {
          return (
            <li class="border-b border-gray-200" key={item.id}>
              <Link href={`/t/${item.slug}`}>
                <div className="container mx-auto flex justify-between items-center">
                  <a href="#" class="block p-3 text-gray-800 text-xs transition-colors duration-300 hover:bg-gray-100 overflow-x-auto">{item.name}</a>
                  <a href="#" class="block p-3 text-gray-800 text-xs transition-colors duration-300 hover:bg-gray-100 overflow-x-auto">{item.entry_count}</a>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>

  )
}

export default LeftFrame