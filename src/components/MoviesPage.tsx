import React, { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import ContentRow from './ContentRow';
import { useData } from '../context/DataContext';

const MoviesPage: React.FC = () => {
  const { movies, loading } = useData();
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Get unique genres from movies
  const genres = useMemo(() => {
    const allGenres = movies.flatMap(movie => movie.genre);
    return ['all', ...Array.from(new Set(allGenres))];
  }, [movies]);

  // Filter and sort movies
  const filteredAndSortedMovies = useMemo(() => {
    let filtered = movies;

    // Filter by genre
    if (selectedGenre !== 'all') {
      filtered = movies.filter(movie => movie.genre.includes(selectedGenre));
    }

    // Sort movies
    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => b.year - a.year);
      case 'oldest':
        return filtered.sort((a, b) => a.year - b.year);
      case 'rating':
        return filtered.sort((a, b) => b.imdb_rating - a.imdb_rating);
      case 'title':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filtered;
    }
  }, [movies, selectedGenre, sortBy]);

  // Group movies by categories
  const featuredMovies = filteredAndSortedMovies.filter(movie => movie.featured || movie.trending);
  const actionMovies = filteredAndSortedMovies.filter(movie => movie.genre.includes('Action'));
  const dramaMovies = filteredAndSortedMovies.filter(movie => movie.genre.includes('Drama'));
  const comedyMovies = filteredAndSortedMovies.filter(movie => movie.genre.includes('Comedy'));
  const sciFiMovies = filteredAndSortedMovies.filter(movie => movie.genre.includes('Sci-Fi'));
  const thrillerMovies = filteredAndSortedMovies.filter(movie => movie.genre.includes('Thriller') || movie.genre.includes('Crime'));

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <div className="text-white text-xl">Loading movies...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Header */}
      <div className="px-4 md:px-8 lg:px-16 py-8">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-8">Movies</h1>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-white" />
            <span className="text-white">Filters:</span>
          </div>
          
          {/* Genre Filter */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-white"
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre === 'all' ? 'All Genres' : genre}
              </option>
            ))}
          </select>
          
          {/* Sort Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Highest Rated</option>
            <option value="title">A-Z</option>
          </select>
        </div>

        {/* Results count */}
        <p className="text-gray-400 mb-6">
          Showing {filteredAndSortedMovies.length} movie{filteredAndSortedMovies.length !== 1 ? 's' : ''}
          {selectedGenre !== 'all' && ` in ${selectedGenre}`}
        </p>
      </div>

      {/* Content Rows */}
      <div className="pb-20">
        {selectedGenre === 'all' ? (
          <>
            {/* Show categorized content when no filter is applied */}
            {featuredMovies.length > 0 && (
              <ContentRow title="Featured Movies" items={featuredMovies} />
            )}
            
            {actionMovies.length > 0 && (
              <ContentRow title="Action Movies" items={actionMovies} />
            )}
            
            {dramaMovies.length > 0 && (
              <ContentRow title="Drama Movies" items={dramaMovies} />
            )}
            
            {comedyMovies.length > 0 && (
              <ContentRow title="Comedy Movies" items={comedyMovies} />
            )}
            
            {sciFiMovies.length > 0 && (
              <ContentRow title="Sci-Fi Movies" items={sciFiMovies} />
            )}
            
            {thrillerMovies.length > 0 && (
              <ContentRow title="Thriller Movies" items={thrillerMovies} />
            )}
            
            {/* All movies section */}
            <ContentRow title="All Movies" items={filteredAndSortedMovies} />
          </>
        ) : (
          /* Show filtered results */
          <ContentRow 
            title={`${selectedGenre} Movies`} 
            items={filteredAndSortedMovies} 
          />
        )}
        
        {filteredAndSortedMovies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white text-xl mb-4">No movies found</p>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
