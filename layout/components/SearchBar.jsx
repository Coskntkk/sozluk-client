import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import TitleService from '@/services/TitleService'

const SearchBar = () => {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [loadingSuggestions, setLoadingSuggestions] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [noResults, setNoResults] = useState(false)
    const dropdownRef = useRef(null)

    const slugifySearchTerm = (term) => {
        return term
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
    }

    const handleSearchSubmit = (event) => {
        event.preventDefault()
        const query = searchTerm.trim()
        if (!query) return
        router.push(`/search?q=${encodeURIComponent(query)}`)
        setShowDropdown(false)
        setSearchTerm('')
    }

    const redirectToTitle = (slug, titleName) => {
        setSearchTerm('')
        setShowDropdown(false)
        router.push({
            pathname: `/t/${encodeURIComponent(slug)}`,
            query: { titleName: titleName || searchTerm }
        })
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (!searchTerm.trim()) {
            setSuggestions([])
            setNoResults(false)
            return
        }

        setLoadingSuggestions(true)
        setNoResults(false)
        const timer = window.setTimeout(async () => {
            try {
                const response = await TitleService.searchTitleBySlug(searchTerm)
                const items = response.data?.data?.items || response.data?.data || []
                setSuggestions(items)
                setNoResults(items.length === 0)
            } catch (error) {
                setSuggestions([])
                setNoResults(true)
            } finally {
                setLoadingSuggestions(false)
            }
        }, 250)

        return () => window.clearTimeout(timer)
    }, [searchTerm])

    return (
        <div className="w-full max-w-xl" ref={dropdownRef}>
            <label htmlFor="navbar-search" className="sr-only">Search</label>
            <input
                id="navbar-search"
                type="text"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setShowDropdown(true)
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search titles..."
                className="w-full rounded-full border border-sky-300 bg-white py-2 px-4 pr-20 text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />

            {showDropdown && (suggestions.length > 0 || noResults || loadingSuggestions) && (
                <div className="absolute left-1/2 z-20 mt-2 w-1/2 -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                    {loadingSuggestions && (
                        <div className="px-4 py-3 text-sm text-slate-600">Searching...</div>
                    )}

                    {!loadingSuggestions && suggestions.length > 0 && (
                        <div className="divide-y divide-slate-200">
                            {suggestions.map((item) => {
                                const slug = item.slug || item.name || item.title
                                const label = item.name || item.title || item.slug
                                return (
                                    <button
                                        key={slug}
                                        type="button"
                                        onClick={() => redirectToTitle(slug, label)}
                                        className="w-full text-left px-4 py-3 text-sm text-slate-800 hover:bg-slate-50"
                                    >
                                        {label}
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {!loadingSuggestions && suggestions.length === 0 && noResults && (
                        <button
                            type="button"
                            onClick={() => redirectToTitle(slugifySearchTerm(searchTerm), searchTerm)}
                            className="w-full text-left px-4 py-3 text-sm text-slate-800 hover:bg-slate-50"
                        >
                            {searchTerm}
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default SearchBar
