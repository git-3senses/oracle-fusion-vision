import { useState, useEffect, useRef, useCallback } from 'react';

interface UseVideoLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export const useVideoLazyLoading = ({
  threshold = 0.1,
  rootMargin = '50px',
  enabled = true
}: UseVideoLazyLoadingOptions = {}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const startObserving = useCallback(() => {
    if (!enabled || !videoRef.current || observerRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Start loading video when it comes into view
          if (videoRef.current && !isLoaded) {
            videoRef.current.load();
          }
        } else {
          setIsInView(false);
          // Pause video when it goes out of view
          if (videoRef.current && isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(videoRef.current);
  }, [enabled, threshold, rootMargin, isLoaded, isPlaying]);

  const stopObserving = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  useEffect(() => {
    startObserving();

    return () => {
      stopObserving();
    };
  }, [startObserving, stopObserving]);

  const handleVideoLoad = useCallback(() => {
    setIsLoaded(true);
    
    // Auto-play if in view and user hasn't interacted yet
    if (isInView && videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Auto-play failed, which is fine
      });
    }
  }, [isInView]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return {
    videoRef,
    isInView,
    isLoaded,
    isPlaying,
    handleVideoLoad,
    handlePlay,
    handlePause
  };
};