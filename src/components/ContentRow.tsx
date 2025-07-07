import * as React from 'react';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, Check, ThumbsUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

interface ContentRowProps {
  title: string;
  items: any[];
  showProgress?: boolean;
}

const ContentRow: React.FC<ContentRowProps> = ({ title, items, showProgress = false }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const { isInMyList, addToMyList, removeFromMyList } = useData();
  const navigate = useNavigate();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const handlePlay = (item: any) => {
    const type = 'duration' in item ? 'movie' : 'tvshow';
    navigate(`/watch/${type}/${item.id}`);
  };

  const handleMyList = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInMyList(item.id)) {
      removeFromMyList(item.id);
    } else {
      addToMyList(item.id);
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 px-4 md:px-8 lg:px-16">
      <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">{title}</h2>
      
      <div className="relative group">
        {/* Left scroll button */}
        {showLeftButton && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-black/70"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Right scroll button */}
        {showRightButton && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-black/70"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Content scroll container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex space-x-2 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, index) => {
            const isMovie = 'duration' in item;
            const inMyList = isInMyList(item.id);
            const isHovered = hoveredItem === index;

            return (
              <div
                key={`${item.id}-${index}`}
                className="relative flex-shrink-0 group cursor-pointer transform transition-transform duration-300 hover:scale-105"
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => handlePlay(item)}
              >
                <div className="relative w-48 md:w-56">
                  {/* Poster Image */}
                  <div className="relative aspect-[2/3] rounded-md overflow-hidden">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {/* Progress bar for continue watching */}
                    {showProgress && item.progress && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
                        <div 
                          className="h-full bg-red-600"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center ${isHovered ? 'opacity-100' : ''}`}>
                      <Play size={40} className="text-white" fill="white" />
                    </div>
                  </div>

                  {/* Hover Info Card */}
                  {isHovered && (
                    <div className="absolute top-full left-0 right-0 z-20 bg-gray-900 rounded-b-md p-4 shadow-2xl transform scale-110 origin-top">
                      <h3 className="text-white font-semibold mb-2 text-sm">{item.title}</h3>
                      
                      {/* Action buttons */}
                      <div className="flex items-center space-x-2 mb-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlay(item);
                          }}
                          className="flex items-center justify-center w-8 h-8 bg-white text-black rounded-full hover:bg-white/90 transition-colors duration-200"
                        >
                          <Play size={16} fill="currentColor" />
                        </button>
                        
                        {/* Play Trailer Button (always visible, disabled if no trailer) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.trailerUrl) {
                              const type = 'duration' in item ? 'movie' : 'tvshow';
                              navigate(`/watch/${type}/${item.id}?trailer=true`);
                            }
                          }}
                          className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200
                            ${item.trailerUrl ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                          title={item.trailerUrl ? 'Play Trailer' : 'Trailer not available'}
                          disabled={!item.trailerUrl}
                        >
                          <Play size={16} />
                          <span className="sr-only">Play Trailer</span>
                        </button>
                        
                        <button
                          onClick={(e) => handleMyList(item, e)}
                          className="flex items-center justify-center w-8 h-8 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors duration-200"
                        >
                          {inMyList ? <Check size={16} /> : <Plus size={16} />}
                        </button>
                        
                        <button className="flex items-center justify-center w-8 h-8 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors duration-200">
                          <ThumbsUp size={16} />
                        </button>
                        
                        <button className="flex items-center justify-center w-8 h-8 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors duration-200 ml-auto">
                          <ChevronDown size={16} />
                        </button>
                      </div>

                      {/* Metadata */}
                      <div className="text-xs text-gray-300 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-400 font-semibold">{item.netflix_rating}</span>
                          <span>{item.year}</span>
                          <span className="border border-gray-500 px-1">{item.rating}</span>
                        </div>
                        
                        <div className="text-gray-400">
                          {isMovie ? item.duration : `${item.seasons} Season${item.seasons > 1 ? 's' : ''}`}
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {item.genre.slice(0, 3).map((genre: string, idx: number) => (
                            <span key={idx} className="text-gray-400">
                              {genre}
                              {idx < Math.min(item.genre.length, 3) - 1 && ' • '}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Title below poster */}
                <div className="mt-2 px-1">
                  <h3 className="text-white text-sm font-medium truncate">{item.title}</h3>
                  <p className="text-gray-400 text-xs">
                    {isMovie ? item.year : `${item.year} • ${item.seasons} Season${item.seasons > 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContentRow;
