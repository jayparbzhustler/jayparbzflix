import React from 'react';
import HeroBanner from './HeroBanner';
import ContentRow from './ContentRow';
import { useData } from '../context/DataContext';

const HomePage: React.FC = () => {
  const { 
    movies, 
    tvShows, 
    loading, 
    user,
    getTrendingContent,
    getContentByCategory 
  } = useData();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const trendingContent = getTrendingContent();
  const actionContent = getContentByCategory('action');
  const dramaContent = getContentByCategory('drama');
  const comedyContent = getContentByCategory('comedy');
  const sciFiContent = getContentByCategory('sci-fi');
  const crimeContent = getContentByCategory('crime');

  // Continue watching items
  const continueWatchingItems = user?.continue_watching?.map(item => {
    const content = item.type === 'movie' 
      ? movies.find(m => m.id === item.id)
      : tvShows.find(s => s.id === item.id);
    return content ? { ...content, progress: item.progress, type: item.type } : null;
  }).filter(Boolean) || [];

  // My List items
  const myListItems = user?.my_list?.map(id => {
    const movie = movies.find(m => m.id === id);
    const tvShow = tvShows.find(s => s.id === id);
    return movie || tvShow;
  }).filter(Boolean) || [];

  // Recently added content (newest first)
  const recentlyAdded = [...movies, ...tvShows]
    .sort((a, b) => b.year - a.year)
    .slice(0, 20);

  return (
    <div className="min-h-screen bg-black">
      <HeroBanner />
      
      <div className="relative z-10 -mt-32 pb-20">
        {/* Continue Watching */}
        {continueWatchingItems.length > 0 && (
          <ContentRow
            title="Continue Watching for Jay"
            items={continueWatchingItems}
            showProgress={true}
          />
        )}

        {/* Trending Now */}
        <ContentRow
          title="Trending Now"
          items={trendingContent}
        />

        {/* My List */}
        {myListItems.length > 0 && (
          <ContentRow
            title="My List"
            items={myListItems}
          />
        )}

        {/* Recently Added */}
        <ContentRow
          title="New Releases"
          items={recentlyAdded}
        />

        {/* Action Movies & Shows */}
        <ContentRow
          title="Action & Adventure"
          items={actionContent}
        />

        {/* Drama */}
        <ContentRow
          title="Drama Series & Films"
          items={dramaContent}
        />

        {/* Comedy */}
        <ContentRow
          title="Comedy"
          items={comedyContent}
        />

        {/* Sci-Fi & Fantasy */}
        <ContentRow
          title="Sci-Fi & Fantasy"
          items={sciFiContent}
        />

        {/* Crime & Thriller */}
        <ContentRow
          title="Crime & Thriller"
          items={crimeContent}
        />

        {/* JayParbzFlix Originals */}
        <ContentRow
          title="JayParbzFlix Originals"
          items={[...movies, ...tvShows].filter(item => 
            item.title.includes('Stranger Things') || 
            item.title.includes('The Crown') ||
            item.title.includes('Ozark') ||
            item.title.includes('House of Cards')
          )}
        />

        {/* Popular Movies */}
        <ContentRow
          title="Popular Movies"
          items={movies.filter(movie => movie.imdb_rating >= 8.0)}
        />

        {/* Binge-Worthy TV */}
        <ContentRow
          title="Binge-Worthy TV Series"
          items={tvShows.filter(show => show.episodes >= 20)}
        />
      </div>
    </div>
  );
};

export default HomePage;
