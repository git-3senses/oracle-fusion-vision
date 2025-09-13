import React, { useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideoLazyLoading } from '@/hooks/useVideoLazyLoading';
import { cn } from '@/lib/utils';

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  alt?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  lazyLoad?: boolean;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: any) => void;
}

const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
  src,
  poster,
  alt,
  className,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = false,
  lazyLoad = true,
  onLoadStart,
  onLoadEnd,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [showControls, setShowControls] = useState(false);

  const {
    videoRef,
    isInView,
    isLoaded,
    isPlaying,
    handleVideoLoad,
    handlePlay,
    handlePause
  } = useVideoLazyLoading({
    enabled: lazyLoad,
    threshold: 0.25,
    rootMargin: '100px'
  });

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    onLoadStart?.();
  }, [onLoadStart]);

  const handleLoadedData = useCallback(() => {
    setIsLoading(false);
    onLoadEnd?.();
    handleVideoLoad();
  }, [onLoadEnd, handleVideoLoad]);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setHasError(true);
    setIsLoading(false);
    onError?.(e);
  }, [onError]);

  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {
        // Auto-play failed
      });
    }
  }, [isPlaying, videoRef]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted, videoRef]);

  const toggleFullscreen = useCallback(() => {
    if (!videoRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen().catch(() => {
        // Fullscreen failed
      });
    }
  }, [videoRef]);

  const handleMouseEnter = useCallback(() => {
    setShowControls(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowControls(false);
  }, []);

  if (hasError) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground",
        className
      )}>
        <div className="text-center">
          <div className="text-2xl mb-2">⚠️</div>
          <p className="text-sm">Failed to load video</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn("relative overflow-hidden group", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading video...</p>
          </div>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={poster}
        autoPlay={autoPlay && !lazyLoad}
        muted={muted}
        loop={loop}
        playsInline
        controls={controls}
        onLoadStart={handleLoadStart}
        onLoadedData={handleLoadedData}
        onPlay={handlePlay}
        onPause={handlePause}
        onError={handleError}
        style={{ display: isLoading ? 'none' : 'block' }}
      >
        <source src={src} type="video/mp4" />
        {poster && (
          <img src={poster} alt={alt} className="w-full h-full object-cover" />
        )}
      </video>

      {/* Custom Controls Overlay */}
      {!controls && isLoaded && (showControls || !autoPlay) && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center space-x-3">
            {/* Play/Pause Button */}
            <Button
              variant="secondary"
              size="lg"
              onClick={togglePlayPause}
              className="bg-black/50 hover:bg-black/70 text-white border-none"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>

            {/* Mute Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleMute}
              className="bg-black/50 hover:bg-black/70 text-white border-none"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>

            {/* Fullscreen Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleFullscreen}
              className="bg-black/50 hover:bg-black/70 text-white border-none"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Lazy Loading Placeholder */}
      {lazyLoad && !isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center">
            <Play className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Video will load when visible</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedVideo;