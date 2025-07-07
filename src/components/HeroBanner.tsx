import React, { useState, useEffect } from 'react';
import { Play, Info, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const HeroBanner: React.FC = () => {
  const { getFeaturedContent, isInMyList, addToMyList, removeFromMyList } = useData();
  const [featuredContent, setFeaturedContent] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const content = getFeaturedContent();
    setFeaturedContent(content);
  }, [getFeaturedContent]);

  if (!featuredContent) {
    return null;
  }

  const isMovie = 'duration' in featuredContent;
  const inMyList = isInMyList(featuredContent.id);

  const handlePlay = () => {
    navigate(`/watch/${isMovie ? 'movie' : 'tvshow'}/${featuredContent.id}`);
  };

  const handleMyList = () => {
    if (inMyList) {
      removeFromMyList(featuredContent.id);
    } else {
      addToMyList(featuredContent.id);
    }
  };

  const handleMoreInfo = () => {
    // Navigate to detailed view or open modal
    console.log('More info for:', featuredContent.title);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${featuredContent.backdrop})`,
        }}
      >
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-4 md:px-8 lg:px-16">
        <div className="max-w-2xl">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
            {featuredContent.title}
          </h1>

          {/* Metadata */}
          <div className="flex items-center space-x-4 mb-4 text-white/90">
            <span className="bg-red-600 px-2 py-1 text-sm font-semibold rounded">
              {featuredContent.netflix_rating}
            </span>
            <span className="text-lg font-medium">{featuredContent.year}</span>
            <span className="border border-white/40 px-2 py-0.5 text-sm">
              {featuredContent.rating}
            </span>
            <span className="text-lg">
              {isMovie ? featuredContent.duration : `${featuredContent.seasons} Season${featuredContent.seasons > 1 ? 's' : ''}`}
            </span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-6">
            {featuredContent.genre.map((genre: string, index: number) => (
              <span key={index} className="text-white/80 text-lg">
                {genre}
                {index < featuredContent.genre.length - 1 && ' • '}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-8 max-w-lg drop-shadow-lg">
            {featuredContent.description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Play Button */}
            <button
              onClick={handlePlay}
              className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded font-semibold text-lg hover:bg-white/90 transition-colors duration-200"
            >
              <Play size={24} fill="currentColor" />
              <span>Play</span>
            </button>

            {/* More Info Button */}
            <button
              onClick={handleMoreInfo}
              className="flex items-center space-x-2 bg-white/20 text-white px-8 py-3 rounded font-semibold text-lg hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm"
            >
              <Info size={24} />
              <span>More Info</span>
            </button>

            {/* My List Button */}
            <button
              onClick={handleMyList}
              className="flex items-center justify-center w-12 h-12 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm"
              title={inMyList ? 'Remove from My List' : 'Add to My List'}
            >
              {inMyList ? <Check size={24} /> : <Plus size={24} />}
            </button>
          </div>

          {/* Cast */}
          <div className="mt-8">
            <p className="text-white/70 text-lg">
              <span className="font-semibold">Starring:</span> {featuredContent.cast.slice(0, 3).join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
};

export default HeroBanner;
