import React, { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import ContentRow from './ContentRow';
import { useData } from '../context/DataContext';

const TVShowsPage: React.FC = () => {
  const { tvShows, loading } = useData();
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Get unique genres from TV shows
  const genres = useMemo(() => {
    const allGenres = tvShows.flatMap(show => show.genre);
    return ['all', ...Array.from(new Set(allGenres))];
  }, [tvShows]);

  // Filter and sort TV shows
  const filteredAndSortedShows = useMemo(() => {
    let filtered = tvShows;

    // Filter by genre
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(show => show.genre.includes(selectedGenre));
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(show => show.status === statusFilter);
    }

    // Sort shows
    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => b.year - a.year);
      case 'oldest':
        return filtered.sort((a, b) => a.year - b.year);
      case 'rating':
        return filtered.sort((a, b) => b.imdb_rating - a.imdb_rating);
      case 'title':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case 'seasons':
        return filtered.sort((a, b) => b.seasons - a.seasons);
      default:
        return filtered;
    }
  }, [tvShows, selectedGenre, sortBy, statusFilter]);

  // Group shows by categories
  const featuredShows = filteredAndSortedShows.filter(show => show.featured || show.trending);
  const dramaShows = filteredAndSortedShows.filter(show => show.genre.includes('Drama'));
  const actionShows = filteredAndSortedShows.filter(show => show.genre.includes('Action'));
  const comedyShows = filteredAndSortedShows.filter(show => show.genre.includes('Comedy'));
  const crimeShows = filteredAndSortedShows.filter(show => show.genre.includes('Crime'));
  const sciFiShows = filteredAndSortedShows.filter(show => show.genre.includes('Fantasy') || show.genre.includes('Sci-Fi'));

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <div className="text-white text-xl">Loading TV shows...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Header */}
      <div className="px-4 md:px-8 lg:px-16 py-8">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-8">TV Shows</h1>
        
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
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-white"
          >
            <option value="all">All Status</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
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
            <option value="seasons">Most Seasons</option>
          </select>
        </div>

        {/* Results count */}
        <p className="text-gray-400 mb-6">
          Showing {filteredAndSortedShows.length} show{filteredAndSortedShows.length !== 1 ? 's' : ''}
          {selectedGenre !== 'all' && ` in ${selectedGenre}`}
          {statusFilter !== 'all' && ` (${statusFilter})`}
        </p>
      </div>

      {/* Content Rows */}
      <div className="pb-20">
        {selectedGenre === 'all' && statusFilter === 'all' ? (
          <>
            {/* Show categorized content when no filter is applied */}
            {featuredShows.length > 0 && (
              <ContentRow title="Featured TV Shows" items={featuredShows} />
            )}
            
            {dramaShows.length > 0 && (
              <ContentRow title="Drama Series" items={dramaShows} />
            )}
            
            {crimeShows.length > 0 && (
              <ContentRow title="Crime & Thriller Series" items={crimeShows} />
            )}
            
            {actionShows.length > 0 && (
              <ContentRow title="Action Series" items={actionShows} />
            )}
            
            {comedyShows.length > 0 && (
              <ContentRow title="Comedy Series" items={comedyShows} />
            )}
            
            {sciFiShows.length > 0 && (
              <ContentRow title="Sci-Fi & Fantasy Series" items={sciFiShows} />
            )}
            
            {/* Binge-worthy shows */}
            <ContentRow 
              title="Binge-Worthy Series" 
              items={filteredAndSortedShows.filter(show => show.episodes >= 30)} 
            />
            
            {/* All shows section */}
            <ContentRow title="All TV Shows" items={filteredAndSortedShows} />
          </>
        ) : (
          /* Show filtered results */
          <ContentRow 
            title={`${selectedGenre !== 'all' ? selectedGenre : 'TV'} Shows${statusFilter !== 'all' ? ` (${statusFilter})` : ''}`} 
            items={filteredAndSortedShows} 
          />
        )}
        
        {filteredAndSortedShows.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white text-xl mb-4">No TV shows found</p>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TVShowsPage;
