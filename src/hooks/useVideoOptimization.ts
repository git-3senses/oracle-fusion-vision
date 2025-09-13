import { useState, useCallback, useRef } from 'react';

export interface VideoOptimizationSuggestion {
  currentSize: number;
  suggestedSize: number;
  quality: 'high' | 'medium' | 'low';
  reason: string;
}

export const useVideoOptimization = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestion, setSuggestion] = useState<VideoOptimizationSuggestion | null>(null);

  const analyzeVideo = useCallback(async (file: File): Promise<VideoOptimizationSuggestion> => {
    setIsAnalyzing(true);

    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        const duration = video.duration;
        const currentSize = file.size;
        const currentSizeMB = currentSize / (1024 * 1024);
        
        let quality: 'high' | 'medium' | 'low' = 'medium';
        let suggestedSize = currentSize;
        let reason = '';

        if (currentSizeMB > 100) {
          quality = 'low';
          suggestedSize = currentSize * 0.3;
          reason = 'File is very large. Consider compressing to reduce loading time.';
        } else if (currentSizeMB > 50) {
          quality = 'medium';
          suggestedSize = currentSize * 0.5;
          reason = 'File size is large. Compression recommended for better performance.';
        } else if (currentSizeMB > 20) {
          quality = 'high';
          suggestedSize = currentSize * 0.7;
          reason = 'Good size, minor compression could improve loading speed.';
        } else {
          quality = 'high';
          suggestedSize = currentSize;
          reason = 'File size is optimal for web delivery.';
        }

        const suggestion: VideoOptimizationSuggestion = {
          currentSize,
          suggestedSize,
          quality,
          reason
        };

        setSuggestion(suggestion);
        setIsAnalyzing(false);
        resolve(suggestion);
      };

      video.src = URL.createObjectURL(file);
    });
  }, []);

  const getOptimizationTips = useCallback((file: File) => {
    const sizeMB = file.size / (1024 * 1024);
    const tips = [];

    if (sizeMB > 50) {
      tips.push('Use H.264 codec with 1920x1080 resolution');
      tips.push('Set bitrate to 3-5 Mbps for good quality');
      tips.push('Keep frame rate at 30fps maximum');
      tips.push('Consider using HandBrake or FFmpeg for compression');
    }

    if (sizeMB > 20) {
      tips.push('Remove audio track if not needed');
      tips.push('Trim unnecessary content from start/end');
    }

    return tips;
  }, []);

  return {
    isAnalyzing,
    suggestion,
    analyzeVideo,
    getOptimizationTips
  };
};