import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  HardDrive, 
  Trash2, 
  Eye, 
  Download,
  FileVideo,
  Image as ImageIcon,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string | null;
  metadata: Record<string, any> | null;
}

interface MediaStorageManagerProps {
  bucketName?: string;
  onFileSelect?: (file: StorageFile) => void;
}

const MediaStorageManager: React.FC<MediaStorageManagerProps> = ({
  bucketName = 'hero-media',
  onFileSelect
}) => {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 1024 * 1024 * 1024 }); // 1GB default
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchFiles();
  }, [bucketName]);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      const filesWithMetadata = data?.map((file) => ({
        ...file,
        id: file.name
      })) || [];

      setFiles(filesWithMetadata);

      // Calculate storage usage
      const totalSize = filesWithMetadata.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
      setStorageUsage(prev => ({ ...prev, used: totalSize }));

    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: 'Error',
        description: 'Failed to load media files',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([fileName]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'File deleted successfully'
      });

      fetchFiles(); // Refresh the list
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive'
      });
    }
  };

  const downloadFile = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .download(fileName);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to download file',
        variant: 'destructive'
      });
    }
  };

  const getFileUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      const kb = bytes / 1024;
      return `${kb.toFixed(1)} KB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  const getFileIcon = (mimetype?: string) => {
    if (mimetype?.startsWith('video/')) {
      return <FileVideo className="h-5 w-5" />;
    } else if (mimetype?.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5" />;
    }
    return <FileVideo className="h-5 w-5" />;
  };

  const getFileTypeColor = (mimetype?: string) => {
    if (mimetype?.startsWith('video/')) {
      return 'bg-blue-500 text-white';
    } else if (mimetype?.startsWith('image/')) {
      return 'bg-green-500 text-white';
    }
    return 'bg-gray-500 text-white';
  };

  const bulkDelete = async () => {
    if (selectedFiles.size === 0) return;

    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove(Array.from(selectedFiles));

      if (error) throw error;

      toast({
        title: 'Success',
        description: `${selectedFiles.size} files deleted successfully`
      });

      setSelectedFiles(new Set());
      fetchFiles();
    } catch (error) {
      console.error('Error deleting files:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete files',
        variant: 'destructive'
      });
    }
  };

  const toggleFileSelection = (fileName: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(fileName)) {
      newSelection.delete(fileName);
    } else {
      newSelection.add(fileName);
    }
    setSelectedFiles(newSelection);
  };

  const storagePercentage = (storageUsage.used / storageUsage.total) * 100;

  return (
    <div className="space-y-6">
      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HardDrive className="h-5 w-5 mr-2" />
            Storage Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Used: {formatFileSize(storageUsage.used)}</span>
              <span>Total: {formatFileSize(storageUsage.total)}</span>
            </div>
            <Progress value={storagePercentage} className="w-full" />
            {storagePercentage > 80 && (
              <div className="flex items-center space-x-2 text-orange-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Storage usage is high</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Media Files ({files.length})</span>
            {selectedFiles.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={bulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedFiles.size})
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">Loading files...</div>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No media files found
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    selectedFiles.has(file.name) ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(file.name)}
                      onChange={() => toggleFileSelection(file.name)}
                      className="rounded"
                    />
                    
                    <div className="text-muted-foreground">
                      {getFileIcon(file.metadata?.mimetype)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(file.metadata?.size || 0)}</span>
                        <Badge className={getFileTypeColor(file.metadata?.mimetype)}>
                          {file.metadata?.mimetype?.split('/')[1] || 'unknown'}
                        </Badge>
                        <span>
                          {new Date(file.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const url = getFileUrl(file.name);
                        window.open(url, '_blank');
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadFile(file.name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    {onFileSelect && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onFileSelect(file)}
                      >
                        Select
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteFile(file.name)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaStorageManager;