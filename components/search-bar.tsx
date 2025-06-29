"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastSearchRef = useRef<string>("")

  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      // Prevent duplicate searches
      if (lastSearchRef.current === searchQuery) {
        return
      }

      lastSearchRef.current = searchQuery

      if (searchQuery.trim().length >= 2) {
        onSearch(searchQuery.trim())
      } else if (searchQuery.trim().length === 0) {
        onSearch("")
      }
    },
    [onSearch],
  )

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      debouncedSearch(query)
    }, 300)

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [query, debouncedSearch])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        type="text"
        placeholder="Search for movies... (min 2 characters)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 text-base"
      />
    </div>
  )
}
