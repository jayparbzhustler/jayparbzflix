import React, { useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import ContentRow from './ContentRow';
import { useData } from '../context/DataContext';

const MyListPage: React.FC = () => {
  const { movies, tvShows, user, loading, removeFromMyList } = useData();

  // Get user's list items
  const myListItems = useMemo(() => {
    if (!user?.my_list) return [];
    
    return user.my_list.map(id => {
      const movie = movies.find(m => m.id === id);
      const tvShow = tvShows.find(s => s.id === id);
      return movie || tvShow;
    }).filter(Boolean);
  }, [user?.my_list, movies, tvShows]);

  // Group by type
  const myMovies = myListItems.filter(item => 'duration' in item);
  const myTVShows = myListItems.filter(item => 'seasons' in item);

  const handleRemoveFromList = (id: number) => {
    removeFromMyList(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <div className="text-white text-xl">Loading your list...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Header */}
      <div className="px-4 md:px-8 lg:px-16 py-8">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">My List</h1>
        <p className="text-gray-400 text-lg mb-8">
          {myListItems.length === 0 
            ? "Your list is empty. Add movies and TV shows you want to watch later!"
            : `${myListItems.length} title${myListItems.length !== 1 ? 's' : ''} in your list`
          }
        </p>
      </div>

      {/* Content */}
      <div className="pb-20">
        {myListItems.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20 px-4">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">📺</div>
              <h2 className="text-white text-2xl font-semibold mb-4">
                Start building your list
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Browse movies and TV shows and add them to your list so you can easily find them later.
              </p>
              <div className="space-y-4">
                <a 
                  href="/movies" 
                  className="block bg-red-600 text-white px-8 py-3 rounded font-semibold hover:bg-red-700 transition-colors duration-200"
                >
                  Browse Movies
                </a>
                <a 
                  href="/tv" 
                  className="block bg-white/20 text-white px-8 py-3 rounded font-semibold hover:bg-white/30 transition-colors duration-200"
                >
                  Browse TV Shows
                </a>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* All items */}
            <ContentRow title="My List" items={myListItems} />
            
            {/* Movies section */}
            {myMovies.length > 0 && (
              <ContentRow title="Movies in My List" items={myMovies} />
            )}
            
            {/* TV Shows section */}
            {myTVShows.length > 0 && (
              <ContentRow title="TV Shows in My List" items={myTVShows} />
            )}
            
            {/* Remove items section */}
            <div className="px-4 md:px-8 lg:px-16 mt-12">
              <h2 className="text-white text-xl md:text-2xl font-semibold mb-6">
                Manage Your List
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {myListItems.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="aspect-[2/3] rounded-md overflow-hidden">
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Remove button overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <button
                          onClick={() => handleRemoveFromList(item.id)}
                          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors duration-200"
                          title="Remove from My List"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-white text-sm font-medium mt-2 truncate">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {'duration' in item 
                        ? `${item.year} • Movie` 
                        : `${item.year} • ${item.seasons} Season${item.seasons > 1 ? 's' : ''}`
                      }
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyListPage;
