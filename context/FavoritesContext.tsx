import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
};

type State = {
  favorites: Movie[];
};

type Action =
  | { type: 'ADD_FAVORITE'; payload: Movie }
  | { type: 'REMOVE_FAVORITE'; payload: number }
  | { type: 'LOAD_FAVORITES'; payload: Movie[] };

// Reducer 
function favoritesReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_FAVORITE':
      return { favorites: [...state.favorites, action.payload] };
    case 'REMOVE_FAVORITE':
      return { favorites: state.favorites.filter((m) => m.id !== action.payload) };
    case 'LOAD_FAVORITES':
      return { favorites: action.payload };
    default:
      return state;
  }
}

// Context
type FavoritesContextType = {
  favorites: Movie[];
  isFavorite: (id: number) => boolean;
  addFavorite: (movie: Movie) => void;
  removeFavorite: (id: number) => void;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

// Provider 
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, { favorites: [] });

  // Charger les favoris depuis AsyncStorage au démarrage
  useEffect(() => {
    AsyncStorage.getItem('favorites').then((data) => {
      if (data) {
        dispatch({ type: 'LOAD_FAVORITES', payload: JSON.parse(data) });
      }
    });
  }, []);

  // Sauvegarder à chaque changement
  useEffect(() => {
    AsyncStorage.setItem('favorites', JSON.stringify(state.favorites));
  }, [state.favorites]);

  const isFavorite = useCallback(
    (id: number) => state.favorites.some((m) => m.id === id),
    [state.favorites]
  );

  const addFavorite = useCallback((movie: Movie) => {
    dispatch({ type: 'ADD_FAVORITE', payload: movie });
  }, []);

  const removeFavorite = useCallback((id: number) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: id });
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites: state.favorites, isFavorite, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Hook custom pour consommer le context 
export function useFavorites(): FavoritesContextType {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return ctx;
}