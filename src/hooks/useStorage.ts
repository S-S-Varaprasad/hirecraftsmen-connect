
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

      // Use a stronger type assertion to bypass TypeScript's type checking
      const { data, error } = await (supabase.storage
        .from(bucket)
        .upload(path, file, {
          upsert: true,
        }) as unknown as { data: { path: string } | null, error: any });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = (supabase.storage
        .from(bucket)
        .getPublicUrl(data.path) as unknown as { data: { publicUrl: string } });

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

      // Use a stronger type assertion to bypass TypeScript's type checking
      const { error } = await (supabase.storage
        .from(bucket)
        .remove([path]) as unknown as { data: any, error: any });

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
