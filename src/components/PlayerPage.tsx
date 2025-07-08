import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  SkipBack, 
  SkipForward,
  Rewind,
  FastForward
} from 'lucide-react';
import { useData } from '../context/DataContext';

const PlayerPage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { getContentById } = useData();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [content, setContent] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isLoading, setIsLoading] = useState(true);
  const [isTrailer, setIsTrailer] = useState(false);

  useEffect(() => {
    if (type && id) {
      const contentData = getContentById(parseInt(id), type as 'movie' | 'tvshow');
      setContent(contentData);
      // Check if we're playing a trailer from the URL
      const params = new URLSearchParams(window.location.search);
      setIsTrailer(params.get('trailer') === 'true');
    }
  }, [type, id, getContentById]);

  // Simulated video playback using timers
  useEffect(() => {
    // Set up simulated video duration based on content
    if (content) {
      let videoDuration;
      if ('duration' in content) {
        // For movies, extract minutes from duration string like "148 min"
        const minutes = parseInt(content.duration.split(' ')[0]);
        videoDuration = minutes * 60; // Convert to seconds
      } else {
        // For TV shows, assume 45 minutes per episode
        videoDuration = 45 * 60;
      }
      setDuration(videoDuration);
      setIsLoading(false);
    }
  }, [content]);

  // Simulated playback timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && duration > 0) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isPlaying) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } else {
      setShowControls(true);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = parseInt(e.target.value);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newVolume = parseInt(e.target.value);
      videoRef.current.volume = newVolume / 100;
      setVolume(newVolume);
      setIsMuted(false);
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Generate a procedural video using canvas
  const createDemoVideo = (content: any) => {
    // For demo purposes, we'll simulate video playback with a dynamic canvas
    // This ensures videos will always "play" regardless of external sources
    return null; // We'll handle this differently in the JSX
  };

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading player...</div>
      </div>
    );
  }

  // Show only the trailer if requested
  if (isTrailer && content.trailerUrl) {
    // Ensure autoplay for YouTube trailers
    let trailerSrc = content.trailerUrl;
    if (trailerSrc.includes('youtube.com') && !trailerSrc.includes('autoplay=1')) {
      trailerSrc += (trailerSrc.includes('?') ? '&' : '?') + 'autoplay=1';
    }
    return (
      <div className="relative w-full h-screen bg-black">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-50 text-white hover:opacity-80"
        >
          <ArrowLeft size={24} />
        </button>
        <iframe
          src={trailerSrc}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    );
  }

  const progressPercentage = (currentTime / duration) * 100;

  // Detect if the videoUrl is a YouTube embed link
  const isYouTube = content.videoUrl && content.videoUrl.includes('youtube.com/embed/');

  return (
    <div 
      className="relative min-h-screen bg-black overflow-hidden cursor-none"
      onMouseMove={() => setShowControls(true)}
      onClick={handlePlayPause}
    >
      {/* Video Player */}
      {isYouTube ? (
        <iframe
          src={content.videoUrl + (content.videoUrl.includes('?') ? '&' : '?') + 'autoplay=1'}
          className="absolute inset-0 w-full h-full object-contain bg-black"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          frameBorder="0"
          title={content.title}
        />
      ) : (
        <>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-contain bg-black"
            src={content.videoUrl}
            poster={content.poster}
            preload="metadata"
            playsInline
            muted={isMuted}
            autoPlay={isPlaying}
            onLoadedMetadata={(e) => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration);
                setIsLoading(false);
              }
            }}
            onTimeUpdate={(e) => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            onEnded={() => {
              setIsPlaying(false);
            }}
          />

          {/* Center Play/Pause Indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`bg-black/50 rounded-full p-8 transition-opacity duration-300 ${
              showControls && !isPlaying ? 'opacity-100' : 'opacity-0'
            }`}>
              <Play size={80} className="text-white" fill="white" />
            </div>
          </div>
        </>
      )}

      {/* Loading/Buffering indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading video...</p>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <ArrowLeft size={24} />
              <span className="text-lg">Back</span>
            </button>
            
            <div className="text-white text-center">
              <h1 className="text-2xl font-bold">{content.title}</h1>
              <p className="text-gray-300">
                {'duration' in content 
                  ? `${content.year} • ${content.duration}` 
                  : `${content.year} • Season 1, Episode 1`
                }
              </p>
            </div>
            
            <button className="text-white hover:text-gray-300 transition-colors duration-200">
              <Settings size={24} />
            </button>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${progressPercentage}%, #4b5563 ${progressPercentage}%, #4b5563 100%)`
              }}
            />
            <div className="flex justify-between text-white text-sm mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkip(-10);
                }}
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                <Rewind size={32} />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkip(-30);
                }}
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                <SkipBack size={32} />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
                className="text-white hover:text-gray-300 transition-colors duration-200 bg-white/20 rounded-full p-3"
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} fill="white" />}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkip(30);
                }}
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                <SkipForward size={32} />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkip(10);
                }}
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                <FastForward size={32} />
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-4">
              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMute();
                  }}
                  className="text-white hover:text-gray-300 transition-colors duration-200"
                >
                  {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Fullscreen functionality would go here
                }}
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                <Maximize size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Episode info for TV shows */}
      {'seasons' in content && (
        <div className={`absolute top-20 right-6 bg-black/80 rounded-lg p-4 max-w-xs transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          <h3 className="text-white font-semibold mb-2">Episode Info</h3>
          <p className="text-gray-300 text-sm mb-2">Season 1, Episode 1</p>
          <p className="text-gray-400 text-xs">{content.description.substring(0, 100)}...</p>
        </div>
      )}
    </div>
  );
};

export default PlayerPage;
