import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import ContentRow from './ContentRow';
import { useData } from '../context/DataContext';

const SearchPage: React.FC = () => {
  const { searchResults, searchQuery, setSearchQuery, loading } = useData();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
  };

  const clearSearch = () => {
    setLocalQuery('');
    setSearchQuery('');
  };

  // Group search results
  const movieResults = searchResults.filter(item => 'duration' in item);
  const tvShowResults = searchResults.filter(item => 'seasons' in item);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <div className="text-white text-xl">Searching...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Search Header */}
      <div className="px-4 md:px-8 lg:px-16 py-8">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-8">Search</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search for movies, TV shows, actors, directors..."
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg pl-12 pr-12 py-4 text-lg focus:outline-none focus:border-white focus:bg-gray-700 transition-colors duration-200"
            />
            {localQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </form>

        {/* Search Stats */}
        {searchQuery && (
          <div className="mb-6">
            <p className="text-gray-400 text-lg">
              {searchResults.length === 0 
                ? `No results found for "${searchQuery}"`
                : `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`
              }
            </p>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="pb-20">
        {!searchQuery ? (
          /* No search query - show suggestions */
          <div className="px-4 md:px-8 lg:px-16">
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🔍</div>
              <h2 className="text-white text-2xl font-semibold mb-4">
                Search for your next watch
              </h2>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                Find movies, TV shows, actors, directors, and more. 
                Try searching for a genre like "action" or "comedy".
              </p>
            </div>
            
            {/* Popular search suggestions */}
            <div className="mb-8">
              <h3 className="text-white text-xl font-semibold mb-4">Popular Searches</h3>
              <div className="flex flex-wrap gap-3">
                {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Romance', 'Horror', 'Documentary'].map(genre => (
                  <button
                    key={genre}
                    onClick={() => {
                      setLocalQuery(genre);
                      setSearchQuery(genre);
                    }}
                    className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : searchResults.length === 0 ? (
          /* No results */
          <div className="px-4 md:px-8 lg:px-16">
            <div className="text-center py-20">
              <div className="text-6xl mb-6">😕</div>
              <h2 className="text-white text-2xl font-semibold mb-4">
                No matches found
              </h2>
              <p className="text-gray-400 text-lg max-w-md mx-auto mb-8">
                We couldn't find anything matching "{searchQuery}". 
                Try different keywords or browse our categories.
              </p>
              
              {/* Suggestions */}
              <div className="space-y-4">
                <p className="text-white font-semibold">Try searching for:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {['Breaking Bad', 'Marvel', 'Netflix', 'Action', 'Comedy'].map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setLocalQuery(suggestion);
                        setSearchQuery(suggestion);
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Show results */
          <>
            {/* All Results */}
            <ContentRow title="Search Results" items={searchResults} />
            
            {/* Movies Results */}
            {movieResults.length > 0 && (
              <ContentRow title="Movies" items={movieResults} />
            )}
            
            {/* TV Shows Results */}
            {tvShowResults.length > 0 && (
              <ContentRow title="TV Shows" items={tvShowResults} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
