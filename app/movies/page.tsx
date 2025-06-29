"use client"

import { useEffect, useCallback, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { SearchBar } from "@/components/search-bar"
import { MovieCard } from "@/components/movie-card"
import { MovieCarousel } from "@/components/movie-carousel"
import { SkeletonLoader } from "@/components/skeleton-loader"
import { ThemeToggle } from "@/components/theme-toggle"
import { Pagination } from "@/components/pagination"
import { searchMovies, clearSearch, fetchLatestMovies } from "@/store/slices/movie-slice"
import type { RootState, AppDispatch } from "@/store/store"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"

export default function MoviesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { movies, latestMovies, loading, latestLoading, error, searchQuery, currentPage, totalResults, hasMorePages } =
    useSelector((state: RootState) => state.movies)
  const { toast } = useToast()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  const lastScrollYRef = useRef(0)
  const isScrolledRef = useRef(false)

  // Page load animation
  useEffect(() => {
    setIsPageLoaded(true)
  }, [])

  // Handle scroll with aggressive debouncing and large hysteresis
  useEffect(() => {
    const handleScroll = () => {
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Debounce the scroll handling
      scrollTimeoutRef.current = setTimeout(() => {
        const scrollTop = window.scrollY
        const lastScrollY = lastScrollYRef.current
        const currentIsScrolled = isScrolledRef.current

        // Large hysteresis gap to prevent flickering
        if (scrollTop > lastScrollY) {
          // Scrolling down - compact header at 150px
          if (scrollTop > 150 && !currentIsScrolled) {
            setIsScrolled(true)
            isScrolledRef.current = true
          }
        } else {
          // Scrolling up - expand header at 50px
          if (scrollTop < 50 && currentIsScrolled) {
            setIsScrolled(false)
            isScrolledRef.current = false
          }
        }

        lastScrollYRef.current = scrollTop
      }, 50) // 50ms debounce
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Fetch latest movies on component mount
  useEffect(() => {
    dispatch(fetchLatestMovies())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleSearch = useCallback(
    (query: string) => {
      if (query.trim().length >= 2) {
        dispatch(searchMovies({ query, page: 1 }))
      } else if (query.trim().length === 0) {
        dispatch(clearSearch())
      }
    },
    [dispatch],
  )

  const handlePageChange = useCallback(
    (page: number) => {
      if (searchQuery) {
        dispatch(searchMovies({ query: searchQuery, page }))
        // Smooth scroll to top of results
        const resultsSection = document.getElementById("results-section")
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
    },
    [dispatch, searchQuery],
  )

  const displayMovies = searchQuery ? movies : latestMovies
  const isLoading = searchQuery ? loading : latestLoading

  return (
    <div
      className={`min-h-screen bg-background transition-colors duration-300 ${isPageLoaded ? "page-transition" : "opacity-0"}`}
    >
      {/* Header with Search */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top row with title and theme toggle */}
          <div
            className={`flex items-center justify-between transition-all duration-500 ease-out ${
              isScrolled ? "py-2" : "py-4"
            }`}
          >
            <h1
              className={`font-bold text-foreground transition-all duration-500 ease-out ${
                isScrolled ? "text-lg" : "text-2xl"
              }`}
            >
              Movie Search
            </h1>
            <div className="animate-slide-in-right">
              <ThemeToggle />
            </div>
          </div>

          {/* Website Description - Hide when scrolled */}
          <div
            className={`text-center transition-all duration-500 ease-out ${
              isScrolled
                ? "max-h-0 opacity-0 pb-0 pointer-events-none"
                : "max-h-40 opacity-100 pb-6 pointer-events-auto"
            }`}
            style={{
              overflow: "hidden",
            }}
          >
            <div
              className={`transition-transform duration-500 ease-out ${isScrolled ? "transform -translate-y-4" : "transform translate-y-0"}`}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 animate-fade-in">
                Discover Your Next Favorite Movie
              </h1>
              <p className="text-lg text-muted-foreground animate-fade-in animate-stagger-1">
                Search, explore, and get detailed information about movies from around the world
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div
            className={`max-w-2xl mx-auto transition-all duration-500 ease-out ${isScrolled ? "pb-3" : "pb-6"} animate-fade-in animate-stagger-2`}
          >
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Featured Carousel - Show only if we have movies and no search query */}
        {!searchQuery && displayMovies.length > 0 && (
          <div className="animate-fade-in animate-stagger-3">
            <MovieCarousel movies={displayMovies.slice(0, 5)} />
          </div>
        )}

        {/* Movies Section */}
        <div className="mb-8" id="results-section">
          <div className="flex items-center justify-between mb-6 animate-fade-in animate-stagger-4">
            <h2 className="text-2xl font-bold text-foreground">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Latest Movies"}
            </h2>
            {!searchQuery && (
              <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full animate-slide-in-right">
                Recently Released
              </span>
            )}
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`animate-fade-in animate-stagger-${Math.min(i + 1, 8)}`}>
                  <SkeletonLoader />
                </div>
              ))}
            </div>
          )}

          {!isLoading && error && searchQuery && (
            <div className="flex items-center justify-center py-12 animate-fade-in">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8 max-w-md w-full animate-scale-in">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                  <h2 className="text-lg font-semibold text-destructive">Error</h2>
                </div>
                <p className="text-destructive/80 mb-4">{error}</p>
                <p className="text-sm text-muted-foreground">
                  Try searching with different keywords or check your spelling.
                </p>
              </div>
            </div>
          )}

          {!isLoading && displayMovies.length > 0 && (
            <>
              {searchQuery && (
                <div className="mb-6 animate-fade-in">
                  <p className="text-muted-foreground">Showing 8 most recent results for "{searchQuery}"</p>
                  {totalResults > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">Found {totalResults} total results</p>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                {displayMovies.map((movie, index) => (
                  <div
                    key={movie.imdbID}
                    className={`animate-fade-in animate-stagger-${Math.min(index + 1, 8)} hover-lift`}
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>

              {/* Pagination - only show for search results */}
              {searchQuery && (
                <div className="animate-fade-in animate-stagger-5">
                  <Pagination
                    currentPage={currentPage}
                    hasMorePages={hasMorePages}
                    onPageChange={handlePageChange}
                    totalResults={totalResults}
                  />
                </div>
              )}
            </>
          )}

          {!isLoading && !searchQuery && displayMovies.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <h2 className="text-xl font-semibold mb-2 text-foreground">Welcome to Movie Search</h2>
              <p className="text-muted-foreground">Search for your favorite movies or browse the latest releases</p>
              <p className="text-sm text-muted-foreground mt-2">Enter at least 2 characters to search</p>
            </div>
          )}

          {!isLoading && searchQuery && displayMovies.length === 0 && !error && (
            <div className="text-center py-12 animate-fade-in">
              <h2 className="text-xl font-semibold mb-2 text-foreground">No movies found</h2>
              <p className="text-muted-foreground">Try searching with different keywords</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
