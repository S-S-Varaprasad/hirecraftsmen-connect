
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

      // Cast the entire supabase.storage to any to bypass type checking
      const { data, error } = await (supabase.storage as any)
        .from(bucket)
        .upload(path, file, {
          upsert: true,
        });

      if (error) {
        throw error;
      }

      // Get public URL with stronger type assertion
      const { data: urlData } = (supabase.storage as any)
        .from(bucket)
        .getPublicUrl(data.path);

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

      // Cast the entire supabase.storage to any to bypass type checking
      const { error } = await (supabase.storage as any)
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
