import type { Movie } from "./types" // Assuming Movie type is declared in a separate file

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY
const BASE_URL = "https://www.omdbapi.com"
const currentYear = new Date().getFullYear();

export async function searchMoviesAPI(query: string, page = 1) {
  try {
    const response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.Response === "False") {
      throw new Error(data.Error || "No movies found")
    }

    return data
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

export async function getLatestMoviesAPI(): Promise<Movie[]> {
  try {
    // Search for popular recent movies to show as latest
    const popularSearches = ["Avengers", "Batman", "Spider", "Marvel", "Star Wars", "Fast", "Mission", "John Wick"]
    const randomSearch = popularSearches[Math.floor(Math.random() * popularSearches.length)]

    const response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&s=${randomSearch}&y=${currentYear}`)

    if (!response.ok) {
      // Fallback to a broader search
      const fallbackResponse = await fetch(`${BASE_URL}/?apikey=${API_KEY}&s=movie&y=${currentYear}`)
      if (!fallbackResponse.ok) {
        throw new Error("Failed to fetch latest movies")
      }
      const fallbackData = await fallbackResponse.json()
      return (fallbackData.Search || []).slice(0, 8)
    }

    const data = await response.json()

    if (data.Response === "False") {
      // Try another search term
      const fallbackResponse = await fetch(`${BASE_URL}/?apikey=${API_KEY}&s=action&y=${currentYear}`)
      if (!fallbackResponse.ok) {
        throw new Error("Failed to fetch latest movies")
      }
      const fallbackData = await fallbackResponse.json()
      return (fallbackData.Search || []).slice(0, 8)
    }

    return (data.Search || []).slice(0, 8)
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

export async function getMovieDetailsAPI(id: string) {
  try {
    const response = await fetch(`${BASE_URL}/?apikey=${API_KEY}&i=${id}&plot=full`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.Response === "False") {
      throw new Error(data.Error || "Movie not found!")
    }

    return data
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}
