import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string[];
  rating: string;
  duration: string;
  poster: string;
  backdrop: string;
  description: string;
  imdb_rating: number;
  netflix_rating: string;
  cast: string[];
  director: string;
  featured: boolean;
  trending: boolean;
  category: string;
}

export interface TVShow {
  id: number;
  title: string;
  year: number;
  genre: string[];
  rating: string;
  seasons: number;
  episodes: number;
  poster: string;
  backdrop: string;
  description: string;
  imdb_rating: number;
  netflix_rating: string;
  cast: string[];
  creator: string;
  featured: boolean;
  trending: boolean;
  category: string;
  status: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface ContinueWatching {
  id: number;
  type: 'movie' | 'tvshow';
  progress: number;
  season?: number;
  episode?: number;
  last_watched: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  preferences: {
    genres: string[];
    maturity_rating: string;
  };
  my_list: number[];
  continue_watching: ContinueWatching[];
  recently_watched: number[];
  recommendations: number[];
}

interface DataContextType {
  movies: Movie[];
  tvShows: TVShow[];
  categories: Category[];
  user: User | null;
  loading: boolean;
  searchResults: (Movie | TVShow)[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addToMyList: (id: number) => void;
  removeFromMyList: (id: number) => void;
  isInMyList: (id: number) => boolean;
  getContentById: (id: number, type: 'movie' | 'tvshow') => Movie | TVShow | null;
  getContentByCategory: (category: string) => (Movie | TVShow)[];
  getTrendingContent: () => (Movie | TVShow)[];
  getFeaturedContent: () => Movie | TVShow | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<(Movie | TVShow)[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load movies
        const moviesResponse = await fetch('/data/movies.json');
        const moviesData = await moviesResponse.json();
        setMovies(moviesData.movies);

        // Load TV shows
        const tvShowsResponse = await fetch('/data/tvshows.json');
        const tvShowsData = await tvShowsResponse.json();
        setTVShows(tvShowsData.tvshows);

        // Load categories
        const categoriesResponse = await fetch('/data/categories.json');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories);

        // Load user data
        const userResponse = await fetch('/data/user.json');
        const userData = await userResponse.json();
        setUser(userData.user);

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const movieResults = movies.filter(movie =>
      movie.title.toLowerCase().includes(query) ||
      movie.genre.some(g => g.toLowerCase().includes(query)) ||
      movie.cast.some(c => c.toLowerCase().includes(query)) ||
      movie.director.toLowerCase().includes(query)
    );

    const tvResults = tvShows.filter(show =>
      show.title.toLowerCase().includes(query) ||
      show.genre.some(g => g.toLowerCase().includes(query)) ||
      show.cast.some(c => c.toLowerCase().includes(query)) ||
      show.creator.toLowerCase().includes(query)
    );

    setSearchResults([...movieResults, ...tvResults]);
  }, [searchQuery, movies, tvShows]);

  const addToMyList = (id: number) => {
    if (user && !user.my_list.includes(id)) {
      setUser({
        ...user,
        my_list: [...user.my_list, id]
      });
    }
  };

  const removeFromMyList = (id: number) => {
    if (user) {
      setUser({
        ...user,
        my_list: user.my_list.filter(itemId => itemId !== id)
      });
    }
  };

  const isInMyList = (id: number): boolean => {
    return user?.my_list.includes(id) || false;
  };

  const getContentById = (id: number, type: 'movie' | 'tvshow'): Movie | TVShow | null => {
    if (type === 'movie') {
      return movies.find(movie => movie.id === id) || null;
    } else {
      return tvShows.find(show => show.id === id) || null;
    }
  };

  const getContentByCategory = (category: string): (Movie | TVShow)[] => {
    const movieResults = movies.filter(movie => movie.category === category);
    const tvResults = tvShows.filter(show => show.category === category);
    return [...movieResults, ...tvResults];
  };

  const getTrendingContent = (): (Movie | TVShow)[] => {
    const trendingMovies = movies.filter(movie => movie.trending);
    const trendingTVShows = tvShows.filter(show => show.trending);
    return [...trendingMovies, ...trendingTVShows];
  };

  const getFeaturedContent = (): Movie | TVShow | null => {
    const featuredMovie = movies.find(movie => movie.featured);
    const featuredTVShow = tvShows.find(show => show.featured);
    return featuredMovie || featuredTVShow || null;
  };

  const value = {
    movies,
    tvShows,
    categories,
    user,
    loading,
    searchResults,
    searchQuery,
    setSearchQuery,
    addToMyList,
    removeFromMyList,
    isInMyList,
    getContentById,
    getContentByCategory,
    getTrendingContent,
    getFeaturedContent
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
