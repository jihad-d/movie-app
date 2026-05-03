import { useState, useCallback } from 'react';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../constants/api';
import { Movie } from '../context/FavoritesContext';

// Type de retour du hook
type UseMoviesResult = {
  movies: Movie[];
  loading: boolean;
  page: number;
  hasMore: boolean;
  fetchMovies: (query: string, pageToLoad: number) => Promise<void>;
  reset: () => void;
};

// Hook custom pour récupérer les films depuis l'API TMDB
export function useMovies(): UseMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]); 
  const [loading, setLoading] = useState(false);     
  const [page, setPage] = useState(1);             
  const [hasMore, setHasMore] = useState(true);      

  // Fonction mémoïsée pour récupérer les films 
  const fetchMovies = useCallback(async (query: string, pageToLoad: number) => {
    setLoading(true);
    try {
      // Si une recherche est en cours on utilise l'endpoint search sinon popular
      const endpoint = query.trim()
        ? `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${pageToLoad}`
        : `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${pageToLoad}`;

      const res = await fetch(endpoint);
      const data = await res.json();

      // On remplace la liste sinon on ajoute en filtrant les doublons
      setMovies((prev) =>
        pageToLoad === 1
          ? data.results
          : [...prev, ...data.results.filter((m: Movie) => !prev.some((p) => p.id === m.id))]
      );
      setPage(pageToLoad);
      setHasMore(pageToLoad < data.total_pages); // Vérifie s'il reste des pages
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Réinitialise la liste des films
  const reset = useCallback(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, []);

  return { movies, loading, page, hasMore, fetchMovies, reset };
}