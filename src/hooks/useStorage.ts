
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ensureStorageBuckets } from '@/services/storageService';

export function useStorage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (
    bucket: string,
    path: string,
    file: File
  ): Promise<string | null> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(`Attempting to upload file to bucket: ${bucket}, path: ${path}`);
      
      // First ensure all required buckets exist
      await ensureStorageBuckets();
      
      // Upload the file
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          upsert: true,
          cacheControl: '3600',
        });

      if (uploadError) {
        console.error('Error during file upload:', uploadError);
        toast.error(`Upload failed: ${uploadError.message}`);
        throw uploadError;
      }

      console.log('File uploaded successfully, data:', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      console.log('Public URL retrieved:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = async (bucket: string, path: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        throw error;
      }

      return true;
    } catch (err: any) {
      console.error('Error deleting file:', err);
      setError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadFile,
    deleteFile,
    isLoading,
    error,
  };
}
