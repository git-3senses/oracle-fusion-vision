import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileVideo, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useVideoOptimization } from '@/hooks/useVideoOptimization';
import { useToast } from '@/hooks/use-toast';

interface VideoUploadOptimizerProps {
  onFileSelect: (file: File) => void;
  onUploadProgress?: (progress: number) => void;
  uploadProgress?: number;
  isUploading?: boolean;
  disabled?: boolean;
  maxSizeMB?: number;
}

const VideoUploadOptimizer: React.FC<VideoUploadOptimizerProps> = ({
  onFileSelect,
  onUploadProgress,
  uploadProgress = 0,
  isUploading = false,
  disabled = false,
  maxSizeMB = 50
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isAnalyzing, suggestion, analyzeVideo, getOptimizationTips } = useVideoOptimization();
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    
    if (!isVideo && !isImage) {
      return 'Please select a video or image file';
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      return `File size (${sizeMB.toFixed(1)}MB) exceeds ${maxSizeMB}MB limit`;
    }

    // Check for supported video formats
    if (isVideo) {
      const supportedFormats = ['video/mp4', 'video/webm', 'video/mov', 'video/avi'];
      if (!supportedFormats.includes(file.type)) {
        return 'Please use MP4, WebM, MOV, or AVI format for videos';
      }
    }

    return null;
  };

  const handleFileSelection = useCallback(async (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast({
        title: 'Invalid file',
        description: error,
        variant: 'destructive'
      });
      return;
    }

    setSelectedFile(file);

    // Analyze video for optimization suggestions
    if (file.type.startsWith('video/')) {
      await analyzeVideo(file);
    }
  }, [analyzeVideo, toast, maxSizeMB]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  }, [disabled, isUploading, handleFileSelection]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [handleFileSelection]);

  const handleUpload = useCallback(() => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  }, [selectedFile, onFileSelect]);

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-orange-500 text-white';
      case 'low': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileVideo className="h-5 w-5 mr-2" />
          Media Upload Optimizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          } ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && !isUploading && document.getElementById('file-upload')?.click()}
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileInput}
            className="hidden"
            disabled={disabled || isUploading}
          />

          {isUploading ? (
            <div className="space-y-3">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
              <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
              <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag & drop your video or image here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Max file size: {maxSizeMB}MB • Supports: MP4, WebM, MOV, JPG, PNG
              </p>
            </>
          )}
        </div>

        {/* File Info */}
        {selectedFile && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <FileVideo className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                  </p>
                </div>
              </div>
              {suggestion && (
                <Badge className={getQualityColor(suggestion.quality)}>
                  {suggestion.quality} quality
                </Badge>
              )}
            </div>

            {/* Analysis Loading */}
            {isAnalyzing && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing video...</span>
              </div>
            )}

            {/* Optimization Suggestions */}
            {suggestion && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p>{suggestion.reason}</p>
                    {suggestion.currentSize !== suggestion.suggestedSize && (
                      <p className="text-sm">
                        Potential size reduction: {formatFileSize(suggestion.currentSize)} → {formatFileSize(suggestion.suggestedSize)}
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Optimization Tips */}
            {selectedFile.type.startsWith('video/') && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Optimization Tips:</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  {getOptimizationTips(selectedFile).map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={isUploading || disabled}
              className="w-full"
              size="lg"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Media
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoUploadOptimizer;